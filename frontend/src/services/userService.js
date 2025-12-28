import { API_URL } from './config';

// Update user profile
export const updateUserProfile = async (userData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
    }

    return data;
};

// Change user password
export const changeUserPassword = async (passwordData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/auth/password`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(passwordData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to change password');
    }

    return data;
};
