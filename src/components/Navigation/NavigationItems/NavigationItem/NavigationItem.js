import React from 'react';
import classes from './NavigationItem.module.css';
import {NavLink, withRouter} from 'react-router-dom';

//  workaround to fix active class in NavLink
const isActive = (path, match, location) => (match || path === location.pathname);


const navigationItem = props => (
    <li className={classes.NavigationItem}>
        <NavLink to={props.link} activeClassName={classes.active} exact={props.exact}
                 isActive={isActive.bind(this, props.link)}>
            {props.children}
        </NavLink>
    </li>
);

export default withRouter(navigationItem);