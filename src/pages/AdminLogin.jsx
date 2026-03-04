import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useStore from '../store/useStore';
import './AdminLogin.css'; // We'll need to create this or use inline styles for now

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const loginAdmin = useStore((state) => state.loginAdmin);
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/admin';

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        const success = loginAdmin(email, password);
        if (success) {
            navigate(from, { replace: true });
        } else {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="admin-login-container">
            <div className="admin-login-card">
                <h2>Admin Panel Access</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter admin email"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            required
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="login-btn">Login</button>

                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
