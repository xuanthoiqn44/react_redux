import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Layout from '../containers/_layout';
import LogIn from '../containers/user/login';
import Register from '../containers/user/register';
import UserList from '../containers/user/admin';
import Email from "../containers/email";
import Product from "../containers/product";
import Profile from "../containers/user/profile";
import Modals from "../containers/modals";
import Language from "../containers/language";
import NotFound404 from "../containers/pages/404";
import { Authorization } from "../helpers/Authorization";

//const User = Authorization(['user','manager','admin']);
//const Manager = Authorization(['manager','admin']);
const Admin = Authorization(['admin']);

const Router = () => {
    return (
        <main>
            <Switch>
				<Route exact path='/' component={Admin(wrappedRoutes)} />
                <Route exact path='/login' component={LogIn} />
                <Route exact path='/register' component={Register} />
                <Route exact path='/profile' component={Admin(wrappedRoutes)} />
                <Route exact path='/modals' component={Admin(wrappedRoutes)} />
                <Route exact path='/admin' component={() => <Redirect to="/" />} />
                <Route exact path='/register' component={Register} />
                <Route exact path='/product' component={Admin(wrappedRoutes)} />
                <Route exact path='/email' component={Admin(wrappedRoutes)} />
                <Route exact path='/language' component={Admin(wrappedRoutes)} />
                <Route path="*" component={NotFound404} />
            </Switch>
        </main>
    );
};

const wrappedRoutes = () => (
    <div>
        <Layout />
        <div className='container__wrap'>
            <Route exact path='/' component={UserList} />
            <Route exact path='/email' component={Email} />
            <Route exact path='/product' component={Product} />
            <Route exact path='/profile' component={Profile} />
            <Route exact path='/modals' component={Modals} />
            <Route exact path='/language' component={Language} />
        </div>
    </div>
);

export default Router;
