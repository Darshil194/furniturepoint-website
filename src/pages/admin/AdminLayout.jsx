import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import {
    LayoutDashboard,
    Package,
    FolderTree,
    Users,
    FileText,
    Settings,
    LogOut,
    ChevronRight
} from 'lucide-react';
import useStore from '../../store/useStore';
import './Admin.css';

const AdminLayout = () => {
    const { adminUser, logoutAdmin, getStats } = useStore();
    const navigate = useNavigate();
    const stats = getStats();

    // Session management: mark admin panel as active
    // Auth clearing on SPA navigation is handled in App.jsx via route change detection
    useEffect(() => {
        sessionStorage.setItem('fp-admin-active', 'true');
    }, []);

    const handleLogout = () => {
        logoutAdmin();
        navigate('/admin/login');
    };

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="admin-sidebar__header">
                    <NavLink to="/" className="admin-sidebar__logo">
                        <span className="logo-icon">FP</span>
                        <div>
                            <span className="logo-text">Furniture Point</span>
                            <span className="logo-badge">Admin</span>
                        </div>
                    </NavLink>
                </div>

                <nav className="admin-sidebar__nav">
                    <div className="admin-nav__section">
                        <span className="admin-nav__title">Main</span>
                        <ul className="admin-nav__list">
                            <li className="admin-nav__item">
                                <NavLink to="/admin" end className={({ isActive }) => `admin-nav__link ${isActive ? 'active' : ''}`}>
                                    <LayoutDashboard size={20} />
                                    Dashboard
                                </NavLink>
                            </li>
                        </ul>
                    </div>

                    <div className="admin-nav__section">
                        <span className="admin-nav__title">Catalog</span>
                        <ul className="admin-nav__list">
                            <li className="admin-nav__item">
                                <NavLink to="/admin/products" className={({ isActive }) => `admin-nav__link ${isActive ? 'active' : ''}`}>
                                    <Package size={20} />
                                    Products
                                    <span className="admin-nav__badge">{stats.totalProducts}</span>
                                </NavLink>
                            </li>
                            <li className="admin-nav__item">
                                <NavLink to="/admin/categories" className={({ isActive }) => `admin-nav__link ${isActive ? 'active' : ''}`}>
                                    <FolderTree size={20} />
                                    Categories
                                </NavLink>
                            </li>
                        </ul>
                    </div>

                    <div className="admin-nav__section">
                        <span className="admin-nav__title">Management</span>
                        <ul className="admin-nav__list">
                            <li className="admin-nav__item">
                                <NavLink to="/admin/inquiries" className={({ isActive }) => `admin-nav__link ${isActive ? 'active' : ''}`}>
                                    <Users size={20} />
                                    Inquiries
                                </NavLink>
                            </li>
                            <li className="admin-nav__item">
                                <NavLink to="/admin/activity" className={({ isActive }) => `admin-nav__link ${isActive ? 'active' : ''}`}>
                                    <FileText size={20} />
                                    Activity Log
                                </NavLink>
                            </li>
                        </ul>
                    </div>

                    <div className="admin-nav__section">
                        <span className="admin-nav__title">System</span>
                        <ul className="admin-nav__list">
                            <li className="admin-nav__item">
                                <NavLink to="/admin/policies" className={({ isActive }) => `admin-nav__link ${isActive ? 'active' : ''}`}>
                                    <FileText size={20} />
                                    Policies
                                </NavLink>
                            </li>
                            <li className="admin-nav__item">
                                <NavLink to="/admin/settings" className={({ isActive }) => `admin-nav__link ${isActive ? 'active' : ''}`}>
                                    <Settings size={20} />
                                    Settings
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </nav>

                <div className="admin-sidebar__footer">
                    <div className="admin-user">
                        <div className="admin-user__avatar">
                            {adminUser?.name?.charAt(0) || 'A'}
                        </div>
                        <div className="admin-user__info">
                            <span className="admin-user__name">{adminUser?.name || 'Admin'}</span>
                            <span className="admin-user__role">{adminUser?.role || 'Super Admin'}</span>
                        </div>
                        <button className="admin-user__logout" onClick={handleLogout} title="Logout">
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
