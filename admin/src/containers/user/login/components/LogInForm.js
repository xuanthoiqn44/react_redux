import React, {PureComponent} from 'react';
import {reduxForm} from 'redux-form';
import KeyVariantIcon from 'mdi-react/KeyVariantIcon';
import AccountOutlineIcon from 'mdi-react/AccountOutlineIcon';
import EyeIcon from 'mdi-react/EyeIcon';
import connect from "react-redux/es/connect/connect";
import {userActions} from '../../../../redux/actions/userActions';

class LogInForm extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showPassword: false,
            userName: '',
            password: '',
            submitted: false
        };
    }

    componentDidMount() {
        this.props.dispatch(userActions.logout());
    }

    showPassword = (e) => {
        e.preventDefault();
        this.setState({
            showPassword: !this.state.showPassword
        })
    };

    handleChange = (e) => {
        const {name, value} = e.target;
        this.setState({[name]: value});
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({submitted: true});
        const {userName, password} = this.state;
        const {dispatch} = this.props;
        if (userName && password) {
            dispatch(userActions.login(userName, password));
        }
    };

    handleKeyPress = (target) => {
        if(target.charCode === 13){
          this.handleSubmit(target);
        }
    }

    render() {
        const {loggingIn} = this.props;
        const {userName, password, submitted} = this.state;
        return (
            <form className='form' onSubmit={this.handleSubmit}>
                <div className='form__form-group'>
                    <label className='form__form-group-label'>Username</label>
                    <div className='form__form-group-field'>
                        <div className='form__form-group-icon'>
                            <AccountOutlineIcon/>
                        </div>
                        <input onKeyPress={this.handleKeyPress} type="text" placeholder='Enter User Name' className="form-control" name="userName" autoComplete="off"

                               onChange={this.handleChange}/>
                    </div>
                    {submitted && !userName &&
                    <div className="help-block">Username is required</div>
                    }
                </div>
                <div className='form__form-group'>
                    <label className='form__form-group-label'>Password</label>
                    <div className='form__form-group-field'>
                        <div className='form__form-group-icon'>
                            <KeyVariantIcon/>
                        </div>
                        <input onKeyPress={this.handleKeyPress} type={this.state.showPassword ? 'text' : 'password'} placeholder='Enter Password' autoComplete="off"
                               className="form-control" name="password" onChange={this.handleChange}/>
                        <button className={`form__form-group-button${this.state.showPassword ? ' active' : ''}`}
                                onClick={(e) => this.showPassword(e)}><EyeIcon/></button>
                    </div>
                    {submitted && !password &&
                    <div className="help-block">Password is required</div>
                    }
                </div>
                <div className='form__form-group btn-footer'>
                    <button className="btn btn-primary">Login</button>
                    {loggingIn &&
                    <img
                        src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA=="
                        alt={loggingIn}/>
                    }
                </div>
            </form>
        )
    }
}

function mapStateToProps(state) {
    const {loggingIn} = state.authentication;
    return {
        loggingIn,
    };
}

const connectedLoginPage = connect(mapStateToProps)(LogInForm);

export default reduxForm({
    form: 'log_in_form',
    connectedLoginPage
})(LogInForm);
