import * as actionTypes from './actionTypes';
import {projectDatabase, projectStorage} from '../../firebase/config';
import {store} from '../../index';

export const addFiles = (files) => {
    return {
        type: actionTypes.ADD_FILES,
        files
    }
}

export const setSongs = (songs) => {
    return {
        type: actionTypes.SET_SONGS,
        songs
    }
}

const addSongsStart = () => {
    return {
        type: actionTypes.ADD_SONGS_START
    }
}

const addSongsSuccess = () => {
    return {
        type: actionTypes.ADD_SONGS_SUCCESS
    }
}

const addSongsFail = (error) => {
    return {
        type: actionTypes.ADD_SONGS_SUCCESS,
        error
    }
}

// Add new songs to the database
const updateDatabase = (songs, index, userId, mode) => {
    return dispatch => {
        let newSongs;
        if (store.getState().songs.songs) {
            newSongs = store.getState().songs.songs.concat(songs);
        } else {
            newSongs = songs;
        }

        const playlist = store.getState().playlists.playlists[index];
        var update = {};
        const name = playlist.name;
        update[userId + '/playlists/' + index] = {name, songs: newSongs};
        projectDatabase.ref().update(update)
            .then(() => {
                dispatch(addingSongsEnd());
                dispatch(addSongsSuccess());
                dispatch(setSongs(newSongs));
                dispatch(setPlayingOrder(mode, newSongs.length));
            })
            .catch(err => {
                dispatch(addSongsFail(err));
            })
    }
}

// Get the download URLs of new songs from the storage
const getURLs = (files, userId, index, mode) => {
    return dispatch => {
        let songs = [];
        let promises = []
        files.forEach(file => {
            promises.push(projectStorage.ref().child(userId + '/' + file.name).getDownloadURL());
            // projectStorage.ref().child(userId + '/' + index + '/' + file.name).getDownloadURL()
            // .then(url => {
            //     console.log(url);
            //     songs.push({name: file.name, url})
            // })
        })
        Promise.all(promises)
            .then(urls => {
                for (let i = 0; i < files.length; i++) {
                    const song = {name: files[i].name, url: urls[i]};
                    songs.push(song);
                }
                dispatch(updateDatabase(songs, index, userId, mode));
            })
            .catch(err => {
                dispatch(addSongsFail(err));
            })
    }
}

// Upload selected files to the storage
export const uploadFiles = (files, userId, index, mode) => {
    return dispatch => {
        dispatch(addSongsStart());
        let promises = []
        for (let i = 0; i < files.length; i++) {
            const ref = projectStorage.ref(userId + '/' + files[i].name);
            promises.push(ref.put(files[i]));
                // .then(res => {
                //     dispatch(storeSongs(files[i].name, userId, index))
                // })
        }
        Promise.all(promises)
            .then(() => {
                dispatch(getURLs(files, userId, index, mode));
            })
            .catch(err => {
                dispatch(addSongsFail(err));
            })
    }
}

export const addingSongsStart = () => {
    return {
        type: actionTypes.ADDING_SONGS_START
    }
}

export const addingSongsEnd = () => {
    return {
        type: actionTypes.ADDING_SONGS_END
    }
}

export const playSong = (id) => {
    return {
        type: actionTypes.PLAY_SONG,
        playingId: id
    }
}

// Play the previous song
export const nextSong = () => {
    let playingId;
    const currentId = store.getState().songs.playingId;
    const playingOrder = store.getState().songs.playingOrder;
    const currentIndex = playingOrder.indexOf(currentId);

    if (currentIndex === playingOrder.length - 1) {
        playingId = playingOrder[0];
    } else {
        playingId = playingOrder[currentIndex + 1];
    }
    
    return {
        type: actionTypes.PLAY_SONG,
        playingId
    }
}

// Play the next song
export const prevSong = () => {
    let playingId;
    const currentId = store.getState().songs.playingId;
    const playingOrder = store.getState().songs.playingOrder;
    const currentIndex = playingOrder.indexOf(currentId);

    if (currentIndex === 0) {
        playingId = playingOrder[playingOrder.length - 1];
    } else {
        playingId = playingOrder[currentIndex - 1];
    }
    
    return {
        type: actionTypes.PLAY_SONG,
        playingId
    }
}

const deleteSongStart = () => {
    return {
        type: actionTypes.DELETE_SONG_START
    }
}

const deleteSongSuccess = () => {
    return {
        type: actionTypes.DELETE_SONG_SUCCESS
    }
}

const deleteSongsFail = (error) => {
    return {
        type: actionTypes.DELETE_SONGS_FAIL,
        error
    }
}

const resetPlaying = () => {
    return {
        type: actionTypes.RESET_PLAYING
    }
}

export const setSongsAfterDelete = (songs, playingId) => {
    return {
        type: actionTypes.SET_SONGS_AFTER_DELETE,
        songs,
        playingId
    }
}

// Delete the selected song in the database
export const deleteSong = (index, playingId, userId, playlistIndex, playlistName, songs, mode) => {
    return dispatch => {
        const song = songs[playingId];
        dispatch(deleteSongStart());
        const newSongs = [...songs.slice(0, index), ...songs.slice(index + 1)];
        var update = {};
        update['/' + userId + '/playlists/' + playlistIndex] = {name: playlistName,songs: newSongs};
        projectDatabase.ref().update(update)
            .then(() => {
                dispatch(setPlayingOrder(mode, newSongs.length));
                if (index === playingId) {
                    dispatch(resetPlaying());
                }
                if (playingId != null && index !== playingId) {
                    dispatch(setSongsAfterDelete(newSongs, newSongs.indexOf(song)));
                } else {
                    dispatch(setSongs(newSongs));
                }
                dispatch(deleteSongSuccess());
                dispatch(deletingSongEnd());
            })
            .catch(err => {
                dispatch(deleteSongsFail(err));
            })
    }
}

export const deletingSongStart = () => {
    return {
        type: actionTypes.DELETING_SONG_START
    }
}

export const deletingSongEnd = () => {
    return {
        type: actionTypes.DELETING_SONG_END
    }
}

export const setPlayingOrder = (mode, length) => {
    return {
        type: actionTypes.SET_PLAYING_ORDER,
        mode,
        length
    }
}