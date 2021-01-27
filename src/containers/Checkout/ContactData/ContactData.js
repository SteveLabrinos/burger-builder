import React, { Component } from 'react';
import { connect } from 'react-redux';

import axios from '../../../axios-orders';
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../../store/actions/index';

import classes from './ContactData.module.css';

class ContactData extends Component {

    state = {
        orderForm: {
            //  for each input element we define the attributes
            name: {
                elementType: 'input',
                elementConf: {
                    type: 'text',
                    placeholder: 'Your Name'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false,
                errorMsg: 'Name must have a value'
            },
            address: {
                elementType: 'input',
                elementConf: {
                    type: 'text',
                    placeholder: 'Street'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false,
                errorMsg: 'Address must have a value'
            },
            zipCode: {
                elementType: 'input',
                elementConf: {
                    type: 'text',
                    placeholder: 'Zip Code'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 5,
                    maxLength: 5,
                    isNumeric: true
                },
                valid: false,
                touched: false,
                errorMsg: 'Zip Code must have a value and be 5 characters length'
            },
            country: {
                elementType: 'input',
                elementConf: {
                    type: 'text',
                    placeholder: 'Country'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false,
                errorMsg: 'Country must have a value'
            },
            email: {
                elementType: 'input',
                elementConf: {
                    type: 'email',
                    placeholder: 'Your E-Mail'
                },
                value: '',
                validation: {
                    required: true,
                    isEmail: true
                },
                valid: false,
                touched: false,
                errorMsg: 'Provide a valid E-Mail'
            },
            deliveryMethod: {
                elementType: 'select',
                elementConf: {
                    options: [
                        {
                            value: 'fast',
                            displayValue: 'Fastest'
                        },
                        {
                            value: 'cheap',
                            displayValue: 'Cheapest'
                        }
                    ]
                },
                value: 'fast',
                validation: {},
                valid: true,
                touched: false
            }
        },
        formIsValid: false
    };

    orderHandler = evt => {
        evt.preventDefault();
        //  sending a post request to the firebase server
        this.setState({loading: true});
        //  populating the orderData from the input that is passed on the state
        const orderData = {};
        Object.keys(this.state.orderForm)
            .map(element => orderData[element] = this.state.orderForm[element].value);

        const order = {
            ingredients: this.props.ings,
            price: this.props.price,
            orderData,
            userId: this.props.userId
        };

        //  storing posted data to the store
        this.props.onOrderBurger(order, this.props.token);
    }

    inputChangeHandler = (event, elementIdentifier) => {
        //  copying state form to update it immutably
        const updatedForm = {...this.state.orderForm};
        //  deep copying of nested object before updating
        const updatedElement = {...updatedForm[elementIdentifier]};
        //  changing the value of the element
        updatedElement.value = event.target.value;
        //  validation check for the updated element
        updatedElement.valid = this.checkValidity(updatedElement.value, updatedElement.validation);
        updatedElement.touched = true;
        updatedForm[elementIdentifier] = updatedElement;
        //  checking if all the form is valid
        let formIsValid = true;
        for (let updateIdentifier in updatedForm) {
            formIsValid = updatedForm[updateIdentifier].valid && formIsValid;
        }
        //  updating the state immutably
        this.setState({orderForm: updatedForm, formIsValid: formIsValid});
    }

    //  method to apply all the validation rules
    checkValidity (value, rules) {
        let isValid = true;

        if (rules.required) {
            isValid = value.trim() !== '' && isValid;
        }

        if (rules.minLength) {
            isValid = value.length >= rules.minLength && isValid;
        }

        if (rules.maxLength) {
            isValid = value.length <= rules.maxLength && isValid;
        }

        if (rules.isEmail) {
            const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-])/;
            isValid = pattern.test(value) && isValid;
        }

        if (rules.isNumeric) {
            const pattern = /^\d+$/;
            isValid = pattern.test(value) && isValid;
        }

        return isValid;
    }

    render() {
        const form = this.props.loading ?
            <Spinner/> :
            <form onSubmit={this.orderHandler}>
                {
                    //  Dynamic from creation based on state values
                    Object.keys(this.state.orderForm)
                    .map(el => (
                        <Input
                            key={el}
                            elementType={this.state.orderForm[el].elementType}
                            elementConfig={this.state.orderForm[el].elementConf}
                            elementValue={this.state.orderForm[el].value}
                            invalid={!this.state.orderForm[el].valid}
                            isTouched={this.state.orderForm[el].touched}
                            shouldValidate={this.state.orderForm[el].validation}
                            errMsg={this.state.orderForm[el].errorMsg}
                            changed={event => this.inputChangeHandler(event, el)} />
                    ))
                }
                <Button btnType="Success" disabled={!this.state.formIsValid}>ORDER</Button>
            </form>;

        return (
            <div className={classes.ContactData}>
                <h4>Enter your Contact Data</h4>
                {form}
            </div>
        );
    };
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        loading: state.order.loading,
        token: state.auth.token,
        userId: state.auth.userId
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onOrderBurger: (order, token) => dispatch(actions.purchaseBurger(order, token))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));