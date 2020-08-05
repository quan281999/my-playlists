import {updateObject} from '../../shared/utility';
import * as actionTypes from '../actions/actionTypes';

const initialState = {
    songs: [],
    files: [],
    adding: false,
    deleting: false,
    loading: false,
    playingId: null,
    playingOrder: []
}

// Add selected files to the state
const addFiles = (state, action) => {
    return updateObject(state, { 
        files: action.files
    });
}

// Store songs in the state
const setSongs = (state, action) => {
    return updateObject(state, {
        songs: action.songs
    })
}

// Open the adding modal
const addingStart = (state) => {
    return updateObject(state, {
        adding: true
    })
}

// Close the adding modal
const addingEnd = (state) => {
    return updateObject(state, {
        adding: false,
        files: []
    })
}

// Begin to add songs to the storage and the database
const addSongsStart = (state) => {
    return updateObject(state, {
        loading: true
    })
}

// Successfully adding songs
const addSongsSuccess = (state) => {
    return updateObject(state, {
        loading: false
    })
}
// Play a song
const playSong = (state, action) => {
    return updateObject(state, {
        playingId: action.playingId
    })
}

// Open the deleting modal
const deletingStart = (state) => {
    return updateObject(state, {
        deleting: true
    })
}

// Close the deleting modal
const deletingEnd = (state) => {
    return updateObject(state, {
        deleting: false
    })
}

// Begin to delete the selected song in the database
const deleteSongStart = (state) => {
    return updateObject(state, { 
        loading: true,
        error: null
    });
}

// Successfully delete the selected song
const deleteSongSuccess = (state) => {
    return updateObject(state, { 
        loading: false,
        error: null
    });
}

// Set up the array that contains the order of songs
const setPlayingOrder = (state, action) => {
    if (action.length === 0 || !action.length) {
        return updateObject(state, {
            playingOrder: []
        })
    }

    // A function to shuffle items in the array randomly
    const shuffle = (array) => {
        var currentIndex = array.length, temporaryValue, randomIndex;
        while (0 !== currentIndex) {
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
      
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        }
        return array;
    }

    let playingOrder = [];
    for (let i = 0; i < action.length; i++) {
        playingOrder.push(i);
    }

    if (action.mode === 'shuffle') {
        playingOrder = shuffle(playingOrder);
    }
    return updateObject(state, {
        playingOrder
    })
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ADD_FILES: return addFiles(state, action);
        case actionTypes.SET_SONGS: return setSongs(state, action);
        case actionTypes.ADDING_SONGS_START: return addingStart(state);
        case actionTypes.ADDING_SONGS_END: return addingEnd(state);
        case actionTypes.ADD_SONGS_START: return addSongsStart(state);
        case actionTypes.ADD_SONGS_SUCCESS: return addSongsSuccess(state);
        case actionTypes.PLAY_SONG: return playSong(state, action);
        case actionTypes.DELETING_SONG_START: return deletingStart(state);
        case actionTypes.DELETING_SONG_END: return deletingEnd(state);
        case actionTypes.DELETE_SONG_START: return deleteSongStart(state);
        case actionTypes.DELETE_SONG_SUCCESS: return deleteSongSuccess(state);
        case actionTypes.SET_PLAYING_ORDER: return setPlayingOrder(state, action);
        default: return state;
    }
}

export default reducer;