import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from './ContactData/ContactData';

class Checkout extends Component {

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
                    ingredients={this.props.ings}
                    cancelCheckout={this.checkoutCancelHandler}
                    continueCheckout={this.checkoutContinueHandler}/>

                <Route path={this.props.match.url + '/contact-data'}
                       component={ContactData} />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        ings: state.ing.ingredients
    }
}

export default connect(mapStateToProps)(Checkout);