import {userService} from '../services/userService';
import alertActions from './alertActions';
import {history} from '../../helpers/history';

export const REGISTER_REQUEST = 'USERS_REGISTER_REQUEST';
export const REGISTER_SUCCESS = 'USERS_REGISTER_SUCCESS';
export const REGISTER_FAILURE = 'USERS_REGISTER_FAILURE';

export const LOGIN_REQUEST = 'USERS_LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'USERS_LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'USERS_LOGIN_FAILURE';

export const LOGIN_WALLET_SUCCESS = 'LOGIN_WALLET_SUCCESS';

export const USER_LOGOUT = 'USER_LOGOUT';

export const GETALL_REQUEST = 'USERS_GETALL_REQUEST';
export const GETALL_SUCCESS = 'USERS_GETALL_SUCCESS';
export const GETALL_FAILURE = 'USERS_GETALL_FAILURE';

export const DELETE_REQUEST = 'USERS_DELETE_REQUEST';
export const DELETE_SUCCESS = 'USERS_DELETE_SUCCESS';
export const DELETE_FAILURE = 'USERS_DELETE_FAILURE';

export const UPDATE_REQUEST = 'USERS_UPDATE_REQUEST';
export const UPDATE_SUCCESS = 'USERS_UPDATE_SUCCESS';
export const UPDATE_FAILURE = 'USERS_UPDATE_FAILURE';

export const SET_SOCIAL_USER = 'SET_SOCIAL_USER';
export const UPDATE_IMAGE_USER = 'UPDATE_IMAGE_USER';

export const GETBYID_REQUEST = 'GETBYID_REQUEST';
export const GETBYID_SUCCESS = 'GETBYID_SUCCESS';
export const GETBYID_FAILURE = 'GETBYID_FAILURE';

export const GETUSERBYTOKEN_REQUEST = 'GETUSERBYTOKEN_REQUEST';
export const GETUSERBYTOKEN_SUCCESS = 'GETUSERBYTOKEN_SUCCESS';
export const GETUSERBYTOKEN_FAILURE = 'GETUSERBYTOKEN_FAILURE';

export const userActions = {
    login,
    loginWallet,
    logout,
    register,
    update,
    delete: _delete,
    getById,
    getByToken
};

function login(userName, password) {
    return dispatch => {
        dispatch(request({userName}));
        userService.login(userName, password)
            .then(
                user => {
                    dispatch(success(user));
                    //dispatch(socketActions.userConnected(userName));
                    history.push('/');
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(user) {
        return {type: LOGIN_REQUEST, user}
    }

    function success(user) {
        return {type: LOGIN_SUCCESS, user}
    }

    function failure(error) {
        return {type: LOGIN_FAILURE, error}
    }
}

function loginWallet(user) {
    return dispatch => {
        if (user) {
            dispatch(success(user));
            dispatch(getWalletInfo({'wToken': user.wToken, 'email': user.email}));
            //dispatch(socketActions.userConnected(user.email));
        } else {
            dispatch(failure('Fail to Login Wallet'));
            dispatch(alertActions.error('Fail to Login Wallet'));
        }
    };

    function success(user) {
        return {type: LOGIN_SUCCESS, user}
    }

    function failure(error) {
        return {type: LOGIN_FAILURE, error}
    }
}

function register(user) {
    return dispatch => {
        dispatch(request(user));
        userService.register(user)
            .then(
                user => {
                    dispatch(success());
                    history.push('/login');
                    dispatch(alertActions.success('Registration successful'));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(user) {
        return {type: REGISTER_REQUEST, user}
    }

    function success(user) {
        return {type: REGISTER_SUCCESS, user}
    }

    function failure(error) {
        return {type: REGISTER_FAILURE, error}
    }
}

function logout() {
    localStorage.clear();
    return {type: USER_LOGOUT};
}

function getWalletInfo(param) {
    return dispatch => {
        userService.getWalletInfo(param)
            .then(
                info => {
                    if (typeof info !== 'undefined' && (info))
                        dispatch(success(info));
                },
                error => {
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function success(info) {
        return {type: LOGIN_WALLET_SUCCESS, info}
    }
}

function getById(id) {
    return dispatch => {
        dispatch(request(id));
        userService.getById(id)
            .then(
                listUser => {
                    dispatch(success(listUser))
                },
                error => dispatch(failure(error.toString()))
            );
    };

    function request() {
        return {type: GETBYID_REQUEST}
    }

    function success(listUser) {
        return {type: GETBYID_SUCCESS, listUser}
    }

    function failure(error) {
        return {type: GETBYID_FAILURE, error}
    }
}

function getByToken(param) {
    return dispatch => {
        dispatch(request(param));
        userService.getByToken(param)
            .then(
                user => {
                    dispatch(success(user));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function request() {
        return {type: GETUSERBYTOKEN_REQUEST}
    }

    function success(user) {
        return {type: GETUSERBYTOKEN_SUCCESS, user}
    }

    function failure(error) {
        return {type: GETUSERBYTOKEN_FAILURE, error}
    }
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    return dispatch => {
        dispatch(request(id));
        userService.delete(id)
            .then(
                user => dispatch(success(id)),
                error => dispatch(failure(id, error.toString()))
            );
    };

    function request(id) {
        return {type: DELETE_REQUEST, id}
    }

    function success(id) {
        return {type: DELETE_SUCCESS, id}
    }

    function failure(id, error) {
        return {type: DELETE_FAILURE, id, error}
    }
}

function update(param) {
    return dispatch => {
        userService.update(param)
            .then(
                profile => {
                    dispatch(success(profile));
                    dispatch(alertActions.success('Update successful'));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );

        function success(user) {
            return {type: UPDATE_SUCCESS, user}
        }

        function failure(error) {
            return {type: UPDATE_FAILURE, error}
        }
    }
}

export const updateImageUser = (imageUser) => {
    return {
        type: 'UPDATE_IMAGE_USER',
        imageUser
    }
};
