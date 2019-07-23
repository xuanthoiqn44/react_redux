import {
    GET_ADMIN_NOTIFY_SUCCESS,
    GET_ADMIN_NOTIFY_FAILURE,
    CREATE_ADMIN_NOTIFY_SUCCESS,
    CREATE_ADMIN_NOTIFY_FAILURE,
    UPDATE_ADMIN_NOTIFY_SUCCESS,
    UPDATE_ADMIN_NOTIFY_FAILURE,
    DELETE_ADMIN_NOTIFY_SUCCESS,
    DELETE_ADMIN_NOTIFY_FAILURE,
    SEND_ADMIN_NOTIFY_SUCCESS,
    SEND_ADMIN_NOTIFY_FAILURE,
} from "../actions/emailActions";

const emailReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_ADMIN_NOTIFY_SUCCESS:
            return {
                ...state,
                notifies: action.notifies
            };
        case GET_ADMIN_NOTIFY_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case CREATE_ADMIN_NOTIFY_SUCCESS:
            return {
                ...state,
                notify: action.notify
            };
        case CREATE_ADMIN_NOTIFY_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case UPDATE_ADMIN_NOTIFY_SUCCESS:
            return {
                ...state,
                notifies: action.notifies
            };
        case UPDATE_ADMIN_NOTIFY_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case DELETE_ADMIN_NOTIFY_SUCCESS:
            return {
                ...state,
                notifies: action.notifies
            };
        case DELETE_ADMIN_NOTIFY_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case SEND_ADMIN_NOTIFY_SUCCESS:
            return {
                ...state,
                notifies: action.notifies
            };
        case SEND_ADMIN_NOTIFY_FAILURE:
            return {
                ...state,
                error: action.error
            };
    
        default:
            return state
    }
};

export default emailReducer;