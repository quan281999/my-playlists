import {updateObject} from '../../shared/utility';
import * as actionTypes from '../actions/actionTypes';

const initialState = {
    playlists: null,
    adding: false,
    deleting: false,
    loading: false,
    error: null,
    modalLoading: false
}


// Open adding modal
const addingStart = (state) => {
    return updateObject(state, {
        adding: true
    })
}

// Close adding modal
const addingEnd = (state) => {
    return updateObject(state, {
        adding: false
    })
}


// Begin to add the new playlist
const addPlaylistStart = (state) => {
    return updateObject(state, { 
        modalLoading: true,
        error: null
    });
}

// Successfully add the new playlist
const addPlaylistSuccess = (state) => {
    return updateObject(state, { 
        modalLoading: false,
        error: null
    });
}
 // Fail to add the new playlist
const addPlaylistFail = (state, action) => {
    return updateObject(state, { 
        modalLoading: false,
        error: action.error
    });
}

// Begin to get playlists from the database
const getPlaylistsStart = (state) => {
    return updateObject(state, {
        loading: true,
        error: null
    })
}

// Successfully get playlists from the database
const getPlaylistsSuccess = (state, action) => {
    return updateObject(state, {
        playlists: action.playlists,
        loading: false,
        error: null
    })
}

// Open the deleting modal
const deletingStart = (state) => {
    return updateObject(state, {
        deleting: true
    })
}

// Open the deleting modal
const deletingEnd = (state) => {
    return updateObject(state, {
        deleting: false
    })
}

// Begin to delete the selected playlist
const deletePlaylistStart = (state) => {
    return updateObject(state, { 
        modalLoading: true,
        error: null
    });
}

// Successfully delete the selected playlist
const deletePlaylistSuccess = (state, action) => {
    return updateObject(state, { 
        modalLoading: false,
        playlists: action.playlists,
        error: null
    });
}

 // Fail to delete the selected playlist
 const deletePlaylistFail = (state, action) => {
    return updateObject(state, { 
        modalLoading: false,
        error: action.error
    });
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ADD_PLAYLIST_START: return addPlaylistStart(state);
        case actionTypes.ADD_PLAYLIST_SUCCESS: return addPlaylistSuccess(state);
        case actionTypes.ADD_PLAYLIST_FAIL: return addPlaylistFail(state, action);
        case actionTypes.ADDING_PLAYLIST_START: return addingStart(state);
        case actionTypes.ADDING_PLAYLIST_END: return addingEnd(state);
        case actionTypes.GET_PLAYLISTS_START: return getPlaylistsStart(state);
        case actionTypes.GET_PLAYLISTS_SUCCESS: return getPlaylistsSuccess(state, action);
        case actionTypes.DELETING_PLAYLIST_START: return deletingStart(state);
        case actionTypes.DELETING_PLAYLIST_END: return deletingEnd(state);
        case actionTypes.DELETE_PLAYLIST_START: return deletePlaylistStart(state);
        case actionTypes.DELETE_PLAYLIST_SUCCESS: return deletePlaylistSuccess(state, action);
        case actionTypes.DELETE_PLAYLIST_FAIL: return deletePlaylistFail(state, action);
        default: return state;
    }
}

export default reducer;

