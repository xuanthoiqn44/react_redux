import {productService} from "../services/productService";

export const GET_PRODUCT_SUCCESS = 'GET_PRODUCT_SUCCESS';
export const GET_PRODUCT_FAILURE = 'GET_PRODUCT_FAILURE';

export const CREATE_PRODUCT_SUCCESS = 'CREATE_PRODUCT_SUCCESS';
export const CREATE_PRODUCT_FAILURE = 'CREATE_PRODUCT_FAILURE';

export const UPDATE_PRODUCT_SUCCESS = 'UPDATE_PRODUCT_SUCCESS';
export const UPDATE_PRODUCT_FAILURE = 'UPDATE_PRODUCT_FAILURE';

export const DELETE_PRODUCT_SUCCESS = 'DELETE_PRODUCT_SUCCESS';
export const DELETE_PRODUCT_FAILURE = 'DELETE_PRODUCT_FAILURE';

export const SEND_PRODUCT_SUCCESS = 'SEND_PRODUCT_SUCCESS';
export const SEND_PRODUCT_FAILURE = 'SEND_PRODUCT_FAILURE';

export const TOGGLE_NEW_PRODUCT = 'TOGGLE_NEW_PRODUCT';
export const COLLAPSE_TABLE_PRODUCT = 'COLLAPSE_TABLE_PRODUCT';
export const FLAG = 'FLAG';

export const UPDATE_STATE_PRODUCT_SUCCESS = 'UPDATE_STATE_PRODUCT_SUCCESS';
export const UPDATE_STATE_PRODUCT_FAILURE = 'UPDATE_STATE_PRODUCT_FAILURE';

export const productActions = {
    getByUserId,
    create,
    update,
    delete: _delete,
    toggleNewProduct,
    collapseTable,
    flag,
    updateStateProduct,
    send
};

function flag(state) {
    return dispatch => {
        dispatch(flag(state));
    };

    function flag(state) { return { type: FLAG, state } }
}

function collapseTable(state) {
    return dispatch => {
        dispatch(  collapseTableDispatchProduct(state));
    };

    function collapseTableDispatchProduct(state) { return { type: COLLAPSE_TABLE_PRODUCT, state } }
}
function toggleNewProduct(state) {
    return dispatch => {
        dispatch(toggleDispatchNewProduct(state));
    };

    function toggleDispatchNewProduct(state) { return { type: TOGGLE_NEW_PRODUCT, state } }
}

function updateStateProduct(data) {
    return dispatch => {
        productService.updateStateProduct(data)
            .then(
                products => {
                    dispatch(updateStateSuccess(products));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function updateStateSuccess(products) { return { type: UPDATE_STATE_PRODUCT_SUCCESS, products } }
    function failure(error) { return { type:  UPDATE_STATE_PRODUCT_FAILURE, error } }
}

function getByUserId(userId) {
    return dispatch => {
        productService.getByUserId(userId)
            .then(
                products => {
                    dispatch(success(products));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function success(products) { return { type: GET_PRODUCT_SUCCESS, products } }
    function failure(error) { return { type: GET_PRODUCT_FAILURE, error } }
}

function create(data) {
    return dispatch => {
        productService.create(data)
            .then(
                products => {
                    dispatch(success(products));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };
    function success(products) { return { type: CREATE_PRODUCT_SUCCESS, products } }
    function failure(error) { return { type: CREATE_PRODUCT_FAILURE, error } }
}

function update(param) {
    return dispatch => {
        productService.update(param)
            .then(
                products => {
                    dispatch(success(products));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };
    function success(products) { return { type: UPDATE_PRODUCT_SUCCESS, products } }
    function failure(error) { return { type: UPDATE_PRODUCT_FAILURE, error } }
}

function _delete(param) {
    return dispatch => {
        productService.delete(param)
            .then(
                user => {
                    dispatch(success(user));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function success(products) { return { type: DELETE_PRODUCT_SUCCESS, products } }
    function failure(error) { return { type: DELETE_PRODUCT_FAILURE, error } }
}

function send(param) {
    return dispatch => {
        productService.send(param)
            .then(
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function failure(error) { return { type: SEND_PRODUCT_FAILURE, error } }
}
