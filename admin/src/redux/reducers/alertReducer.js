import {
    SUCCESS,
    ERROR,
    CLEAR,
    SUCCESS_TO_DELETE_ALERT,
    ERROR_TO_DELETE_ALERT,
} from '../actions/alertActions';
import { LOGIN_REQUEST } from '../actions/userActions';
import { REGISTER_REQUEST } from '../actions/userActions';


export default function (state = {}, action) {
    switch (action.type) {
        case LOGIN_REQUEST:
            return {
                type :'',
                message : ''
            };
        case REGISTER_REQUEST:
            return {
                type :'',
                message : ''
            };
        case SUCCESS:
            return {
                type: 'success',
                message: action.message,
                success: action.success
            };
        case SUCCESS_TO_DELETE_ALERT:
            return {
                type :'warning',
                message : action.message
            };
        case ERROR_TO_DELETE_ALERT:
            return {
                type :'warning',
                message : action.message
            };
        case ERROR:
            return {
                type: 'danger',
                message: action.message,
                success: action.success
            };
        case CLEAR:
            return {};
        default:
            return state
    }
}