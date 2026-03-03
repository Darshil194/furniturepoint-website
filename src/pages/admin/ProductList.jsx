import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Eye,
    Filter,
    ChevronDown,
    Package
} from 'lucide-react';
import useStore from '../../store/useStore';

const ProductList = () => {
    const { products, categories, subcategories, deleteProduct } = useStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest');

    // Filter and sort products
    const filteredProducts = useMemo(() => {
        let result = [...products];

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(p =>
                p.name.toLowerCase().includes(query) ||
                p.sku.toLowerCase().includes(query)
            );
        }

        // Category filter
        if (categoryFilter !== 'all') {
            result = result.filter(p => p.categoryId === parseInt(categoryFilter));
        }

        // Status filter
        if (statusFilter !== 'all') {
            result = result.filter(p => p.status === statusFilter);
        }

        // Sort
        switch (sortBy) {
            case 'newest':
                result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'oldest':
                result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                break;
            case 'name':
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'price-high':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'price-low':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'stock':
                result.sort((a, b) => a.stockQuantity - b.stockQuantity);
                break;
            default:
                break;
        }

        return result;
    }, [products, searchQuery, categoryFilter, statusFilter, sortBy]);

    const handleDelete = async (productId, productName) => {
        if (window.confirm(`Are you sure you want to delete "${productName}"?`)) {
            const success = await deleteProduct(productId);
            if (!success) {
                alert('Failed to delete product. Please try again.');
            }
        }
    };

    const getCategoryName = (categoryId) => {
        return categories.find(c => c.id === categoryId)?.name || 'Unknown';
    };

    return (
        <div className="product-list-page">
            {/* Header */}
            <div className="admin-header">
                <div className="admin-header__title">
                    <h1>Products</h1>
                    <p>Manage your furniture catalog</p>
                </div>
                <div className="admin-header__actions">
                    <Link to="/admin/products/new" className="btn btn-primary">
                        <Plus size={18} />
                        Add Product
                    </Link>
                </div>
            </div>

            {/* Filters */}
            <div className="admin-table-container" style={{ marginBottom: '1.5rem' }}>
                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    padding: '1rem 1.5rem',
                    flexWrap: 'wrap',
                    alignItems: 'center'
                }}>
                    <div className="admin-table-search" style={{ flex: '1', minWidth: '200px' }}>
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        style={{
                            padding: '0.5rem 1rem',
                            background: 'rgba(0, 0, 0, 0.2)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                            color: 'var(--text-primary)',
                            fontSize: '0.9rem'
                        }}
                    >
                        <option value="all">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={{
                            padding: '0.5rem 1rem',
                            background: 'rgba(0, 0, 0, 0.2)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                            color: 'var(--text-primary)',
                            fontSize: '0.9rem'
                        }}
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="draft">Draft</option>
                    </select>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        style={{
                            padding: '0.5rem 1rem',
                            background: 'rgba(0, 0, 0, 0.2)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                            color: 'var(--text-primary)',
                            fontSize: '0.9rem'
                        }}
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="name">Name A-Z</option>
                        <option value="price-high">Price High-Low</option>
                        <option value="price-low">Price Low-High</option>
                        <option value="stock">Stock (Low First)</option>
                    </select>
                </div>
            </div>

            {/* Products Table */}
            <div className="admin-table-container">
                {filteredProducts.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state__icon">
                            <Package size={40} />
                        </div>
                        <h3>No products found</h3>
                        <p>Try adjusting your search or filters, or add a new product.</p>
                        <Link to="/admin/products/new" className="btn btn-primary">
                            <Plus size={18} />
                            Add Product
                        </Link>
                    </div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map(product => (
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
                                    <td>{getCategoryName(product.categoryId)}</td>
                                    <td>
                                        <div>
                                            <strong>{product.discountPrice || product.price}</strong>
                                            {product.discountPrice && product.discountPrice < product.price && (
                                                <span style={{
                                                    textDecoration: 'line-through',
                                                    color: 'var(--text-muted)',
                                                    marginLeft: '0.5rem',
                                                    fontSize: '0.85rem'
                                                }}>
                                                    {product.price}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="stock-cell">
                                            <span style={{
                                                color: product.stockQuantity < 10 ? '#ef4444' :
                                                    product.stockQuantity < 20 ? '#f59e0b' : 'inherit'
                                            }}>
                                                {product.stockQuantity}
                                            </span>
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
                                    <td>
                                        <div className="action-btns">
                                            <Link
                                                to={`/admin/products/${product.id}/edit`}
                                                className="action-btn action-btn--edit"
                                                title="Edit"
                                            >
                                                <Edit size={16} />
                                            </Link>
                                            <button
                                                className="action-btn action-btn--delete"
                                                onClick={() => handleDelete(product.id, product.name)}
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Summary */}
            <div style={{
                marginTop: '1rem',
                color: 'var(--text-muted)',
                fontSize: '0.85rem'
            }}>
                Showing {filteredProducts.length} of {products.length} products
            </div>
        </div>
    );
};

export default ProductList;
