import { apiUrl } from '../../helpers/config';
import {authHeader} from '../../helpers/authHeader';

export const translationService = {
    get,
};

export function get() {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
    };
    return fetch(`${apiUrl}/translation/get`, requestOptions).then(handleResponse);
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
