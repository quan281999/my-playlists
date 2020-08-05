import React from 'react';
import classes from './Song.module.css';

const song = (props) => {
    let style = null;
    if (props.isPlaying) {
        style = {
            color: '#20e3cf'
        }
    }
    
    return (
        <div className={classes.Song}>
            <p className={classes.Name} onClick={props.play} style={style}>{props.name}</p>
            <button className={classes.Delete} onClick={props.delete}>X</button>
        </div>
    );
}

export default song;