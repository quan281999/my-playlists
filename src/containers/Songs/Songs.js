import React, {Component} from 'react';
import {connect} from 'react-redux';
import Song from '../../components/Song/Song';
import Add from '../../components/UI/Add/Add';
import Input from '../../components/UI/Input/Input';
import Modal from '../../components/UI/Modal/Modal';
import Delete from '../../components/UI/Modal/Delete/Delete';
import Player from '../Player/Player';
import DragDrop from '../../components/UI/Drag&Drop/Drag&Drop';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import classes from './Songs.module.css';
import {updateObject} from '../../shared/utility';
import * as actions from '../../store/actions/index';

class Songs extends Component {
    state = {
        mode: {
            elementType: 'select',
            elementConfig: {
                options: [
                    {value: 'loop', displayValue: 'Loop'},
                    {value: 'shuffle', displayValue: 'Shuffle'},
                ]
            },
            value: 'loop'
        },
        index: null,
        deleteIndex: null
    }

    componentDidMount() {
        const index = +this.props.history.location.pathname.split('/')[2];
        this.setState({index});
        const songs = this.props.playlists[index].songs;
        this.props.onSetSongs(songs);
        this.props.onSetPlayingOrder(
            this.state.mode.value, 
            songs ? songs.length : null);
    }

    showModal = () => {
        this.props.onAddingStart();
    }

    closeModal = () => {
        this.props.onAddingEnd();
    }

    handleDrop = (files) => {
        let fileList = this.props.files.slice();
        for (var i = 0; i < files.length; i++) {
            if (!files[i].name.includes('.mp3') && 
                !files[i].name.includes('.audio')) continue;
            if (!files[i].name) return;
            fileList.push(files[i]);
        }
        this.props.onAddFiles(fileList);
    }

    // Handle the input type 'file'
    chooseFilesHandler = (event) => {
        let fileList = this.props.files.slice();
        for (var i = 0; i < event.target.files.length; i++) {
            if (!event.target.files[i].name) return;
            fileList.push(event.target.files[i]);
        }
        this.props.onAddFiles(fileList);
    }

    uploadFiles = () => {
        const index = +this.props.history.location.pathname.split('/')[2];
        this.props.onUploadFiles(
            this.props.files, 
            this.props.userId, 
            index, 
            this.state.mode.value);
    }

    openDeleteModal = (index) => {
        this.setState({deleteIndex: index});
        this.props.onDeletingStart();
    }

    closeDeleteModal = () => {
        this.setState({deleteIndex: null});
        this.props.onDeletingEnd();
    }

    // Change the mode between 'loop' and 'shuffle'
    changeModeHandler = (event) => {
        // const mode = {
        //     ...this.state.mode,
        //     value: event.target.value
        // }
        const mode = updateObject(this.state.mode, {
            value: event.target.value
        })
        this.props.onSetPlayingOrder(
            event.target.value, 
            this.props.songs ? this.props.songs.length : null);
        this.setState({mode});
    }

    render() {
        // Set up the songs
        let songs;
        if (this.props.songs && this.props.songs.length !== 0) {
            songs = this.props.songs.map((song, index) => {
                const isPlaying = index === this.props.playingId;
                return (
                    <Song 
                        key={index}
                        name={song.name} 
                        duration={song.duration}
                        isPlaying={isPlaying}
                        play={() => this.props.onPlaySong(index)}
                        delete={() => this.openDeleteModal(index)}></Song>
                );
            })
        } else {
            songs = (
                <h1 style={{color: '#c9c9c9'}}>
                    Click the '+' button to add new songs!
                </h1>
            );
        }
        
        // Set up the adding modal
        let modal = (
            <Modal 
                    show={this.props.adding} 
                    close={this.closeModal}
                    top='20%'>
                        <h1 style={{marginTop: '5px'}}>Add Songs</h1>
                        <small style={{color: '#c9c9c9'}}>
                            Only .mp3 and .audio files!
                        </small>
                        <DragDrop handleDrop={this.handleDrop}>
                            <div className={classes.DragDrop}>
                                <p style={{fontSize: '20px'}}>DROP HERE</p>
                                <p style={{fontSize: '20px'}}>OR</p>
                                <label className={classes.Upload}>
                                    <input 
                                        type="file" 
                                        multiple='multiple'
                                        accept=".mp3,audio/*"
                                        onChange={this.chooseFilesHandler}/>
                                    CHOOSE FILES
                                </label>
                                {this.props.files.map((file, index) =>
                                    <p 
                                        key={index} 
                                        style={{color: '#c9c9c9'}}>
                                            {file.name}
                                    </p>
                                )}
                            </div>
                        </DragDrop>
                        <Button onClick={this.uploadFiles}>SUBMIT</Button>
                </Modal>
        );
        
        // Set up the deleting modal
        let deleteModal = (
            <Delete 
                show={this.props.deleting} 
                close={this.closeDeleteModal} 
                delete={() => this.props.onDeleteSong(
                    this.state.deleteIndex, 
                    this.props.playingId,
                    this.props.userId, 
                    this.state.index, 
                    this.props.playlists[this.state.index].name,
                    this.props.songs,
                    this.state.mode.value)}
                type='song'></Delete>
        );

        // Check whether the modal is loading or not
        if (this.props.loading && this.props.adding) {
            modal = (
                <Modal
                    show={true} 
                    top='30%'>
                        <Spinner></Spinner>
                </Modal>
            );
            
        } else if (this.props.loading && this.props.deleting) {
            deleteModal = (
                <Modal 
                    show={true} 
                    top='30%'>
                        <Spinner></Spinner>
                </Modal>
            );
        }

        // Set up the mode
        const mode = (
            <Input 
                className={classes.Mode}
                elementType={this.state.mode.elementType} 
                elementConfig={this.state.mode.elementConfig} 
                value={this.state.mode.value}
                changed={this.changeModeHandler}></Input>
        );

        // Set up the music player
        const player = (
            <Player 
                url={this.props.playingId != null ? 
                    this.props.songs[this.props.playingId].url : null}
                name={this.props.playingId != null ? 
                    this.props.songs[this.props.playingId].name : null}
                prev={this.props.onPrevSong}
                next={this.props.onNextSong}></Player>
        );

        return (
            <div className={classes.Songs}>
                <h1 className={classes.Name}>
                    {this.state.index != null ? 
                        this.props.playlists[this.state.index].name : null}</h1>
                <Add onClick={this.showModal}></Add>
                {mode}
                {songs}
                {modal}
                {deleteModal}
                {player}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        songs: state.songs.songs,
        files: state.songs.files,
        userId: state.auth.userId,
        playlists: state.playlists.playlists,
        adding: state.songs.adding,
        deleting: state.songs.deleting,
        loading: state.songs.loading,
        playingId: state.songs.playingId
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAddFiles: (files) => dispatch(actions.addFiles(files)),
        onUploadFiles: (files, userId, index, mode) => 
            dispatch(actions.uploadFiles(files, userId, index, mode)),
        onSetSongs: (songs) => dispatch(actions.setSongs(songs)),
        onAddingStart: () => dispatch(actions.addingSongsStart()),
        onAddingEnd: () => dispatch(actions.addingSongsEnd()),
        onPlaySong: (id) => dispatch(actions.playSong(id)),
        onPrevSong: () => dispatch(actions.prevSong()),
        onNextSong: () => dispatch(actions.nextSong()),
        onDeleteSong: (
            index, playingId, userId, playlistIndex, 
            playlistName, songs, mode) => 
            dispatch(actions.deleteSong(
                index, playingId, userId, playlistIndex, 
                playlistName, songs, mode)),
        onDeletingStart: () => dispatch(actions.deletingSongStart()),
        onDeletingEnd: () => dispatch(actions.deletingSongEnd()),
        onSetPlayingOrder: (mode, length) => dispatch(actions.setPlayingOrder(mode, length))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Songs);