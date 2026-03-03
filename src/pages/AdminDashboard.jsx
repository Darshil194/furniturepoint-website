import useStore from '../store/useStore';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const adminUser = useStore((state) => state.adminUser);
    const logoutAdmin = useStore((state) => state.logoutAdmin);
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutAdmin();
        navigate('/admin/login');
    };

    return (
        <div className="admin-dashboard" style={{ padding: '2rem', color: 'var(--text-primary)' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Admin Dashboard</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span>Welcome, {adminUser?.name}</span>
                    <button
                        onClick={handleLogout}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: 'var(--accent)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Logout
                    </button>
                </div>
            </header>

            <div className="dashboard-content">
                <p>Protected Admin Area. Only visible when logged in.</p>
                {/* Future: Add product/order management here */}
            </div>
        </div>
    );
};

export default AdminDashboard;
