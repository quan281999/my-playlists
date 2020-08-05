import React from 'react';
import classes from './Playlist.module.css';

const playlist = (props) => {
    return (
        <div className={classes.Container}>
            <div className={classes.Playlist} onClick={props.onClick}>
                <p className={classes.Name}>{props.name}</p>
            </div>
            <button className={classes.Delete} onClick={props.delete}>X</button>
        </div>
        
        
    );
}

export default playlist;