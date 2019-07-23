import { apiUrl } from '../../helpers/config';
import {authHeader} from '../../helpers/authHeader';

export const languageService = {
    get,
    update,
};

export function get(userId) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userId })
    };
    return fetch(`${apiUrl}/languages/get`, requestOptions).then(handleResponse);
}

export function update(param) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(param)
    };
    return fetch(`${apiUrl}/languages/update`, requestOptions).then(handleResponse);
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
