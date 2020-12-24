import React, {useState, useEffect} from 'react';
import Auxiliary from '../Auxiliary/Auxiliary';
import Modal from '../../components/UI/Modal/Modal';

const withErrorHandler = (WrappedComponent, axios) => {
    return props => {
        const [errorState, setErrorState] = useState({error: null});

        const errorClearHandler = () => {
            setErrorState({error: null});
        }

        const errorRaiseHandler = (error) => {
            setErrorState({error: error});
        }

        useEffect(() => {
            const reqInterceptor = axios.interceptors.request.use(response => {
                errorClearHandler();
                return response;
            });
            const resInterceptor = axios.interceptors.response.use(response => response,
                error => {
                    errorRaiseHandler(error);
                });
            //  ejecting the interceptors after the components unmount
            return () => {
                console.log(`Component is about to unmount. Interceptors killed: ${reqInterceptor} and ${resInterceptor}`);
                axios.interceptors.request.eject(reqInterceptor);
                axios.interceptors.request.eject(resInterceptor);
            };
        }, []);

        return (
            <Auxiliary>
                <Modal show={errorState.error}
                       closeModal={errorClearHandler}>
                    {errorState.error ? errorState.error.message : null}
                </Modal>
                <WrappedComponent {...props}/>
            </Auxiliary>
        );
    }

    // return class extends Component {
    //
    //
    //     state = {
    //         error: null
    //     };
    //
    //     componentDidMount() {
    //         axios.interceptors.request.use(response => {
    //             this.setState({error: null});
    //             return response;
    //         });
    //         axios.interceptors.response.use(response => response,
    //             error => {
    //                 this.setState({error: error});
    //             });
    //     }
    //
    //     confirmedErrorHandler = () => {
    //         this.setState({error: null});
    //     }
    //
    //     render() {
    //         return (
    //             <Auxiliary>
    //                 <Modal show={this.state.error}
    //                        closeModal={this.confirmedErrorHandler}>
    //                     {this.state.error ? this.state.error.message : null}
    //                 </Modal>
    //                 <WrappedComponent {...this.props}/>
    //             </Auxiliary>
    //         );
    //     }
    // }
};

export default withErrorHandler;