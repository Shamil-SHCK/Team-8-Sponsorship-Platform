import { API_URL } from './config';

// Register user
export const registerUser = async (userData) => {
    const isFormData = userData instanceof FormData;

    const headers = {};
    if (!isFormData) {
        headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers,
        body: isFormData ? userData : JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
    }

    // NOTE: We don't save token here anymore because of OTP flow

    return data;
};

// Verify OTP
export const verifyUserOTP = async (data) => {
    const response = await fetch(`${API_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
        throw new Error(responseData.message || 'OTP verification failed');
    }

    // Save token to localStorage
    if (responseData.token) {
        localStorage.setItem('token', responseData.token);
        localStorage.setItem('user', JSON.stringify(responseData));
    }

    return responseData;
};

// Login user
export const loginUser = async (credentials) => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Login failed');
    }

    // Save token to localStorage
    if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
    }

    return data;
};

// Get current user
export const getCurrentUser = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
        throw new Error('No token found');
    }

    const response = await fetch(`${API_URL}/auth/me`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to get user data');
    }

    return data;
};

// Logout user
export const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.clear(); // Ensure all session data is cleared
};
