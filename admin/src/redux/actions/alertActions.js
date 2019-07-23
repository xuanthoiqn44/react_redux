export const SUCCESS = 'ALERT_SUCCESS';
export const ERROR = 'ALERT_ERROR';
export const CLEAR = 'ALERT_CLEAR';
export const ALERT_EXIST = 'ALERT_EXIST';
export const SUCCESS_TO_DELETE_ALERT = 'SUCCESS_TO_DELETE_ALERT';
export const ERROR_TO_DELETE_ALERT = 'ERROR_TO_DELETE_ALERT';

const alertAction = {
    success,
    error,
    clear,
    successToDelete,
    errorToDelete,
    alertExist
};

export function success(message) {
    return { type: SUCCESS, success: true, message };
}

export function error(message) {
    return { type: ERROR, message, success: false };
}

export function clear() {
    return { type: CLEAR };
}

export function successToDelete(message) {
    return { type: SUCCESS_TO_DELETE_ALERT, success: true, message };
}

export function errorToDelete(message) {
    return { type: ERROR_TO_DELETE_ALERT, success: true, message };
}

export function alertExist(message) {
    return { type: ALERT_EXIST, success: true, message };
}

export default alertAction;