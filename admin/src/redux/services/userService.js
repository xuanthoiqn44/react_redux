import {apiUrl} from '../../helpers/config';
import {authHeader} from '../../helpers/authHeader';

export const userService = {
    login,
    register,
    getById,
    getWalletInfo,
    update,
    delete: _delete,
    getByToken
};

export function login(userName, password) {
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({userName, password})
    };

    return fetch(`${apiUrl}/users/authenticate`, requestOptions)
        .then(handleResponse)
        .then(user => {
            if (typeof user.token !== 'undefined' && (user.token) && (user.token) !== '') {
                localStorage.setItem('token', user.token);
            }
            return user;
        });
}

export function getWalletInfo(param) {
    const requestOptions = {
        method: 'POST',
        headers: {...authHeader(), 'Content-Type': 'application/json'},
        body: JSON.stringify(param)
    };
    return fetch(`${apiUrl}/users/trades/getWalletInfo`, requestOptions).then(handleResponse).catch(() => window.location.reload(true));
}

export function getById(param) {
    const requestOptions = {
        method: 'POST',
        headers: {...authHeader(), 'Content-Type': 'application/json'},
        body: JSON.stringify(param)
    };
    return fetch(`${apiUrl}/users/getById`, requestOptions).then(handleResponse).catch(() => window.location.reload(true));
}

export function getByToken(param) {
    const requestOptions = {
        method: 'POST',
        headers: {...authHeader(), 'Content-Type': 'application/json'},
        body: JSON.stringify(param)
    };
    return fetch(`${apiUrl}/users/getByToken`, requestOptions)
        .then(handleResponse)
        .then(user => {
            if (typeof user.token !== 'undefined' && (user.token) && (user.token) !== '') {
                localStorage.setItem('token', user.token);
            }
            return user;
        });
}

export function register(user) {
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(user)
    };

    return fetch(`${apiUrl}/users/register`, requestOptions).then(handleResponse).catch(() => window.location.reload(true));
}

export function update(param) {
    const requestOptions = {
        method: 'POST',
        headers: {...authHeader(), 'Content-Type': 'application/json'},
        body: JSON.stringify(param)
    };

    return fetch(`${apiUrl}/users/update`, requestOptions).then(handleResponse);
}

export function _delete(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader()
    };

    return fetch(`${apiUrl}/users/${id}`, requestOptions).then(handleResponse).catch(() => window.location.reload(true));
}

export function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401)
                window.location.reload(true);

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        return data;
    });
}
