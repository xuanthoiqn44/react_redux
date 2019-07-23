import {
    LOGIN_SUCCESS,
    GETUSERBYTOKEN_SUCCESS,
    USER_LOGOUT
} from '../actions/userActions';

export default function (state = {}, action) {
    switch (action.type) {
        case LOGIN_SUCCESS:
            return {
                ...state,
                token: action.user.token
            };
        case USER_LOGOUT:
            return {};
        case GETUSERBYTOKEN_SUCCESS:
            return {
                ...state,
                token: action.user.token
            };
        default:
            return state;
    }
}