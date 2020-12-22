import React from 'react';
import classes from './Burger.module.css'
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

const burger = props => {
    //  getting the object keys into an array
    //  creating nested arrays depending on the values
    //  then creating for each a BurgerIngredient with type of key and unique id
    let transformedIngredients = Object.keys(props.ingredients)
        .map(idKey => (
                [...Array(props.ingredients[idKey])]
                    .map((_, i) => (
                            <BurgerIngredient type={idKey} key={idKey + i}/>
                        )
                    )
            )
        ).reduce((arr, el) => {
            return arr.concat(el)
        }, []);

    // console.log(transformedIngredients);

    if (transformedIngredients.length === 0) {
        transformedIngredients = <p>Please start adding ingredients</p>
    }

    return (
        <div className={classes.Burger}>
            <BurgerIngredient type="bread-top" id="top-bread1"/>
            {transformedIngredients}
            <BurgerIngredient type="bread-bottom" id="bottom-bread1"/>
        </div>
    );
}

export default burger;