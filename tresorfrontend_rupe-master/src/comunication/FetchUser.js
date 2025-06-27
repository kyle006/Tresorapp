/**
 * Fetch methodes for user api calls
 * @author Peter Rutschmann
 */

export const loginUser = async (credentials) => {
    const protocol = process.env.REACT_APP_API_PROTOCOL || "http";
    const host = process.env.REACT_APP_API_HOST || "localhost";
    const port = process.env.REACT_APP_API_PORT || "8080";
    const path = process.env.REACT_APP_API_PATH || "/api";
    const portPart = port ? `:${port}` : '';
    const API_URL = `${protocol}://${host}${portPart}${path}`;

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });

        if (!response.ok) {
            let errorMessage = `Request failed with status: ${response.status}`;
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || JSON.stringify(errorData);
            } catch (e) {
                // Ignore if the response body is not valid JSON.
            }
            throw new Error(errorMessage);
        }

        const data = await response.json();
        if (data.token) {
            localStorage.setItem('token', data.token);
        }
        console.log('Login successful:', data);
        return data;
    } catch (error) {
        console.error('Failed to login:', error.message);
        throw new Error('Failed to login. ' + error.message);
    }
};

export const getUsers = async () => {
    const protocol = process.env.REACT_APP_API_PROTOCOL || "http";
    const host = process.env.REACT_APP_API_HOST || "localhost";
    const port = process.env.REACT_APP_API_PORT || "8080";
    const path = process.env.REACT_APP_API_PATH || "/api";
    const portPart = port ? `:${port}` : ''; // port is optional
    const API_URL = `${protocol}://${host}${portPart}${path}`;
    const token = localStorage.getItem('token');

    if (!token) {
        throw new Error('No authentication token found.');
    }

    try {
        const response = await fetch(`${API_URL}/users`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch users. Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error in getUsers:", error);
        throw error;
    }
};

export const getUser = async (id) => {
    const protocol = process.env.REACT_APP_API_PROTOCOL || "http";
    const host = process.env.REACT_APP_API_HOST || "localhost";
    const port = process.env.REACT_APP_API_PORT || "8080";
    const path = process.env.REACT_APP_API_PATH || "/api";
    const portPart = port ? `:${port}` : '';
    const API_URL = `${protocol}://${host}${portPart}${path}`;

    try {
        const response = await fetch(`${API_URL}/users/${id}`);

        if (!response.ok) {
            let errorMessage = `Request failed with status: ${response.status}`;
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || JSON.stringify(errorData);
            } catch (e) {
                // Ignore if the response body is not valid JSON.
            }
            throw new Error(errorMessage);
        }

        const data = await response.json();
        console.log('User successfully got:', data);
        return data;
    } catch (error) {
        console.error('Failed to get user:', error.message);
        throw new Error('Failed to get user. ' + error.message);
    }
};

export async function postUser(credentials) {
    const protocol = process.env.REACT_APP_API_PROTOCOL; // "http"
    const host = process.env.REACT_APP_API_HOST; // "localhost"
    const port = process.env.REACT_APP_API_PORT; // "8080"
    const path = process.env.REACT_APP_API_PATH; // "/api"
    const portPart = port ? `:${port}` : ''; // port is optional
    const API_URL = `${protocol}://${host}${portPart}${path}`;

    try {
        const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstName: credentials.firstName,
                lastName: credentials.lastName,
                email: credentials.email,
                password: credentials.password,
                passwordConfirmation: credentials.passwordConfirmation,
                recaptchaToken: credentials.captchaToken
            })
        });

        if (response.status === 409) {
            const errorBody = await response.json();
            throw new Error(errorBody.message || 'This email is already registered.');
        }

        if (!response.ok) {
            const errorBody = await response.json();
            const messages = Array.isArray(errorBody.message) ? errorBody.message.join(' ') : errorBody.message;
            throw new Error(`Failed to create user. ${messages}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error in postUser:", error);
        throw error;
    }
}