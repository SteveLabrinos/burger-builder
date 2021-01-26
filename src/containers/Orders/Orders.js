import React, { Component } from 'react';
import { connect } from 'react-redux';

import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Order from '../../components/Order/Order';
import Spinner from '../../components/UI/Spinner/Spinner';
import * as actions from '../../store/actions/index';

class Orders extends Component {

    componentDidMount() {
        this.props.onFetchOrders();
    }

    render() {
        return this.props.loading ?
            <Spinner/> :
            this.props.orders.map(order => (
                <Order key={order.id}
                       ingredients={order.ingredients}
                       price={order.price}/>
            ));
    }
}

const mapStateToProps = state => {
    return {
        orders: state.order.orders,
        loading: state.order.loading
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onFetchOrders: () => dispatch(actions.fetchOrders())
    };
};

export default  connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Orders, axios));