import { useState, useEffect } from 'react';
import { getPendingUsers, verifyUser, logoutUser } from '../services/api';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getPendingUsers();
                setUsers(data);
            } catch (err) {
                setError(err.message);
                if (err.message.includes('Not authorized')) {
                    logoutUser();
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [navigate]);

    const handleVerify = async (userId, status) => {
        try {
            await verifyUser(userId, status);
            // Remove user from list locally after successful update
            setUsers(users.filter((user) => user._id !== userId));
        } catch (err) {
            setError(err.message);
        }
    };

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="admin-container">
            <header className="admin-header">
                <h1>Admin Verification Panel</h1>
                <button onClick={handleLogout} className="btn-logout">Logout</button>
            </header>

            {error && <div className="error-message">{error}</div>}

            {users.length === 0 ? (
                <p>No pending users found.</p>
            ) : (
                <div className="table-responsive">
                    <table className="user-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Affiliation</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                    <td>{user.clubName || user.organizationName || 'N/A'}</td>
                                    <td>
                                        <button
                                            className="btn-approve"
                                            onClick={() => handleVerify(user._id, 'verified')}
                                        >
                                            Approve
                                        </button>
                                        <button
                                            className="btn-reject"
                                            onClick={() => handleVerify(user._id, 'rejected')}
                                        >
                                            Reject
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
