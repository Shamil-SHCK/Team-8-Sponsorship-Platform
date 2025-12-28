import { API_URL } from './config';

// Admin: Get pending users
export const getPendingUsers = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/admin/users/pending`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch pending users');
    }

    return data;
};

// Admin: Get all users
export const getAllUsers = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/admin/users`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch users');
    }

    return data;
};

// Admin: Reset User Password
export const resetUserPassword = async (userId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/admin/users/${userId}/reset-password`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
    }

    return data;
};

// Admin: Verify user
export const verifyUser = async (userId, status) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/admin/verify/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to update user status');
    }

    return data;
};
