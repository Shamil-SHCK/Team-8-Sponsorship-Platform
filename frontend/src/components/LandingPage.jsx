import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <h1 style={styles.title}>Welcome to Sponsorship Platform</h1>
                <p style={styles.description}>
                    Connect with sponsors, clubs, and alumni. A unified platform for building meaningful partnerships.
                </p>
                <div style={styles.buttonGroup}>
                    <button style={styles.loginButton} onClick={() => navigate('/login')}>
                        Login
                    </button>
                    <button style={styles.registerButton} onClick={() => navigate('/register')}>
                        Register
                    </button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        fontFamily: '"Inter", "Segoe UI", sans-serif',
        padding: '2rem',
        textAlign: 'center',
    },
    content: {
        maxWidth: '800px',
        backgroundColor: 'white',
        padding: '3rem',
        borderRadius: '16px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    },
    title: {
        marginBottom: '1rem',
        fontSize: '3rem',
        color: '#1e293b',
        fontWeight: '800',
        lineHeight: 1.2,
    },
    description: {
        fontSize: '1.25rem',
        color: '#64748b',
        marginBottom: '2.5rem',
        lineHeight: 1.6,
    },
    buttonGroup: {
        display: 'flex',
        gap: '1.5rem',
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    loginButton: {
        padding: '0.75rem 2rem',
        backgroundColor: '#2563eb', // Blue-600
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1.125rem', // 18px
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        minWidth: '150px',
    },
    registerButton: {
        padding: '0.75rem 2rem',
        backgroundColor: '#10b981', // Emerald-500
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1.125rem', // 18px
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        minWidth: '150px',
    },
};

export default LandingPage;
