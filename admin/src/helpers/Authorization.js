import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { userActions } from "../redux/actions/userActions";
import React from 'react';
import isEmpty from 'lodash.isempty';

export const Authorization = (allowedRoles) => (WrappedComponent) => {
    class WithAuthorization extends React.Component
    {
        constructor(props) {
            super(props);
            this.state = {
                token: true
            }
        }

        componentWillMount()
        {
            const { user } = this.props;
            if(typeof user === 'undefined' || isEmpty(user))
            {
                const { userToken, getByToken } = this.props;

                if (typeof userToken.token !== 'undefined'&&!isEmpty(userToken.token))
                {
                    getByToken({token: userToken.token});
                }
                else if(typeof localStorage.token !== 'undefined'&&!isEmpty(localStorage.token))
                {
                    getByToken({token: localStorage.token});
                }
                else
                    this.setState({token: false});
            }
        }

        render() {
            if(!this.state.token)
            {
                return <Redirect to={{ pathname: '/login', state: { from: this.props.location } }} />;
            }

            const { user } = this.props;

            if(typeof user === 'undefined' || isEmpty(user))
                return <div className={`load`}>
                    <div className='load__icon-wrap'>
                        <svg className='load__icon'>
                            <path fill='#4ce1b6' d='M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z'/>
                        </svg>
                    </div>
                </div>;
            else {
				return (typeof user !== 'undefined' && typeof user.role !== 'undefined' && !isEmpty(user.token))?<WrappedComponent {...this.props} />:<Redirect to={{ pathname: '/login', state: { from: this.props.location } }} />;
			}
        }
    }
    const mapDispatchToProps = (dispatch) => {
        return {
            getByToken: (token) => {
                return dispatch(userActions.getByToken(token))
            }
        }
    };

    const mapStateToProps = (state) => {
        const { authentication: {loggingIn, user}, userToken } = state;
        return { userToken, loggingIn, user };
    };

    return connect(mapStateToProps, mapDispatchToProps)(WithAuthorization);
};
