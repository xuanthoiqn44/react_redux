import { apiUrl } from '../../helpers/config';
import {authHeader} from '../../helpers/authHeader';

export const advantagesService = {
    get,
    create,
    update,
    delete: _delete,
    send
};

export function get() {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' }
    };
    return fetch(`${apiUrl}/advantages/get`, requestOptions).then(handleResponse);
}

export function create(param) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(param)
    };
    return fetch(`${apiUrl}/advantages/create`, requestOptions).then(handleResponse);
}

export function update(param) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(param)
    };
    return fetch(`${apiUrl}/advantages/update`, requestOptions).then(handleResponse);
}

export function _delete(id) {
    console.log('id',id);
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({id: id})
    };
    return fetch(`${apiUrl}/advantages/delete`, requestOptions).then(handleResponse);
}

export function send(param)
{
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(param)
    };
    return fetch(`${apiUrl}/advantages/send`, requestOptions).then(handleResponse).catch(() => window.location.reload(true));
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