import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import 'bootstrap/dist/css/bootstrap.css'
import '../scss/app.scss';
import Router from './Router';
import connect from "react-redux/es/connect/connect";
//import { history } from "../helpers/history";
//import alertActions from "../redux/actions/alertActions";
import MainWrapper from "./MainWrapper";
import { withCookies } from 'react-cookie';
import { userActions } from "../redux/actions/userActions";
import isEmpty from "lodash.isempty";

class App extends Component {
    // constructor(props) {
    //     super(props);
    //     const { dispatch } = this.props;
    //     history.listen((location, action) => {
    //         dispatch(alertActions.clear());
    //     });
    // }

    componentWillMount() {
        const { dispatch, cookies, allCookies } = this.props;
        if (!isEmpty(allCookies) && typeof allCookies.wToken !== 'undefined') {
            const { token, ...rest } = allCookies;
            localStorage.setItem('token', token);
            dispatch(userActions.loginWallet({token, ...rest}));

            cookies.remove('_id');
            cookies.remove('userName');
            cookies.remove('firstName');
            cookies.remove('lastName');
            cookies.remove('token');
            cookies.remove('email');
            cookies.remove('wToken');
            cookies.remove('wName');
            cookies.remove('wId');
            cookies.remove('wBlood');
            cookies.remove('role');
        }
    }
    render() {
        return (
            <MainWrapper>
                <Router />
            </MainWrapper>
        )
    }
}

function mapStateToProps(state) {
    const { authentication: {user} } = state;
    return {
        user
    };
}

const connectedApp = connect(mapStateToProps)(hot(module)(App));
export default withCookies(connectedApp);