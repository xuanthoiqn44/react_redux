import {emailService} from "../services/emailService";

export const GET_ADMIN_NOTIFY_SUCCESS = 'GET_ADMIN_NOTIFY_SUCCESS';
export const GET_ADMIN_NOTIFY_FAILURE = 'GET_ADMIN_NOTIFY_FAILURE';

export const CREATE_ADMIN_NOTIFY_SUCCESS = 'CREATE_ADMIN_NOTIFY_SUCCESS';
export const CREATE_ADMIN_NOTIFY_FAILURE = 'CREATE_ADMIN_NOTIFY_FAILURE';

export const UPDATE_ADMIN_NOTIFY_SUCCESS = 'UPDATE_ADMIN_NOTIFY_SUCCESS';
export const UPDATE_ADMIN_NOTIFY_FAILURE = 'UPDATE_ADMIN_NOTIFY_FAILURE';

export const DELETE_ADMIN_NOTIFY_SUCCESS = 'DELETE_ADMIN_NOTIFY_SUCCESS';
export const DELETE_ADMIN_NOTIFY_FAILURE = 'DELETE_ADMIN_NOTIFY_FAILURE';

export const SEND_ADMIN_NOTIFY_SUCCESS = 'SEND_ADMIN_NOTIFY_SUCCESS';
export const SEND_ADMIN_NOTIFY_FAILURE = 'SEND_ADMIN_NOTIFY_FAILURE';

export const emailActions = {
    get,
    create,
    update,
    delete: _delete,
    send,
};

function get() {
    return dispatch => {
        emailService.get()
            .then(
                notifies => {
                    dispatch(success(notifies));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function success(notifies) { return { type: GET_ADMIN_NOTIFY_SUCCESS, notifies } }
    function failure(error) { return { type: GET_ADMIN_NOTIFY_FAILURE, error } }
}

function create(data) {
    return dispatch => {
        emailService.create(data)
            .then(
                // notify  => {
                //     dispatch(success(notify));
                // },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    // function success(notify) { return { type: CREATE_ADMIN_NOTIFY_SUCCESS, notify } }
    function failure(error) { return { type: CREATE_ADMIN_NOTIFY_FAILURE, error } }
}

function update(param) {
    return dispatch => {
        emailService.update(param)
            .then(
                // user => {
                //     dispatch(success(user));
                // },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    //function success(notifies) { return { type: UPDATE_ADMIN_NOTIFY_SUCCESS, notifies } }
    function failure(error) { return { type: UPDATE_ADMIN_NOTIFY_FAILURE, error } }
}

function _delete(param) {
    console.log('paramaa',param);
    return dispatch => {
        emailService.delete(param)
            .then(
                user => {
                    dispatch(success(user));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function success(notifies) { return { type: DELETE_ADMIN_NOTIFY_SUCCESS, notifies } }
    function failure(error) { return { type: DELETE_ADMIN_NOTIFY_FAILURE, error } }
}

function send(param) {
    return dispatch => {
        emailService.send(param)
            .then(
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function failure(error) { return { type: SEND_ADMIN_NOTIFY_FAILURE, error } }
}