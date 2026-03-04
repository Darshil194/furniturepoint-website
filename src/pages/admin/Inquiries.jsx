import { useState, useEffect, useMemo } from 'react';
import { Mail, Search, Trash2, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import useStore from '../../store/useStore';

const Inquiries = () => {
    const inquiries = useStore(state => state.inquiries);
    const fetchInquiries = useStore(state => state.fetchInquiries);
    const updateInquiryStatus = useStore(state => state.updateInquiryStatus);
    const deleteInquiry = useStore(state => state.deleteInquiry);

    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [deleting, setDeleting] = useState(null);

    useEffect(() => {
        fetchInquiries();
    }, [fetchInquiries]);

    const filteredInquiries = useMemo(() => {
        return inquiries
            .filter(inq => {
                if (filterStatus !== 'all' && inq.status !== filterStatus) return false;
                if (searchQuery) {
                    const q = searchQuery.toLowerCase();
                    return (
                        inq.name?.toLowerCase().includes(q) ||
                        inq.companyName?.toLowerCase().includes(q) ||
                        inq.email?.toLowerCase().includes(q) ||
                        inq.productName?.toLowerCase().includes(q) ||
                        inq.message?.toLowerCase().includes(q)
                    );
                }
                return true;
            })
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }, [inquiries, searchQuery, filterStatus]);

    const formatDate = (dateString) => {
        if (!dateString) return '—';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleStatusToggle = (id, currentStatus) => {
        const newStatus = currentStatus === 'read' ? 'pending' : 'read';
        updateInquiryStatus(id, newStatus);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this inquiry?')) return;
        setDeleting(id);
        await deleteInquiry(id);
        setDeleting(null);
    };

    const pendingCount = inquiries.filter(i => i.status === 'pending').length;
    const readCount = inquiries.filter(i => i.status === 'read').length;

    return (
        <div className="page-content">
            <div className="page-header">
                <div className="page-header__left">
                    <h1><Mail size={28} /> Inquiries</h1>
                    <p>Contact form submissions from your website</p>
                </div>
            </div>

            {/* Stats row */}
            <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
                <div className="stat-card">
                    <div className="stat-card__header">
                        <div className="stat-card__icon stat-card__icon--primary">
                            <Mail size={24} />
                        </div>
                    </div>
                    <div className="stat-card__value">{inquiries.length}</div>
                    <div className="stat-card__label">Total Inquiries</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card__header">
                        <div className="stat-card__icon stat-card__icon--warning">
                            <Clock size={24} />
                        </div>
                    </div>
                    <div className="stat-card__value">{pendingCount}</div>
                    <div className="stat-card__label">Pending</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card__header">
                        <div className="stat-card__icon stat-card__icon--success">
                            <CheckCircle size={24} />
                        </div>
                    </div>
                    <div className="stat-card__value">{readCount}</div>
                    <div className="stat-card__label">Read</div>
                </div>
            </div>

            {/* Filters */}
            <div className="filters-bar" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <div className="admin-table-search">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search inquiries..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="filter-group">
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                        style={{
                            padding: '0.5rem 1rem',
                            background: 'rgba(0,0,0,0.2)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            color: 'var(--text-primary)',
                            fontSize: '0.9rem'
                        }}
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="read">Read</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="admin-table-container">
                <div className="admin-table-header">
                    <h3>Inquiries ({filteredInquiries.length})</h3>
                </div>

                {filteredInquiries.length === 0 ? (
                    <div className="empty-state">
                        <AlertCircle size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                        <h3>No inquiries found</h3>
                        <p>No inquiries match your current filters.</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Company</th>
                                    <th>Contact</th>
                                    <th>Product / Qty</th>
                                    <th>Location</th>
                                    <th>Message</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredInquiries.map(inq => (
                                    <tr key={inq.id} style={{ opacity: deleting === inq.id ? 0.5 : 1 }}>
                                        <td>
                                            <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{inq.name}</div>
                                        </td>
                                        <td>{inq.companyName || '—'}</td>
                                        <td>
                                            <div style={{ fontSize: '0.85rem' }}>{inq.email}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{inq.phone || '—'}</div>
                                        </td>
                                        <td>
                                            <div style={{ fontSize: '0.85rem' }}>{inq.productName || '—'}</div>
                                            {inq.quantity && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Qty: {inq.quantity}</div>}
                                        </td>
                                        <td style={{ fontSize: '0.85rem' }}>{inq.projectLocation || '—'}</td>
                                        <td>
                                            <div style={{
                                                maxWidth: '200px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                fontSize: '0.85rem'
                                            }}>
                                                {inq.message || '—'}
                                            </div>
                                        </td>
                                        <td style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                                            {formatDate(inq.createdAt)}
                                        </td>
                                        <td>
                                            <button
                                                className={`status-badge ${inq.status === 'read' ? 'status-badge--active' : 'status-badge--draft'}`}
                                                onClick={() => handleStatusToggle(inq.id, inq.status)}
                                                style={{ cursor: 'pointer', border: 'none' }}
                                                title={`Mark as ${inq.status === 'read' ? 'Pending' : 'Read'}`}
                                            >
                                                {inq.status === 'read' ? (
                                                    <><CheckCircle size={12} /> Read</>
                                                ) : (
                                                    <><Clock size={12} /> Pending</>
                                                )}
                                            </button>
                                        </td>
                                        <td>
                                            <div className="action-btns">
                                                <button
                                                    className="action-btn action-btn--delete"
                                                    onClick={() => handleDelete(inq.id)}
                                                    title="Delete inquiry"
                                                    disabled={deleting === inq.id}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Showing {filteredInquiries.length} of {inquiries.length} inquiries
            </div>
        </div>
    );
};

export default Inquiries;
