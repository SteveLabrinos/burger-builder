import React from 'react';
import classes from './Modal.module.css';
import Auxiliary from '../../../hoc/Auxiliary';
import Backdrop from '../Backdrop/Backdrop';



const modal = props => {
    const style = {
        transform: props.show ? 'translateY(0)': 'translateY(-100vh)',
        opacity: props.show ? '1': '0',
    }

    return (
        <Auxiliary>
            <Backdrop
                show={props.show}
                close={props.closeModal}/>
            <div
                className={classes.Modal}
                style={style}>
                {props.children}
            </div>
        </Auxiliary>

    );
};

export default modal;