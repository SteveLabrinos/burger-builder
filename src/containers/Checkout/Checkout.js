import React, {Component} from 'react';
import {Route} from 'react-router-dom';

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from './ContactData/ContactData';

class Checkout extends Component {
    state = {
        ingredients: {},
        totalPrice: 0
    }

    componentDidMount() {
        const query = new URLSearchParams(this.props.location.search);
        let ingredients = {};
        let price = 0;
        for (let param of query.entries()) {
            if (param[0] === 'price') {
                price = param[1];
            } else {
                ingredients[param[0]] = +param[1];
            }
        }
        // console.log(ingredients);
        this.setState({ingredients: ingredients, totalPrice: price});
    }

    checkoutContinueHandler = () => {
        // the user stays in the form

        this.props.history.replace(`${this.props.match.url}/contact-data`);
    }

    checkoutCancelHandler = () => {
        this.props.history.goBack();
    }

    render() {

        return (
            <div>
                <CheckoutSummary
                    ingredients={this.state.ingredients}
                    cancelCheckout={this.checkoutCancelHandler}
                    continueCheckout={this.checkoutContinueHandler}/>

                <Route path={this.props.match.url + '/contact-data'}
                       render={(props) => (<ContactData
                           ingredients={this.state.ingredients}
                           totalPrice={this.state.totalPrice}
                           {...props}/>)}/>
            </div>
        );
    }
}

export default Checkout;