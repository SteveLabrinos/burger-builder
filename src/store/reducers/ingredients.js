import * as actionTypes from '../actions';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
}

const initialState = {
    ingredients: {
        salad: 0,
        cheese: 0,
        meat: 0,
        bacon: 0
    },
    totalPrice: 4
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
      case actionTypes.ADD_INGREDIENT:
          const upgradedCount = state.ingredients[action.ingredientName] + 1;
          return {
              ...state,
              ingredients: {
                  ...state.ingredients,
                  [action.ingredientName]: upgradedCount
              },
              totalPrice: state.totalPrice + INGREDIENT_PRICES[action.ingredientName]
          };
      case actionTypes.REMOVE_INGREDIENT:
          const degradedCount = state.ingredients[action.ingredientName] > 0 ?
              state.ingredients[action.ingredientName] - 1 : 0
          return {
              ...state,
              ingredients: {
                  ...state.ingredients,
                  [action.ingredientName]: degradedCount
              },
              totalPrice: state.totalPrice - INGREDIENT_PRICES[action.ingredientName]
          };
      default:
          return state;
  }
};

export default reducer;