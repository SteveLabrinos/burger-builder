import React, {Component} from 'react';
import Auxiliary from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
}

class BurgerBuilder extends Component {

    state = {
        //  setting the ingredients dynamically from firebase
        ingredients: null,
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false
    };

    updatePurchaseState(updatedIngredients) {
        const sum = Object.keys(updatedIngredients)
            .map(idKey => updatedIngredients[idKey])
            .reduce((sum, el) => sum + el, 0);

        this.setState({purchasable: sum > 0})
    }

    //  Adding ingredients to the burger
    addIngredientHandler = type => {
        const updatedCount = this.state.ingredients[type] + 1;
        const updatedIngredients = {...this.state.ingredients};
        updatedIngredients[type] = updatedCount;

        const additionalPrice = INGREDIENT_PRICES[type];
        const updatedPrice = this.state.totalPrice + additionalPrice;

        this.setState({
            ingredients: updatedIngredients,
            totalPrice: updatedPrice
        });
        this.updatePurchaseState(updatedIngredients);
    }

    removeIngredientHandler = type => {
        // console.log('clicked');
        const updateCount = (this.state.ingredients[type] >= 1) ?
            this.state.ingredients[type] - 1 :
            0;
        console.log(updateCount);
        const updatedIngredients = {...this.state.ingredients};
        updatedIngredients[type] = updateCount;

        const updatedPrice = this.state.totalPrice - INGREDIENT_PRICES[type];

        this.setState({
            ingredients: updatedIngredients,
            totalPrice: updatedPrice
        });
        this.updatePurchaseState(updatedIngredients);
    }

    purchaseHandler = () => {
        this.setState({purchasing: true});
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () => {
        //  navigate to the checkout page
        const params = Object.keys(this.state.ingredients)
            .map(idKey => {
                return `${encodeURIComponent(idKey)}=${encodeURIComponent(this.state.ingredients[idKey])}`;
            });
        //  also adding the total price
        params.push(`price=${encodeURIComponent(this.state.totalPrice)}`);
        this.props.history.push({
            pathname: `/checkout`,
            search: `?${params.join('&')}`
        });
    }

    componentDidMount() {
        axios.get('/ingredients.json')
            .then(response => {
                const sum = Object.keys(response.data)
                    .map(key => response.data[key] * INGREDIENT_PRICES[key])
                    .reduce((sum, cur) => {
                        return sum + cur;
                    }, 4.00);

                const purchasable = sum > 4.00;

                this.setState({
                    ingredients: response.data,
                    totalPrice: sum,
                    purchasable: purchasable
                });
            }).catch(err => {
                this.setState({error: true});
        });
    }

    render() {
        const disabledInfo = {...this.state.ingredients};
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }

        let burger = this.state.error ? <p>Ingredients can't load!</p> : <Spinner/>;
        let orderSummary = null;

        if (this.state.ingredients) {
            burger =
                <Auxiliary>
                    <Burger ingredients={this.state.ingredients}/>
                    <BuildControls
                        ingredientAdded={this.addIngredientHandler}
                        ingredientRemoved={this.removeIngredientHandler}
                        disabled={disabledInfo}
                        purchasable={!this.state.purchasable}
                        purchasing={this.purchaseHandler}
                        price={this.state.totalPrice}/>
                </Auxiliary>;
            orderSummary =
                <OrderSummary
                    ingredients={this.state.ingredients}
                    price={this.state.totalPrice}
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


export default withErrorHandler(BurgerBuilder, axios);