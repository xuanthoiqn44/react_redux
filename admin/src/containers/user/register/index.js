import React, {PureComponent} from 'react';
import RegisterForm from './components/RegisterForm';
import {Link} from 'react-router-dom';
import Alert from "../../../components/Alert";
import connect from "react-redux/es/connect/connect";
import {translate} from "react-i18next";

class Register extends PureComponent
{
    render() {
        const { alert } = this.props;
        return (
            <div className='account'>
                <div className='account__wrapper'>
                    <div className='account__card'>
                        <div className='account__head'>
                            <h3 className='account__title'>Welcome to <span className='account__logo'>PP<span
                                className='account__logo-accent'>System</span></span></h3>
                            <h4 className='account__subhead subhead'>Create an account</h4>
                        </div>
                        {alert.message &&
                        <Alert color={`${alert.type}`}>
                            <p>{alert.message}</p>
                        </Alert>
                        }
                        <RegisterForm onSubmit/>
                        <div className='account__have-account'>
                            <p>Already have an account? <Link to='/login'>Login</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state)
{
    const { alert } = state;
    return {
        alert
    };
}

const connectedGoogleMap = connect(mapStateToProps)(translate('common')(Register));
export default connectedGoogleMap;
