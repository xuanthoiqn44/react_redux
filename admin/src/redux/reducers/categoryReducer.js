import {
    GET_CATEGORY_SUCCESS,
    GET_CATEGORY_FAILURE,
    CREATE_CATEGORY_SUCCESS,
    CREATE_CATEGORY_FAILURE,
    UPDATE_CATEGORY_SUCCESS,
    UPDATE_CATEGORY_FAILURE,
    DELETE_CATEGORY_SUCCESS,
    DELETE_CATEGORY_FAILURE,
} from "../actions/categoryActions";

const categoryReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_CATEGORY_SUCCESS:
            return {
                ...state,
                categories: action.categories
            };
        case GET_CATEGORY_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case CREATE_CATEGORY_SUCCESS:
            return {
                ...state,
                categories: action.categories
            };
        case CREATE_CATEGORY_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case UPDATE_CATEGORY_SUCCESS:
            return {
                ...state,
                categories: action.categories
            };
        case UPDATE_CATEGORY_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case DELETE_CATEGORY_SUCCESS:
            return {
                ...state,
                categories: action.returnCategories.categories
            };
        case DELETE_CATEGORY_FAILURE:
            return {
                ...state,
                error: action.error
            };

        default:
            return state
    }
};

export default categoryReducer;
