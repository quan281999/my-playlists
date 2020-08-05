import React from 'react';
import {Link} from 'react-router-dom';
import classes from './Toolbar.module.css';

const toolbar = (props) => {
    return (
        <header className={classes.Toolbar}>
            <h1 className={classes.Logo}>MyPlaylists</h1>
            {props.isAuthenticated ? <Link to='/logout'>SIGN OUT</Link> : null}
        </header>
    );
}

export default toolbar;