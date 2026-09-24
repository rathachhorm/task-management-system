import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const LoginService = {
    register: async (name, email, password) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/register`, {
                name,
                email,
                password
            });
            // Optionally log in the user after successful registration
            if (response.data.token) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            return response.data;
        } catch (error) {
            console.error('Error during registration:', error);
            throw error;
        }
    },

    login: async (email, password) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/login`, {
                email,
                password
            });
            if (response.data.token) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            return response.data;
        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        return JSON.parse(localStorage.getItem('user'));
    },

    refreshToken: async () => {
        try {
            const user = LoginService.getCurrentUser();
            if (user && user.refreshToken) {
                const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                    refreshToken: user.refreshToken
                });
                if (response.data.token) {
                    localStorage.setItem('user', JSON.stringify(response.data));
                }
                return response.data;
            }
            return null;
        } catch (error) {
            console.error('Error refreshing token:', error);
            LoginService.logout(); // Logout user if refresh token fails
            throw error;
        }
    }
};

export default LoginService;
