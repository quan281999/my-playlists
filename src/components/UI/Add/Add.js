import React from 'react';
import classes from './Add.module.css';

const add = (props) => {
    return (
        <button className={classes.Add} onClick={props.onClick}>+</button>
    );
}

export default add;