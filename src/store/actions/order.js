import * as actionTypes from './actionsTypes';
import axios from '../../axios-orders';

const purchaseBurgerSuccess = (id, orderData) => {
    return {
        type: actionTypes.PURCHASE_BURGER_SUCCESS,
        orderId: id,
        orderData: orderData
    }
};

const purchaseBurgerFail = error => {
    return {
        type: actionTypes.PURCHASE_BURGER_FAIL,
        error: error
    }
};

const purchaseBurgerStart = () => {
    return {
        type: actionTypes.PURCHASE_BURGER_START
    };
};

export const purchaseBurger = (orderData, token) => {
    return dispatch => {
        //  set loading icon until the order is posted
        dispatch(purchaseBurgerStart());
        //  post order to the server
        axios.post('/orders.json?auth=' + token, orderData)
            .then(response => {
                dispatch(purchaseBurgerSuccess(response.data.name, orderData));
            }).catch(error => {
                dispatch(purchaseBurgerFail(error));
        });
    };
};

export const purchaseInit = () => {
    return {
        type: actionTypes.PURCHASE_INIT
    }
}

const fetchOrdersSuccess = orders => {
    return {
        type: actionTypes.FETCH_ORDERS_SUCCESS,
        orders: orders
    };
};

const fetchOrdersFail = error => {
    return {
        type: actionTypes.FETCH_ORDERS_FAIL,
        error: error
    };
};

const fetchOrdersStart = () => {
    return {
        type: actionTypes.FETCH_ORDERS_START
    };
};

export const fetchOrders = (token, userId) => {
    return dispatch => {
        dispatch(fetchOrdersStart());
        const queryParams = `?auth=${token}&orderBy="userId"&equalTo="${userId}"`;
        axios.get(`/orders.json${queryParams}`)
            .then(response => {
                const fetchedOrders = Object.keys(response.data)
                    .map(idKey => ({...response.data[idKey], id: idKey}));
                dispatch(fetchOrdersSuccess(fetchedOrders));
            })
            .catch(error => {
                dispatch(fetchOrdersFail(error));
            });
    };
};