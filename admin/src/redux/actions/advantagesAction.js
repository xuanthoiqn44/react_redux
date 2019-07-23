import {advantagesService} from "../services/advantagesService";

export const GET_ADVANTAGES_SUCCESS = 'GET_ADVANTAGES_SUCCESS';
export const GET_ADVANTAGES_FAILURE = 'GET_ADVANTAGES_FAILURE';

export const CREATE_ADVANTAGES_SUCCESS = 'CREATE_ADVANTAGES_SUCCESS';
export const CREATE_ADVANTAGES_FAILURE = 'CREATE_ADVANTAGES_FAILURE';

export const UPDATE_ADVANTAGES_SUCCESS = 'UPDATE_ADVANTAGES_SUCCESS';
export const UPDATE_ADVANTAGES_FAILURE = 'UPDATE_ADVANTAGES_FAILURE';

export const DELETE_ADVANTAGES_SUCCESS = 'DELETE_ADVANTAGES_SUCCESS';
export const DELETE_ADVANTAGES_FAILURE = 'DELETE_ADVANTAGES_FAILURE';

export const SEND_ADVANTAGES_SUCCESS = 'SEND_ADVANTAGES_SUCCESS';
export const SEND_ADVANTAGES_FAILURE = 'SEND_ADVANTAGES_FAILURE';

export const advantagesAction = {
    get,
    create,
    update,
    delete: _delete,
    send
};

function get() {
    return dispatch => {
        advantagesService.get()
            .then(
                advantages => {
                    dispatch(success(advantages));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function success(advantages) { return { type: GET_ADVANTAGES_SUCCESS, advantages } }
    function failure(error) { return { type: GET_ADVANTAGES_FAILURE, error } }
}

function create(data) {
    return dispatch => {
        advantagesService.create(data)
            .then(
                advantages => {
                    dispatch(success(advantages));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };
    function success(advantages) { return { type: CREATE_ADVANTAGES_SUCCESS, advantages } }
    function failure(error) { return { type: CREATE_ADVANTAGES_FAILURE, error } }
}

function update(param) {
    return dispatch => {
        console.log('param11',param);
        advantagesService.update(param)
            .then(
                advantages => {
                    dispatch(success(advantages));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };
    function success(advantages) { return { type: UPDATE_ADVANTAGES_SUCCESS, advantages } }
    function failure(error) { return { type: UPDATE_ADVANTAGES_FAILURE, error } }
}

function _delete(param) {
    return dispatch => {
        console.log('paramdelete',param);
        advantagesService.delete(param)
            .then(
                user => {
                    dispatch(success(user));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function success(advantages) { return { type: DELETE_ADVANTAGES_SUCCESS, advantages } }
    function failure(error) { return { type: DELETE_ADVANTAGES_FAILURE, error } }
}

function send(param) {
    return dispatch => {
        advantagesService.send(param)
            .then(
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function failure(error) { return { type: SEND_ADVANTAGES_FAILURE, error } }
}