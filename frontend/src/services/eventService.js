import { API_URL } from './config';

// Create new event
export const createEvent = async (eventData) => {
    const token = localStorage.getItem('token');

    // eventData is expected to be FormData since we have file uploads
    const response = await fetch(`${API_URL}/events`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            // Content-Type is NOT set manually for FormData, browser sets it with boundary
        },
        body: eventData,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to create event');
    }

    return data;
};

// Get all events
export const getEvents = async () => {
    // Public route, but we send token if available for role checks if needed later
    const token = localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json' };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/events`, {
        method: 'GET',
        headers,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch events');
    }

    return data;
};

// Get single event
export const getEventById = async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/events/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch event');
    }

    return data;
};

// Update event
export const updateEvent = async (id, eventData) => {
    const token = localStorage.getItem('token');

    // Check if eventData is FormData (files included) or JSON
    const isFormData = eventData instanceof FormData;
    const headers = { Authorization: `Bearer ${token}` };

    if (!isFormData) {
        headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${API_URL}/events/${id}`, {
        method: 'PUT',
        headers: headers,
        body: isFormData ? eventData : JSON.stringify(eventData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to update event');
    }

    return data;
};

// Sponsor event
export const sponsorEvent = async (id, amount) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/events/${id}/sponsor`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to sponsor event');
    }

    return data;
};
