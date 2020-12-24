import React from 'react';
import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';

function App() {
    //  test interceptors kill with React hooks
    // const [state, newState] = useState({show: true});
    //
    // useEffect(() => {
    //     setTimeout(() => {
    //         newState({show: false});
    //     }, 5000);
    // }, [])

    return (
        <div>
            <Layout>
                {/*{state.show ? <BurgerBuilder /> : null}*/}
                <BurgerBuilder />
            </Layout>
        </div>
    );
}

export default App;
