import React, {PureComponent} from 'react';
import {reduxForm} from 'redux-form';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import EyeIcon from 'mdi-react/EyeIcon';
import AccountOutlineIcon from 'mdi-react/AccountOutlineIcon';
import KeyVariantIcon from 'mdi-react/KeyVariantIcon';
import EmailIcon from 'mdi-react/EmailIcon';

import {userActions} from '../../../../redux/actions/userActions';

class RegisterForm extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showPassword: false,
            user: {
                firstName: '',
                lastName: '',
                userName: '',
                password: '',
                email: ''
            },
            submitted: false
        };
    }

    showPassword = (e) => {
        e.preventDefault();
        this.setState({
            showPassword: !this.state.showPassword
        })
    };

    handleChange = (event) => {
        const {name, value} = event.target;
        const {user} = this.state;
        this.setState({
            user: {
                ...user,
                [name]: value
            }
        });
    };

    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({submitted: true});
        const {user} = this.state;
        const {dispatch} = this.props;

        if (user.firstName && user.lastName && user.userName && user.password) {
            dispatch(userActions.register(user));
        }
    };

    handleKeyPress = (target) => {
        if(target.charCode === 13){
          this.handleSubmit(target);
        }
    }

    render() {
        const {registering} = this.props;
        const {user, submitted} = this.state;
        return (
            <form className="form" onSubmit={this.handleSubmit}>
                <div className={'form__form-group' + (submitted && !user.firstName ? ' has-error' : '')}>
                    <label className="form__form-group-label" htmlFor="firstName">First Name</label>
                    <div className='form__form-group-field'>
                        <div className='form__form-group-icon'>
                            <AccountOutlineIcon/>
                        </div>
                        <input type="text" placeholder='Enter First Name'  className="form-control" name="firstName" onKeyPress={this.handleKeyPress} value={user.firstName} autoComplete="off"
                            onChange={this.handleChange}/>
                    </div>
                    {submitted && !user.firstName &&
                    <div className="help-block">First Name is required</div>
                    }
                </div>
                <div className={'form__form-group' + (submitted && !user.lastName ? ' has-error' : '')}>
                    <label className="form__form-group-label" htmlFor="lastName">Last Name</label>
                    <div className='form__form-group-field'>
                        <div className='form__form-group-icon'>
                            <AccountOutlineIcon/>
                        </div>
                        <input type="text" placeholder='Enter Last Name'  className="form-control" name="lastName" onKeyPress={this.handleKeyPress} value={user.lastName} autoComplete="off"
                            onChange={this.handleChange}/>
                    </div>
                    {submitted && !user.lastName &&
                    <div className="help-block">Last Name is required</div>
                    }
                </div>
                <div className={'form__form-group' + (submitted && !user.email ? ' has-error' : '')}>
                    <label className="form__form-group-label" htmlFor="email">Email</label>
                    <div className='form__form-group-field'>
                        <div className='form__form-group-icon'>
                            <EmailIcon/>
                        </div>
                        <input type="email" placeholder='Enter Email'  className="form-control" name="email" onKeyPress={this.handleKeyPress} value={user.email} autoComplete="off"
                            onChange={this.handleChange} required={false}/>
                    </div>
                    {submitted && !user.email &&
                    <div className="help-block">Email is required</div>
                    }
                </div>
                <div className={'form__form-group' + (submitted && !user.userName ? ' has-error' : '')}>
                    <label className="form__form-group-label" htmlFor="userName">Username</label>
                    <div className='form__form-group-field'>
                        <div className='form__form-group-icon'>
                            <AccountOutlineIcon/>
                        </div>
                        <input type="text" placeholder='Enter User Name'  className="form-control" name="userName" onKeyPress={this.handleKeyPress} value={user.userName} autoComplete="off"

                            onChange={this.handleChange}/>
                    </div>
                    {submitted && !user.userName &&
                    <div className="help-block">Username is required</div>
                    }
                </div>
                <div className={'form__form-group' + (submitted && !user.password ? ' has-error' : '')}>
                    <label className="form__form-group-label" htmlFor="password">Password</label>
                    <div className='form__form-group-field'>
                        <div className='form__form-group-icon'>
                            <KeyVariantIcon/>
                        </div>
                        <input type={this.state.showPassword ? 'text' : 'password'} placeholder='Enter User Name' onKeyPress={this.handleKeyPress} className="form-control" name="password" value={user.password} autoComplete="off"

                            onChange={this.handleChange}/>
                        <button className={`form__form-group-button${this.state.showPassword ? ' active' : ''}`}
                                    onClick={(e) => this.showPassword(e)}><EyeIcon/></button>
                    </div>
                    {submitted && !user.password &&
                    <div className="help-block">Password is required</div>
                    }
                </div>
                <div className="form__form-group btn-footer">
                    <button className="btn btn-primary">Register</button>
                    {registering &&
                    <img
                        src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA=="
                        alt={registering}/>
                    }
                    <Link to="/login" className="btn btn-link btn-primary">Cancel</Link>
                </div>
            </form>
        )
    }
}

function mapStateToProps(state) {
    const {registering} = state.registration;
    return {
        registering
    };
}

const connectedRegisterPage = connect(mapStateToProps)(RegisterForm);
export default reduxForm({
    form: 'register_form',
    connectedRegisterPage
})(RegisterForm);
