import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import classes from './Auth.module.css';
import * as actions from '../../store/actions/index';

class Auth extends Component {

    state = {
        controls: {
            name: {
                elementType: 'input',
                elementConf: {
                    type: 'email',
                    placeholder: 'Email Address'
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
            password: {
                elementType: 'input',
                elementConf: {
                    type: 'password',
                    placeholder: 'Password'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 6
                },
                valid: false,
                touched: false,
                errorMsg: 'Password must have a value and be 5 characters length'
            }
        },
        isSignUp: true
    }

    componentDidMount() {
        const path = this.props.buildingBurger ? '/checkout' : '/';
        this.props.onSetAuthRedirectPath(path);
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

    inputChangedHandler = (event, controlName) => {
        const updatedControls = {
            ...this.state.controls,
            [controlName]: {
                ...this.state.controls[controlName],
                value: event.target.value,
                valid: this.checkValidity(
                    event.target.value,
                    this.state.controls[controlName].validation
                ),
                touched: true
            }
        };
        this.setState({controls: updatedControls});
    }

    submitHandler = event => {
        event.preventDefault();
        this.props.onAuth(this.state.controls.name.value, this.state.controls.password.value, this.state.isSignUp);
    }

    switchAuthModeHandler = () => {
        this.setState(prevState => ({ isSignUp: !prevState.isSignUp }));
    }

    render() {
        const errorMessage = this.props.error ?
            //  available via firebase backend
            <p>{this.props.error.message}</p> : null

        const authRedirect = this.props.isAuthenticated ?
            <Redirect to={this.props.authRedirectPath} /> : null;
        return (
                <div className={classes.Auth}>
                    {authRedirect}
                    {errorMessage}
                    {
                        !this.props.loading ?
                            <React.Fragment>
                                <form onSubmit={this.submitHandler}>
                                    {
                                        //  Dynamic from creation based on state values
                                        Object.keys(this.state.controls)
                                            .map(el => (
                                                <Input
                                                    key={el}
                                                    elementType={this.state.controls[el].elementType}
                                                    elementConfig={this.state.controls[el].elementConf}
                                                    elementValue={this.state.controls[el].value}
                                                    invalid={!this.state.controls[el].valid}
                                                    isTouched={this.state.controls[el].touched}
                                                    shouldValidate={this.state.controls[el].validation}
                                                    errMsg={this.state.controls[el].errorMsg}
                                                    changed={event => this.inputChangedHandler(event, el)} />
                                            ))
                                    }
                                    <Button btnType="Success">{!this.state.isSignUp ? 'SIGN IN' : 'SIGN UP'}</Button>
                                </form>
                                <Button
                                    btnType="Danger"
                                    clicked={this.switchAuthModeHandler}>
                                    SWITCH TO {this.state.isSignUp ? 'SIGN IN' : 'SIGN UP'}
                                </Button>
                            </React.Fragment>
                            :
                            <Spinner />
                    }
                </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token !== null,
        buildingBurger: state.burgerBuilder.building,
        authRedirectPath: state.auth.authRedirect
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password, isSignUp) => dispatch(actions.auth(email, password, isSignUp)),
        onSetAuthRedirectPath: path => dispatch(actions.setAuthRedirectPath(path))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);