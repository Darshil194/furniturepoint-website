import { useState } from 'react';
import { Users, Plus, Edit2, Trash2, Shield, ShieldOff, X, Check, AlertCircle } from 'lucide-react';
import useStore, { ROLES, PERMISSIONS } from '../../store/useStore';

const UserManagement = () => {
    const users = useStore(state => state.users);
    const adminUser = useStore(state => state.adminUser);
    const hasPermission = useStore(state => state.hasPermission);
    const addUser = useStore(state => state.addUser);
    const updateUser = useStore(state => state.updateUser);
    const toggleUserStatus = useStore(state => state.toggleUserStatus);
    const deleteUser = useStore(state => state.deleteUser);

    const [showForm, setShowForm] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: ROLES.STAFF
    });

    // Check permission
    if (!hasPermission(PERMISSIONS.MANAGE_USERS)) {
        return (
            <div className="page-content">
                <div className="access-denied">
                    <ShieldOff size={64} />
                    <h2>Access Denied</h2>
                    <p>You don't have permission to manage users.</p>
                </div>
            </div>
        );
    }

    const resetForm = () => {
        setFormData({ name: '', email: '', password: '', role: ROLES.STAFF });
        setEditingUser(null);
        setShowForm(false);
        setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (editingUser) {
            // Update existing user
            const updates = { ...formData };
            if (!updates.password) delete updates.password; // Don't update password if empty

            const result = updateUser(editingUser.id, updates);
            if (!result.success) {
                setError(result.error);
                return;
            }
        } else {
            // Create new user
            if (!formData.password) {
                setError('Password is required for new users');
                return;
            }

            const result = addUser(formData);
            if (!result.success) {
                setError(result.error);
                return;
            }
        }

        resetForm();
    };

    const handleEdit = (user) => {
        setFormData({
            name: user.name,
            email: user.email,
            password: '', // Don't show password
            role: user.role
        });
        setEditingUser(user);
        setShowForm(true);
    };

    const handleToggleStatus = (userId) => {
        const result = toggleUserStatus(userId);
        if (!result.success) {
            setError(result.error);
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleDelete = (userId) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            const result = deleteUser(userId);
            if (!result.success) {
                setError(result.error);
                setTimeout(() => setError(''), 3000);
            }
        }
    };

    const getRoleBadgeClass = (role) => {
        switch (role) {
            case ROLES.ADMIN: return 'role-badge role-badge--admin';
            case ROLES.MANAGER: return 'role-badge role-badge--manager';
            default: return 'role-badge role-badge--staff';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Never';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="page-content">
            <div className="page-header">
                <div className="page-header__left">
                    <h1><Users size={28} /> User Management</h1>
                    <p>Manage employee accounts and access permissions</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                    <Plus size={18} />
                    Add User
                </button>
            </div>

            {error && (
                <div className="alert alert--error">
                    <AlertCircle size={18} />
                    {error}
                </div>
            )}

            {/* User Form Modal */}
            {showForm && (
                <div className="modal-overlay">
                    <div className="modal user-form-modal">
                        <div className="modal__header">
                            <h2>{editingUser ? 'Edit User' : 'Add New User'}</h2>
                            <button className="modal__close" onClick={resetForm}>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="user-form">
                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Enter full name"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="Enter email address"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Password {editingUser && '(leave blank to keep current)'}</label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder={editingUser ? 'Leave blank to keep current' : 'Enter password'}
                                    required={!editingUser}
                                />
                            </div>

                            <div className="form-group">
                                <label>Role</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value={ROLES.STAFF}>Staff (View Only)</option>
                                    <option value={ROLES.MANAGER}>Manager (Edit Products)</option>
                                    <option value={ROLES.ADMIN}>Admin (Full Access)</option>
                                </select>
                                <small className="form-hint">
                                    {formData.role === ROLES.ADMIN && 'Full access to all features including user management'}
                                    {formData.role === ROLES.MANAGER && 'Can view prices and edit products, but cannot manage users'}
                                    {formData.role === ROLES.STAFF && 'Can only view products, no access to prices or editing'}
                                </small>
                            </div>

                            {error && <p className="error-message"><AlertCircle size={14} /> {error}</p>}

                            <div className="form-actions">
                                <button type="button" className="btn btn-outline" onClick={resetForm}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    <Check size={18} />
                                    {editingUser ? 'Update User' : 'Create User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Users Table */}
            <div className="data-table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Last Login</th>
                            <th>Created</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className={user.status === 'inactive' ? 'row--inactive' : ''}>
                                <td>
                                    <div className="user-info">
                                        <div className="user-avatar">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="user-details">
                                            <strong>{user.name}</strong>
                                            <span>{user.email}</span>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span className={getRoleBadgeClass(user.role)}>
                                        <Shield size={12} />
                                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                    </span>
                                </td>
                                <td>
                                    <span className={`status-badge status-badge--${user.status}`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td>{formatDate(user.lastLogin)}</td>
                                <td>{formatDate(user.createdAt)}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button
                                            className="action-btn"
                                            onClick={() => handleEdit(user)}
                                            title="Edit user"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        {user.id !== adminUser?.id && (
                                            <>
                                                <button
                                                    className={`action-btn ${user.status === 'active' ? 'action-btn--warning' : 'action-btn--success'}`}
                                                    onClick={() => handleToggleStatus(user.id)}
                                                    title={user.status === 'active' ? 'Disable user' : 'Enable user'}
                                                >
                                                    {user.status === 'active' ? <ShieldOff size={16} /> : <Shield size={16} />}
                                                </button>
                                                <button
                                                    className="action-btn action-btn--danger"
                                                    onClick={() => handleDelete(user.id)}
                                                    title="Delete user"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;
