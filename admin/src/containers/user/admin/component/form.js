import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {Container, Col, Row, FormGroup, Button} from "reactstrap";
import {userActions} from '../../../../redux/actions/userActions';
import {translate} from "react-i18next";
import {validateEmail} from '../../../../helpers/config';

class Form extends PureComponent {
    state = {
        showPassword: false,
        user: {
            lastName: '',
            userName: '',
            password: '',
            email: ''
        },
        submitted: false
    };

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

        if (user.lastName && user.userName && user.password) {
            dispatch(userActions.register(user));
        }
    };

    render() {
        const {registering} = this.props;
        const {user, submitted} = this.state;
        return (
            <form name="form" onSubmit={this.handleSubmit}>
                <Container>
                    <Row>
                        <Col sm="12" lg="6" xs="12">
                            <div className={'form-group' + (submitted && !user.firstName ? ' has-error' : '')}>
                                <label htmlFor="firstName">First Name</label>
                                <input type="text" className="form-control" name="firstName" value={user.firstName}
                                       onChange={this.handleChange}/>
                                {submitted && !user.firstName &&
                                <div className="help-block">First Name is required</div>
                                }
                            </div>
                            <div className={'form-group' + (submitted && !user.lastName ? ' has-error' : '')}>
                                <label htmlFor="lastName">Last Name</label>
                                <input type="text" className="form-control" name="lastName" value={user.lastName}
                                       onChange={this.handleChange}/>
                                {submitted && !user.lastName &&
                                <div className="help-block">Last Name is required</div>
                                }
                            </div>
                            <div
                                className={'form-group' + (submitted && !validateEmail(user.email) && user.email ? ' has-error' : '')}>
                                <label htmlFor="email">Email</label>
                                <input type="text" className="form-control" name="email" value={user.email}
                                       onChange={this.handleChange} required={false}/>
                                {submitted && !validateEmail(user.email) && user.email &&
                                <div className="help-block">Email is not correct Format</div>}
                            </div>
                            <div className={'form-group' + (submitted && !user.userName ? ' has-error' : '')}>
                                <label htmlFor="userName">Username</label>
                                <input type="text" className="form-control" name="userName" value={user.userName}
                                       onChange={this.handleChange}/>
                                {submitted && !user.userName &&
                                <div className="help-block">Username is required</div>
                                }
                            </div>
                            <div className={'form-group' + (submitted && !user.password ? ' has-error' : '')}>
                                <label htmlFor="password">Password</label>
                                <input type="password" className="form-control" name="password" value={user.password}
                                       onChange={this.handleChange}/>
                                {submitted && !user.password && <div className="help-block">Password is required</div>}
                            </div>
                        </Col>
                        <Col sm="12" lg="6" xs="12">
                            <div className="form-group">
                                <label htmlFor="role">Role</label>
                                <select id='language' className="browser-default custom-select" value={user.role}
                                        defaultValue="user">
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="status">Status</label>
                                <FormGroup check className='pl-0'>
                                    <label className="radio-btn radio-btn--colored">
                                        <input onClick={this.handleChange} className="radio-btn__radio" name="status"
                                               type="radio" value="Default" defaultChecked/>
                                        <span className="radio-btn__radio-custom"> </span>
                                        <span className="radio-btn__label">Default</span>
                                    </label>
                                </FormGroup>
                                <FormGroup check>
                                    <label className="radio-btn radio-btn--colored">
                                        <input onClick={this.handleChange} className="radio-btn__radio" name="status"
                                               type="radio" value="Pending"/>
                                        <span className="radio-btn__radio-custom"> </span>
                                        <span className="radio-btn__label">Pending</span>
                                    </label>
                                </FormGroup>
                                <FormGroup check>
                                    <label className="radio-btn radio-btn--colored">
                                        <input onClick={this.handleChange} className="radio-btn__radio" name="status"
                                               type="radio" value="Accept"/>
                                        <span className="radio-btn__radio-custom"> </span>
                                        <span className="radio-btn__label">Accept</span>
                                    </label>
                                </FormGroup>
                            </div>
                            <div className="form-group">
                                <div className="button-container d-flex justify-content-end">
                                    <Button color='danger' onClick={this.props.toggleNewForm}>
                                        Cancel
                                    </Button>
                                    <button className="btn btn-primary">Add New</button>
                                    {registering &&
                                    <img
                                        src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA=="
                                        alt={registering}/>
                                    }
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
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

const mapDispatchToProps = (dispatch) => ({
    toggleNew: (state) => dispatch(userActions.toggleNew(state)),
});

export default connect(mapStateToProps, mapDispatchToProps)(translate('common')(Form))
