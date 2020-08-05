import React, {Component} from 'react';
import classes from './Modal.module.css';
import Backdrop from '../Backdrop/Backdrop';

class Modal extends Component {
    shouldComponentUpdate(nextProps, nextStage) {
        if (nextProps.show !== this.props.show || nextProps.children !== this.props.children) {
            return true;
        } else {
            return false;
        }
    }

    render() {
        return (
            <React.Fragment>
                <div 
                    className={classes.Modal} 
                    style={{
                    transform: this.props.show ? 'translateY(0)' : 'translateY(-10000px)',
                    opacity: this.props.show ? '1' : '0',
                    top: this.props.top ? this.props.top : '45%'
                }}>
                    {this.props.children}
                </div>
                <Backdrop show={this.props.show} clicked={this.props.close}></Backdrop>
            </React.Fragment>
        );
    }
};

export default Modal;