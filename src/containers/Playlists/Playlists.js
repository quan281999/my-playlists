import React, {Component} from 'react';
import {connect} from 'react-redux';
import Playlist from '../../components/Playlist/Playlist';
import Add from '../../components/UI/Add/Add';
import Modal from '../../components/UI/Modal/Modal';
import Delete from '../../components/UI/Modal/Delete/Delete';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import classes from './Playlists.module.css';
import {updateObject} from '../../shared/utility';
import * as actions from '../../store/actions/index';

class Playlists extends Component {
    state = {
        nameOfPlaylist: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'Name'
            },
            value: ''
        },
        deleteIndex: null
    }

    componentDidMount() {
        this.props.onGetPlaylists(this.props.userId);
    }

    openModal = () => {
        this.props.onAddingStart();
    }

    closeModal = () => {
        // const newData = {
        //     ...this.state.nameOfPlaylist,
        //     value: ''
        // }
        const newData = updateObject(this.state.nameOfPlaylist, {
            value: ''
        })
        this.setState({nameOfPlaylist: newData});
        this.props.onAddingEnd();
    }

    // Add the new playlist
    submitPlaylist = (event) => {
        if (this.state.nameOfPlaylist.value !== '' && 
            (event.key === 'Enter' || event.type === 'click')) {
            const newData = updateObject(this.state.nameOfPlaylist, {
                value: ''
            })
            this.setState({nameOfPlaylist: newData});
            this.props.onAddPlaylist(
                this.state.nameOfPlaylist.value, 
                this.props.userId, 
                this.props.playlists);
        }
    }

    // Handle the input when adding new playlist
    inputHandler = (event) => {
        // const newData = {
        //     ...this.state.nameOfPlaylist,
        //     value: event.target.value
        // }
        const newData = updateObject(this.state.nameOfPlaylist, {
            value: event.target.value
        })
        this.setState({nameOfPlaylist: newData})
    }

    // Redirect users when they click a specific playlist
    accessPlaylist = (index) => {
        this.props.history.push({
            pathname: '/playlists/' + index
        })
    }

    openDeleteModal = (index) => {
        this.setState({deleteIndex: index});
        this.props.onDeletingStart();
    }

    closeDeleteModal = () => {
        this.setState({deleteIndex: null});
        this.props.onDeletingEnd();
    }

    render() {
        // Set up the playlist
        let playlists;
        if (this.props.playlists && this.props.playlists.length !== 0) {
            playlists = this.props.playlists.map((playlist, index) => {
                return (
                    <Playlist 
                        key={index}
                        name={playlist.name} 
                        delete={() => this.openDeleteModal(index)}
                        onClick={() => this.accessPlaylist(index)}></Playlist>
                );
            })
        } else {
            playlists = (
                <h1 style={{color: '#c9c9c9'}}>
                    Click the '+' button to add new playlist!
                </h1>
            );
        }

        // Set up the adding modal
        let modal = (
            <Modal 
                show={this.props.adding} 
                close={this.closeModal}
                top='40%'>
                    <h1 style={{marginTop: '5px'}}>Add Playlist</h1>
                    <Input
                        elementType={this.state.nameOfPlaylist.elementType} 
                        elementConfig={this.state.nameOfPlaylist.elementConfig} 
                        value={this.state.nameOfPlaylist.value}
                        changed={this.inputHandler}
                        onKeyPress={this.submitPlaylist}></Input>
                    <Button onClick={this.submitPlaylist}>SUBMIT</Button>
            </Modal>
        );

        // Set up the deleting modal
        let deleteModal = (
            <Delete 
                show={this.props.deleting} 
                close={this.closeDeleteModal} 
                delete={() => this.props.onDeletePlaylist(
                    this.state.deleteIndex, 
                    this.props.userId, 
                    this.props.playlists)}
                type='playlist'></Delete>
        );

        // Check whether the modal is loading or not
        if (this.props.modalLoading && this.props.adding) {
            modal = (
                <Modal 
                    show={true} 
                    top='30%'>
                        <Spinner></Spinner>
                </Modal>
            );
            
        } else if (this.props.modalLoading && this.props.deleting) {
            deleteModal = (
                <Modal 
                    show={true} 
                    top='30%'>
                        <Spinner></Spinner>
                </Modal>
            );
        }

        // Set up the content of the page
        let content = (
            <div className={classes.Playlists}>
                <h1 style={{color: '#20e3cf'}}>PLAYLISTS</h1>
                <Add onClick={this.openModal}></Add>
                {playlists}
                {deleteModal}
                {modal}
            </div>
        );
        
        // Check whether the page is loading or not
        if (this.props.loading) {
            content = (
                <div className={classes.Playlists}>
                    <Spinner></Spinner>
                </div>
            );
        }
        
        return content;
    }
}

const mapStatetoProps = state => {
    return {
        playlists: state.playlists.playlists,
        userId: state.auth.userId,
        loading: state.playlists.loading,
        modalLoading: state.playlists.modalLoading,
        adding: state.playlists.adding,
        deleting: state.playlists.deleting
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onGetPlaylists: (userId) => dispatch(actions.getPlaylists(userId)),
        onAddPlaylist: (name, userId, playlists) => 
            dispatch(actions.addPlaylist(name, userId, playlists)),
        onAddingStart: () => dispatch(actions.addingPlaylistStart()),
        onAddingEnd: () => dispatch(actions.addingPlaylistEnd()),
        onDeletePlaylist: (index, userId, playlists) => 
            dispatch(actions.deletePlaylist(index, userId, playlists)),
        onDeletingStart: () => dispatch(actions.deletingPlaylistStart()),
        onDeletingEnd: () => dispatch(actions.deletingPlaylistEnd())

    }
}

export default connect(mapStatetoProps, mapDispatchToProps)(Playlists);