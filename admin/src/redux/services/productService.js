import { apiUrl } from '../../helpers/config';
import {authHeader} from '../../helpers/authHeader';

export const productService = {
    getByUserId,
    create,
    update,
    updateStateProduct,
    delete: _delete,
    send
};

export function getByUserId(userId) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userId })
    };
    return fetch(`${apiUrl}/products/getByUserId`, requestOptions).then(handleResponse);
}

export function create(param) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(param)
    };
    return fetch(`${apiUrl}/products/create`, requestOptions).then(handleResponse);
}

export function updateStateProduct(param) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(param)
    };
    return fetch(`${apiUrl}/products/updateState`, requestOptions).then(handleResponse);
}

export function update(param) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(param)
    };
    return fetch(`${apiUrl}/products/update`, requestOptions).then(handleResponse);
}

export function _delete(param) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({param})
    };
    return fetch(`${apiUrl}/products/delete`, requestOptions).then(handleResponse);
}

export function send(param)
{
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(param)
    };
    return fetch(`${apiUrl}/products/send`, requestOptions).then(handleResponse).catch(() => window.location.reload(true));
}

export function handleResponse(response)
{
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok)
        {
            if (response.status === 401)
                window.location.reload(true);

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        return data;
    });
}