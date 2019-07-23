import {
    GET_PRODUCT_SUCCESS,
    GET_PRODUCT_FAILURE,
    CREATE_PRODUCT_SUCCESS,
    CREATE_PRODUCT_FAILURE,
    UPDATE_PRODUCT_SUCCESS,
    UPDATE_PRODUCT_FAILURE,
    DELETE_PRODUCT_SUCCESS,
    DELETE_PRODUCT_FAILURE,
    SEND_PRODUCT_SUCCESS,
    SEND_PRODUCT_FAILURE,
    TOGGLE_NEW_PRODUCT,
    UPDATE_STATE_PRODUCT_SUCCESS,
    UPDATE_STATE_PRODUCT_FAILURE,
    COLLAPSE_TABLE_PRODUCT,
    FLAG
} from "../actions/productActions";

const productReducer = (state = {toggleState: false,collapseTab:false, flag: false,defaultLanguage: 'us'}, action) => {
    switch (action.type) {
        case FLAG:
            return {
                ...state,
                flag: !action.state
            };
        case TOGGLE_NEW_PRODUCT:
            return {
                ...state,
                toggleState: !action.state
            };
        case COLLAPSE_TABLE_PRODUCT:
            return {
                ...state,
                collapseTab: !action.state
            };
        case GET_PRODUCT_SUCCESS:
            return {
                ...state,
                products: action.products
            };
        case GET_PRODUCT_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case CREATE_PRODUCT_SUCCESS:
            return {
                ...state,
                product: action.product
            };
        case CREATE_PRODUCT_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case UPDATE_PRODUCT_SUCCESS:
            return {
                ...state,
                products: action.products
            };
        case UPDATE_PRODUCT_FAILURE:

            return {
                ...state,
                error: action.error
            };
        case UPDATE_STATE_PRODUCT_SUCCESS:
            return {
                ...state,
                products: action.products
            };
        case UPDATE_STATE_PRODUCT_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case DELETE_PRODUCT_SUCCESS:
            return {
                ...state,
                products: action.products
            };
        case DELETE_PRODUCT_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case SEND_PRODUCT_SUCCESS:
            return {
                ...state,
                products: action.products
            };
        case SEND_PRODUCT_FAILURE:
            return {
                ...state,
                error: action.error
            };

        default:
            return state
    }
};

export default productReducer;