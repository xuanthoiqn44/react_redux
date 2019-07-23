import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    USER_LOGOUT,
    GETUSERBYTOKEN_SUCCESS,
    GETUSERBYTOKEN_FAILURE,
    GETUSERBYTOKEN_REQUEST,
} from '../actions/userActions';

export default function (state = { loggedIn: false, user : {}}, action) {
    switch (action.type) {
        case LOGIN_REQUEST:
            return {
                ...state,
                loggingIn: true,
                user: action.user
            };
        case LOGIN_SUCCESS:
            return {
                ...state,
                loggedIn: true,
                user: action.user,
            };
        case LOGIN_FAILURE:
            return {...state};
        case USER_LOGOUT:
            return {
                ...state,
                loggedIn: false,
                user: {}
            };
        case GETUSERBYTOKEN_SUCCESS:
            return {
                ...state,
                user: action.user
            };
        case GETUSERBYTOKEN_FAILURE:
            // return {
            //     ...state,
            //     error: action.error
            // };
            return {...state};
        case GETUSERBYTOKEN_REQUEST:
            return {
                ...state,
                loading: true
            };
        default:
            return state
    }
}