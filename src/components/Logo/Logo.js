import React from 'react';
import burgerLogo from '../../assets/images/burger-logo.png';
import classes from './Logo.module.css';

const logo = props => (
    <div className={classes.Logo}>
        <img src={burgerLogo} alt="A logo of a delicious burger"/>
    </div>
);

export default logo;