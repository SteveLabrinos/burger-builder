import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import Checkout from './containers/Checkout/Checkout';
import Orders from './containers/Orders/Orders';
import Auth from './containers/Auth/Auth';
import Logout from './containers/Auth/Logout/Logout';
import { authCheckState } from './store/actions';

const App = props => {

    const { onTryAutoSignUp } = props;

    React.useEffect(() => {
        onTryAutoSignUp();
    }, [onTryAutoSignUp]);

    const authRouting = props.isAuthenticated ?
        (
            <Switch>
                <Route path="/checkout" component={Checkout} />
                <Route path="/orders"  exact component={Orders} />
                <Route path="/logout" component={Logout} />
                <Route path="/"  exact component={BurgerBuilder} />
                <Redirect to="/" />
            </Switch>
        ) :
        (
            <Switch>
                <Route path="/auth"  exact component={Auth} />
                <Route path="/"  exact component={BurgerBuilder} />
                <Redirect to="/" />
            </Switch>
        );

    return (
        <div>
            <Layout>
                { authRouting }
                {/*<Switch>*/}
                {/*    <Route path="/checkout" component={Checkout}/>*/}
                {/*    <Route path="/orders"  exact component={Orders}/>*/}
                {/*    <Route path="/auth"  exact component={Auth}/>*/}
                {/*    <Route path="/logout" component={Logout} />*/}
                {/*    <Route path="/"  exact component={BurgerBuilder}/>*/}
                {/*</Switch>*/}
            </Layout>
        </div>
    );
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onTryAutoSignUp: () => dispatch(authCheckState())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
