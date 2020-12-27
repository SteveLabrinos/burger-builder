import React from 'react';

import classes from './Order.module.css';

const order = props => {

    const style = {
        textTransform: 'capitalize',
        display: 'inline-block',
        margin: '0 .5rem',
        border: '1px solid #ccc',
        padding: '5px'
    };

    const ingredients = [];
    for (let inName in props.ingredients) {
        ingredients.push({name: inName, amount: props.ingredients[inName]});
    }


    const ingredientOutput = ingredients.map(ig => (
        <span key={ig.name}
              style={style}>
            {ig.name} ({ig.amount})
        </span>
    ));


    return (
        <div className={classes.Order}>
            <p>Ingredients: {ingredientOutput}</p>
            <p>Price: <strong>USD: {Number.parseFloat(props.price).toFixed(2)}</strong></p>
        </div>
    );
};

export default order;