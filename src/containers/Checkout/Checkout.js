import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
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
        //  redirect if the user navigates without any burger ingredients added as a guard
        let summary = <Redirect to="/" />;
        if ( this.props.ings ) {
            const purchasedRedirect = this.props.purchased ?
                <Redirect to="/" /> : null;

            summary =
                <React.Fragment>
                    { purchasedRedirect }
                    <CheckoutSummary
                        ingredients={ this.props.ings }
                        cancelCheckout={ this.checkoutCancelHandler }
                        continueCheckout={ this.checkoutContinueHandler } />
                    <Route
                        path={ this.props.match.url + '/contact-data' }
                        component={ ContactData } />
                </React.Fragment>;
        }

        return summary;
    }
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        purchased: state.order.purchased
    };
};

export default connect(mapStateToProps)(Checkout);