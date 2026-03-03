import { Link } from 'react-router-dom';
import {
    Package,
    FolderTree,
    AlertTriangle,
    TrendingUp,
    Plus,
    ArrowUpRight,
    ArrowDownRight,
    DollarSign,
    Boxes,
    PlusCircle,
    Edit,
    Trash2
} from 'lucide-react';
import useStore from '../../store/useStore';

const Dashboard = () => {
    const { getStats, products, categories, auditLog } = useStore();
    const stats = getStats();

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(amount);
    };

    // Format relative time
    const formatRelativeTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    // Get action icon
    const getActionIcon = (action) => {
        switch (action) {
            case 'create':
                return <PlusCircle size={18} />;
            case 'update':
                return <Edit size={18} />;
            case 'delete':
                return <Trash2 size={18} />;
            default:
                return <Edit size={18} />;
        }
    };

    // Get recent products
    const recentProducts = [...products]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

    return (
        <div className="dashboard">
            {/* Header */}
            <div className="admin-header">
                <div className="admin-header__title">
                    <h1>Dashboard</h1>
                    <p>Welcome back! Here's what's happening with your store.</p>
                </div>
                <div className="admin-header__actions">
                    <Link to="/admin/products/new" className="btn btn-primary">
                        <Plus size={18} />
                        Add Product
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-card__header">
                        <div className="stat-card__icon stat-card__icon--primary">
                            <Package size={24} />
                        </div>
                        <span className="stat-card__trend stat-card__trend--up">
                            <ArrowUpRight size={14} /> Active
                        </span>
                    </div>
                    <div className="stat-card__value">{stats.totalProducts}</div>
                    <div className="stat-card__label">Total Products</div>
                </div>

                <div className="stat-card">
                    <div className="stat-card__header">
                        <div className="stat-card__icon stat-card__icon--success">
                            <FolderTree size={24} />
                        </div>
                    </div>
                    <div className="stat-card__value">{stats.totalCategories}</div>
                    <div className="stat-card__label">Categories</div>
                </div>

                <div className="stat-card">
                    <div className="stat-card__header">
                        <div className="stat-card__icon stat-card__icon--warning">
                            <AlertTriangle size={24} />
                        </div>
                        {stats.lowStockCount > 0 && (
                            <span className="stat-card__trend stat-card__trend--down">
                                <ArrowDownRight size={14} /> Alert
                            </span>
                        )}
                    </div>
                    <div className="stat-card__value">{stats.lowStockCount}</div>
                    <div className="stat-card__label">Low Stock Items</div>
                </div>

                <div className="stat-card">
                    <div className="stat-card__header">
                        <div className="stat-card__icon stat-card__icon--primary">
                            <DollarSign size={24} />
                        </div>
                    </div>
                    <div className="stat-card__value">{formatCurrency(stats.totalInventoryValue)}</div>
                    <div className="stat-card__label">Inventory Value</div>
                </div>
            </div>

            {/* Content Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                {/* Recent Products */}
                <div className="admin-table-container">
                    <div className="admin-table-header">
                        <h3>Recent Products</h3>
                        <Link to="/admin/products" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                            View All
                        </Link>
                    </div>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentProducts.map(product => (
                                <tr key={product.id}>
                                    <td>
                                        <div className="product-cell">
                                            <img
                                                src={product.images?.[0]?.url || '/placeholder.png'}
                                                alt={product.name}
                                                className="product-cell__img"
                                            />
                                            <div className="product-cell__info">
                                                <h4>{product.name}</h4>
                                                <span>{product.sku}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>${product.price}</td>
                                    <td>
                                        <div className="stock-cell">
                                            <span>{product.stockQuantity}</span>
                                            <div className="stock-cell__bar">
                                                <div
                                                    className={`stock-cell__fill ${product.stockQuantity > 15 ? 'stock-cell__fill--good' :
                                                        product.stockQuantity > 5 ? 'stock-cell__fill--medium' :
                                                            'stock-cell__fill--low'
                                                        }`}
                                                    style={{ width: `${Math.min(product.stockQuantity * 5, 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`status-badge status-badge--${product.status}`}>
                                            {product.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Activity Log */}
                <div className="admin-table-container">
                    <div className="admin-table-header">
                        <h3>Recent Activity</h3>
                    </div>
                    <ul className="activity-list">
                        {auditLog.length === 0 ? (
                            <li className="activity-item">
                                <div className="activity-content">
                                    <p style={{ color: 'var(--text-muted)' }}>No activity yet</p>
                                </div>
                            </li>
                        ) : (
                            auditLog.slice(0, 8).map(log => (
                                <li key={log.id} className="activity-item">
                                    <div className={`activity-icon activity-icon--${log.action}`}>
                                        {getActionIcon(log.action)}
                                    </div>
                                    <div className="activity-content">
                                        <p>
                                            <strong>{log.adminName}</strong> {log.action}d{' '}
                                            <strong>{log.productName}</strong>
                                        </p>
                                        <span className="activity-time">
                                            {formatRelativeTime(log.timestamp)}
                                        </span>
                                    </div>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
