import React, {Component} from 'react';
import { connect } from 'react-redux';

import * as actionTypes from '../../store/actions';
import Auxiliary from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';


class BurgerBuilder extends Component {

    state = {
        purchasing: false,
        loading: false,
        error: false
    };

    updatePurchaseState(updatedIngredients) {
        const sum = Object.keys(updatedIngredients)
            .map(idKey => updatedIngredients[idKey])
            .reduce((sum, el) => sum + el, 0);

        return sum > 0;
    }

    purchaseHandler = () => {
        this.setState({purchasing: true});
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () => {
        //  ingredients and totalPrice are handled by the store
        this.props.history.push(`/checkout`);
    }

    componentDidMount() {
        // axios.get('/ingredients.json')
        //     .then(response => {
        //         const sum = Object.keys(response.data)
        //             .map(key => response.data[key] * INGREDIENT_PRICES[key])
        //             .reduce((sum, cur) => {
        //                 return sum + cur;
        //             }, 4.00);
        //
        //         const purchasable = sum > 4.00;
        //
        //         this.setState({
        //             // ingredients: response.data,
        //             totalPrice: sum,
        //             purchasable: purchasable
        //         });
        //     }).catch(err => {
        //         this.setState({error: true});
        // });
    }

    render() {
        const disabledInfo = {...this.props.ings};
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }

        let burger = this.state.error ? <p>Ingredients can't load!</p> : <Spinner/>;
        let orderSummary = null;

        if (this.props.ings) {
            burger =
                <Auxiliary>
                    <Burger ingredients={this.props.ings}/>
                    <BuildControls
                        ingredientAdded={this.props.onAddIngredient}
                        ingredientRemoved={this.props.onRemoveIngredient}
                        disabled={disabledInfo}
                        purchasable={this.updatePurchaseState(this.props.ings)}
                        purchasing={this.purchaseHandler}
                        price={this.props.price}/>
                </Auxiliary>;
            orderSummary =
                <OrderSummary
                    ingredients={this.props.ings}
                    price={this.props.price}
                    purchaseCanceled={this.purchaseCancelHandler}
                    purchaseContinued={this.purchaseContinueHandler}/>;
        }

        if (this.state.loading) {
            orderSummary = <Spinner/>;
        }

        return (
            <Auxiliary>
                <Modal show={this.state.purchasing}
                       closeModal={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Auxiliary>
        );
    }
}

const mapStateToProps = state => {
    return {
        ings: state.ing.ingredients,
        price: state.ing.totalPrice
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAddIngredient: ingName => dispatch({type: actionTypes.ADD_INGREDIENT, ingredientName: ingName}),
        onRemoveIngredient: ingName => dispatch({type: actionTypes.REMOVE_INGREDIENT, ingredientName: ingName})
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));