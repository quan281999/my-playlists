import React from 'react';
import Modal from '../Modal';
import Button from '../../Button/Button';

const deleteModal = (props) => {
    return (
        <Modal show={props.show} close={props.close} top='40%'>
            <p>Are you sure that you want to delete this {props.type} ?</p>
            <Button onClick={props.delete}>YES</Button>
            <Button onClick={props.close}>NO</Button>
        </Modal>
    );
}

export default deleteModal;