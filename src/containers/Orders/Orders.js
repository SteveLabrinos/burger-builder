import React, {Component} from 'react';
import axios from '../../axios-orders';

import Order from '../../components/Order/Order';
import Spinner from '../../components/UI/Spinner/Spinner';

class Orders extends Component {
    state = {
        orders: [],
        loading: true
    }

    componentDidMount() {
        axios.get('/orders.json')
            .then(response => {
                const fetchedOrders = Object.keys(response.data)
                    .map(idKey => ({...response.data[idKey], id: idKey}));

                this.setState({loading: false, orders: fetchedOrders});
            })
            .catch(err => {
                this.setState({loading: false});
            });
    }

    render() {
        const order = this.state.loading ?
            <Spinner/> :
            this.state.orders.map(order => (
                <Order key={order.id}
                       ingredients={order.ingredients}
                       price={order.price}/>
            ))
        return (
            <div>
                {order}
            </div>
        );
    }

}

export default Orders;