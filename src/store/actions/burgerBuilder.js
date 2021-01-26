import * as actionTypes from './actionsTypes';
import axios from '../../axios-orders';

export const addIngredient = ingName => {
    return {
        type: actionTypes.ADD_INGREDIENT,
        ingredientName: ingName
    }
};

export const removeIngredient = ingName => {
    return {
        type: actionTypes.REMOVE_INGREDIENT,
        ingredientName: ingName
    }
};

const setIngredients = ingredients => {
    return {
        type: actionTypes.SET_INGREDIENTS,
        ingredients: ingredients
    };
};

const fetchedIngredientsFailed = () => {
    return {
      type: actionTypes.FETCHED_INGREDIENTS_FAILED
    };
};

export const initIngredients = () => {
    return dispatch => {
        axios.get('/ingredients.json')
            .then(response => {
                dispatch(setIngredients(response.data));
            }).catch(error => {
                dispatch(fetchedIngredientsFailed());
        });
    };
};