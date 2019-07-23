import {categoryService} from "../services/categoryService";
import alertActions from './alertActions';

export const GET_CATEGORY_SUCCESS = 'GET_CATEGORY_SUCCESS';
export const GET_CATEGORY_FAILURE = 'GET_CATEGORY_FAILURE';

export const CREATE_CATEGORY_SUCCESS = 'CREATE_CATEGORY_SUCCESS';
export const CREATE_CATEGORY_FAILURE = 'CREATE_CATEGORY_FAILURE';

export const UPDATE_CATEGORY_SUCCESS = 'UPDATE_CATEGORY_SUCCESS';
export const UPDATE_CATEGORY_FAILURE = 'UPDATE_CATEGORY_FAILURE';

export const DELETE_CATEGORY_SUCCESS = 'DELETE_CATEGORY_SUCCESS';
export const DELETE_CATEGORY_FAILURE = 'DELETE_CATEGORY_FAILURE';

export const categoryAction = {
    get,
    create,
    update,
    delete: _delete,
};

function get(userId) {
    return dispatch => {
        categoryService.get(userId)
            .then(
                categories  => {
                    dispatch(success(categories ));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function success(categories ) { return { type: GET_CATEGORY_SUCCESS, categories  } }
    function failure(error) { return { type: GET_CATEGORY_FAILURE, error } }
}

function create(data) {
    return dispatch => {
        categoryService.create(data)
            .then(
                categories => {
                    dispatch(success(categories));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };
    function success(categories) { return { type: CREATE_CATEGORY_SUCCESS, categories } }
    function failure(error) { return { type: CREATE_CATEGORY_FAILURE, error } }
}

function update(param) {
    return dispatch => {
        categoryService.update(param)
            .then(
                categories => {
                    dispatch(success(categories));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };
    function success(categories) { return { type: UPDATE_CATEGORY_SUCCESS, categories } }
    function failure(error) { return { type: UPDATE_CATEGORY_FAILURE, error } }
}

function _delete(param) {
    return dispatch => {
        categoryService.delete(param)
            .then(
                returnCategories => {
                    dispatch(success(returnCategories));
                    if(returnCategories.check) {
                        dispatch(alertActions.successToDelete('Delete successful !'));
                    } else {
                        dispatch(alertActions.successToDelete('The category is used !'));
                    }
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.errorToDelete(error.toString()));
                }
            );
    };

    function success(returnCategories) { return { type: DELETE_CATEGORY_SUCCESS, returnCategories } }
    function failure(error) { return { type: DELETE_CATEGORY_FAILURE, error } }
}
