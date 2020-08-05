import React from 'react'
import classes from './Input.module.css';

const input = (props) => {
    let inputEl = null;
    const inputClasses = [classes.InputEl];

    if(props.className) {
        inputClasses.push(props.className);
    }

    switch(props.elementType) {
        case ('input'):
            inputEl = <input 
                className={inputClasses.join(' ')} 
                {...props.elementConfig} 
                value={props.value}
                onChange={props.changed}
                onKeyPress={props.onKeyPress}></input>;
            break;
        case ('textarea'):
            inputEl = <textarea 
                className={inputClasses.join(' ')} 
                {...props.elementConfig} 
                value={props.value}
                onChange={props.changed}></textarea>;
            break;
        case ('select'):
            inputEl = <select 
                className={inputClasses.join(' ')} 
                value={props.value}
                onChange={props.changed}>
                {props.elementConfig.options.map(option => (
                    <option value={option.value} key={option.value}>{option.displayValue}</option>
                ))}    
                </select>;
            break;
        default:
            inputEl = <input 
                className={inputClasses.join(' ')} 
                {...props.elementConfig} 
                value={props.value}
                onChange={props.changed}></input>
    }

    return (
        <div 
            className={classes.Input}
            style={{padding: props.elementType === 'select' ? '0px' : '10px'}}>
            {inputEl}
        </div>
    );
}

export default input;