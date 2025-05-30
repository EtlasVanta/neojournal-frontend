// /src/services/api.js

const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL;


export const request = async(url, method = 'GET', data = null, token = null) => {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    if (token) {
        options.headers.Authorization = `Bearer ${token}`;
    }

    if (data) {
        options.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE}${url}`, options);
    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || 'Erreur inconnue');
    }

    return result;
};