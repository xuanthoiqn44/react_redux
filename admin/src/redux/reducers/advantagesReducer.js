import {
    GET_ADVANTAGES_SUCCESS,
    GET_ADVANTAGES_FAILURE,
    CREATE_ADVANTAGES_SUCCESS,
    CREATE_ADVANTAGES_FAILURE,
    UPDATE_ADVANTAGES_SUCCESS,
    UPDATE_ADVANTAGES_FAILURE,
    DELETE_ADVANTAGES_SUCCESS,
    DELETE_ADVANTAGES_FAILURE,
    SEND_ADVANTAGES_SUCCESS,
    SEND_ADVANTAGES_FAILURE,
} from "../actions/advantagesAction";

const advantagesReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_ADVANTAGES_SUCCESS:
            return {
                ...state,
                advantages: action.advantages
            };
        case GET_ADVANTAGES_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case CREATE_ADVANTAGES_SUCCESS:
            return {
                ...state,
                advantages: action.advantages
            };
        case CREATE_ADVANTAGES_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case UPDATE_ADVANTAGES_SUCCESS:
            return {
                ...state,
                advantages: action.advantages
            };
        case UPDATE_ADVANTAGES_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case DELETE_ADVANTAGES_SUCCESS:
            return {
                ...state,
                advantages: action.advantages
            };
        case DELETE_ADVANTAGES_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case SEND_ADVANTAGES_SUCCESS:
            return {
                ...state,
                advantages: action.advantages
            };
        case SEND_ADVANTAGES_FAILURE:
            return {
                ...state,
                error: action.error
            };

        default:
            return state
    }
};

export default advantagesReducer;