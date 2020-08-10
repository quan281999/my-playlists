import * as actionTypes from './actionTypes';
import {projectDatabase} from '../../firebase/config';

const addPlaylistStart = () => {
    return {
        type: actionTypes.ADD_PLAYLIST_START
    }
}

const addPlaylistSuccess = () => {
    return {
        type: actionTypes.ADD_PLAYLIST_SUCCESS
    }
}

const addPlaylistFail = (error) => {
    return {
        type: actionTypes.ADD_PLAYLIST_FAIL,
        error
    }
}

// Add new playlist to the database
export const addPlaylist = (name, userId, playlists) => {
    return dispatch => {
        dispatch(addPlaylistStart());
        let newPlaylists;
        if (!playlists) {
            newPlaylists = [{name: name}];
        } else {
            newPlaylists = playlists.concat({name: name, songs: null});
        }
        projectDatabase.ref('/' + userId).set({playlists: newPlaylists})
            .then(res => {
                dispatch(addPlaylistSuccess());
                dispatch(addingPlaylistEnd());
            })
            .catch(err => {
                dispatch(addPlaylistFail(err));
            })
    }
}

const getPlaylistsStart = () => {
    return {
        type: actionTypes.GET_PLAYLISTS_START
    }
}

const getPlaylistsSuccess = (playlists) => {
    return {
        type: actionTypes.GET_PLAYLISTS_SUCCESS,
        playlists
    }
}

// Get playlists from the database
export const getPlaylists = (userId) => {
    return dispatch => {
        dispatch(getPlaylistsStart());
        projectDatabase.ref('/' + userId + '/playlists').on('value', function(snapshot) {
            dispatch(getPlaylistsSuccess(snapshot.val()));
        })
    }
}

export const addingPlaylistStart = () => {
    return {
        type: actionTypes.ADDING_PLAYLIST_START
    }
}

export const addingPlaylistEnd = () => {
    return {
        type: actionTypes.ADDING_PLAYLIST_END
    }
}

const deletePlaylistStart = () => {
    return {
        type: actionTypes.DELETE_PLAYLIST_START
    }
}

const deletePlaylistSuccess = (playlists) => {
    return {
        type: actionTypes.DELETE_PLAYLIST_SUCCESS,
        playlists
    }
}

const deletePlaylistFail = (error) => {
    return {
        type: actionTypes.DELETE_PLAYLIST_FAIL,
        error
    }
}

// Delete the selected playlist in the database
export const deletePlaylist = (index, userId, playlists) => {
    return dispatch => {
        dispatch(deletePlaylistStart());
        const newPlaylists = [...playlists.slice(0, index), ...playlists.slice(index + 1)];
        var update = {};
        update['/' + userId] = {playlists: newPlaylists};
        projectDatabase.ref().update(update)
            .then(() => {
            dispatch(deletePlaylistSuccess(newPlaylists));
            dispatch(deletingPlaylistEnd());
            })
            .catch(err => {
                dispatch(deletePlaylistFail(err));
            })
    }
}

export const deletingPlaylistStart = () => {
    return {
        type: actionTypes.DELETING_PLAYLIST_START
    }
}

export const deletingPlaylistEnd = () => {
    return {
        type: actionTypes.DELETING_PLAYLIST_END
    }
}