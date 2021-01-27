import React, {Component} from 'react';
import { connect } from 'react-redux';

import * as actions from '../../store/actions/index';
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
    };

    updatePurchaseState(updatedIngredients) {
        const sum = Object.keys(updatedIngredients)
            .map(idKey => updatedIngredients[idKey])
            .reduce((sum, el) => sum + el, 0);

        return sum > 0;
    }

    purchaseHandler = () => {
        if (this.props.isAuthenticated) {
            this.setState({purchasing: true})
        } else {
            //  redirect the user to checkout page after log in
            this.props.onSetAuthRedirectPath('/checkout');
            this.props.history.push('/auth');
        }
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () => {
        //  ingredients and totalPrice are handled by the store
        this.props.onInitPurchase();
        this.props.history.push(`/checkout`);
    }

    componentDidMount() {
        this.props.onInitIngredients();
    }

    render() {
        const disabledInfo = {...this.props.ings};
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }

        let burger = this.props.error ? <p>Ingredients can't load!</p> : <Spinner/>;
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
                        price={this.props.price}
                        isAuth={this.props.isAuthenticated} />
                </Auxiliary>;
            orderSummary =
                <OrderSummary
                    ingredients={this.props.ings}
                    price={this.props.price}
                    purchaseCanceled={this.purchaseCancelHandler}
                    purchaseContinued={this.purchaseContinueHandler} />;
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
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuthenticated: state.auth.token !== null
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAddIngredient: ingName => dispatch(actions.addIngredient(ingName)),
        onRemoveIngredient: ingName => dispatch(actions.removeIngredient(ingName)),
        onInitIngredients: () => dispatch(actions.initIngredients()),
        onInitPurchase: () => dispatch(actions.purchaseInit()),
        onSetAuthRedirectPath: path => dispatch(actions.setAuthRedirectPath(path))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));