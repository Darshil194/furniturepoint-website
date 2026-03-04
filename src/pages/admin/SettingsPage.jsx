import { Settings as SettingsIcon, User, Globe, Shield, Bell } from 'lucide-react';

const SettingsPage = () => {
    return (
        <div className="page-content">
            <div className="page-header">
                <div className="page-header__left">
                    <h1><SettingsIcon size={28} /> Settings</h1>
                    <p>Manage your admin panel preferences</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
                {/* Admin Account */}
                <div className="admin-form" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <div className="stat-card__icon stat-card__icon--primary" style={{ width: 40, height: 40, borderRadius: 10 }}>
                            <User size={20} />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.1rem' }}>Admin Account</h3>
                            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.8rem' }}>Manage your profile and credentials</p>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Admin Name</label>
                        <input type="text" placeholder="Admin User" disabled style={{ opacity: 0.6 }} />
                    </div>
                    <div className="form-group">
                        <label>Admin Email</label>
                        <input type="email" placeholder="admin@furniturepoint.com" disabled style={{ opacity: 0.6 }} />
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                        Contact the system administrator to update account details.
                    </p>
                </div>

                {/* Website Settings */}
                <div className="admin-form" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <div className="stat-card__icon stat-card__icon--success" style={{ width: 40, height: 40, borderRadius: 10 }}>
                            <Globe size={20} />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.1rem' }}>Website Settings</h3>
                            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.8rem' }}>General website configuration</p>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Company Name</label>
                        <input type="text" value="Furniture Point" disabled style={{ opacity: 0.6 }} />
                    </div>
                    <div className="form-group">
                        <label>Support Email</label>
                        <input type="email" value="furniturepointank@gmail.com" disabled style={{ opacity: 0.6 }} />
                    </div>
                    <div className="form-group">
                        <label>Phone</label>
                        <input type="text" value="+91 98250 38287" disabled style={{ opacity: 0.6 }} />
                    </div>
                </div>

                {/* Security */}
                <div className="admin-form" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <div className="stat-card__icon stat-card__icon--warning" style={{ width: 40, height: 40, borderRadius: 10 }}>
                            <Shield size={20} />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.1rem' }}>Security</h3>
                            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.8rem' }}>Authentication and session settings</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Session Storage</span>
                        <span className="status-badge status-badge--active">sessionStorage</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Auto-logout on tab close</span>
                        <span className="status-badge status-badge--active">Enabled</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0' }}>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Persist on refresh</span>
                        <span className="status-badge status-badge--active">Enabled</span>
                    </div>
                </div>

                {/* Notifications */}
                <div className="admin-form" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <div className="stat-card__icon stat-card__icon--danger" style={{ width: 40, height: 40, borderRadius: 10 }}>
                            <Bell size={20} />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.1rem' }}>Notifications</h3>
                            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.8rem' }}>Alert and notification preferences</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>New inquiry alerts</span>
                        <span className="status-badge status-badge--active">On</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0' }}>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Low stock warnings</span>
                        <span className="status-badge status-badge--active">On</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
