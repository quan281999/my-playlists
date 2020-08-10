import React, {Component} from 'react';
import {faPlayCircle, faPauseCircle, faForward, faBackward} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classes from './Player.module.css';

class Player extends Component {
    state = {
        playing: true,
        percentage: '0%',
        container: null
    }

    // Play or pause the music player
    toggle = () => {
        const audio = document.getElementById('audio');
        if (this.state.playing) {
            audio.pause();
            this.setState({playing: false});
        } else {
            audio.play();
            this.setState({playing: true});
        }
    }

    componentDidUpdate(prevProps) {
        // Add eventlistener to the audio
        if (this.props.url) {
            const audio = document.getElementById('audio');
            audio.addEventListener('timeupdate', this.updateProgress);
            const container = document.getElementById('container');
            container.addEventListener('click', this.setProgress);
        }

        // Play the song when the user select a new song
        if (prevProps.url !== this.props.url) {
            console.log(prevProps.url, this.props.url);
            this.setState({playing: true})
        } else {
            // console.log('hay');
        }
    }

    // Update the progess bar
    updateProgress = (event) => {
        const {duration, currentTime} = event.srcElement;
        const progressPercentage = (currentTime / duration) * 100;
        this.setState({percentage: `${progressPercentage}%`});
    }

    // Handle when the user click the progress bar
    setProgress = (event) => {
        const audio = document.getElementById('audio');
        const container = document.getElementById('container');
        const width = container.clientWidth;
        const clickX = event.offsetX;
        const duration = audio.duration;
        audio.currentTime = (clickX / width) * duration;
        if (!this.state.playing) {
            audio.play();
            this.setState({playing: true});
        }
    }

    render() {
        // Set up the music player
        let player = (
            <footer className={classes.Player}>
                <p className={classes.Name}>{this.props.name}</p>
                <div className={classes.Container} id='container'>
                    <div className={classes.Progress} style={{width: this.state.percentage}}></div>
                </div>
                <p>
                    <FontAwesomeIcon 
                        icon={faBackward} 
                        className={classes.Icon} 
                        size="lg"
                        onClick={this.props.prev}/>
                    <FontAwesomeIcon 
                        icon={this.state.playing ? faPauseCircle : faPlayCircle} 
                        className={classes.Icon} 
                        size="lg" 
                        onClick={this.toggle}/>
                    <FontAwesomeIcon 
                        icon={faForward} 
                        className={classes.Icon} 
                        size="lg"
                        onClick={this.props.next}/>
                </p>
                <audio src={this.props.url} id='audio' onEnded={this.props.next} autoPlay ></audio>
            </footer>
        );

        // If there is no song selected, display an alternate text
        if (!this.props.url) {
            player = (
                <footer className={classes.Player}>
                    <h1 style={{color: '#20e3cf', position: 'relative', top: '10px'}}>Choose a song to play!</h1>
                </footer>
            );
        }
        
        return player;
    }
}

export default Player;