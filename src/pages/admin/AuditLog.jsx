import { useState, useMemo, useEffect } from 'react';
import { FileText, Filter, User, Clock, Search, ShieldOff } from 'lucide-react';
import useStore, { PERMISSIONS } from '../../store/useStore';

const AuditLog = () => {
    const auditLog = useStore(state => state.auditLog);
    const fetchAuditLogs = useStore(state => state.fetchAuditLogs);
    const users = useStore(state => state.users);
    const hasPermission = useStore(state => state.hasPermission);

    useEffect(() => {
        fetchAuditLogs();
    }, [fetchAuditLogs]);

    const [searchQuery, setSearchQuery] = useState('');
    const [filterUser, setFilterUser] = useState('all');
    const [filterAction, setFilterAction] = useState('all');
    const [filterEntity, setFilterEntity] = useState('all');

    // Check permission
    if (!hasPermission(PERMISSIONS.VIEW_AUDIT_LOG)) {
        return (
            <div className="page-content">
                <div className="access-denied">
                    <ShieldOff size={64} />
                    <h2>Access Denied</h2>
                    <p>You don't have permission to view the audit log.</p>
                </div>
            </div>
        );
    }

    // Get unique values for filters
    const actionTypes = [...new Set(auditLog.map(entry => entry.action))];
    const entityTypes = [...new Set(auditLog.map(entry => entry.entityType))];

    // Filtered audit entries
    const filteredEntries = useMemo(() => {
        return auditLog.filter(entry => {
            // Search filter
            if (searchQuery && !entry.description?.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }
            // User filter
            if (filterUser !== 'all' && entry.userId?.toString() !== filterUser) {
                return false;
            }
            // Action filter
            if (filterAction !== 'all' && entry.action !== filterAction) {
                return false;
            }
            // Entity filter
            if (filterEntity !== 'all' && entry.entityType !== filterEntity) {
                return false;
            }
            return true;
        });
    }, [auditLog, searchQuery, filterUser, filterAction, filterEntity]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const getActionBadgeClass = (action) => {
        switch (action) {
            case 'create': return 'action-badge action-badge--create';
            case 'update': return 'action-badge action-badge--update';
            case 'delete': return 'action-badge action-badge--delete';
            case 'login': return 'action-badge action-badge--login';
            case 'logout': return 'action-badge action-badge--logout';
            case 'status_change': return 'action-badge action-badge--status';
            default: return 'action-badge';
        }
    };

    const getEntityIcon = (entityType) => {
        switch (entityType) {
            case 'user': return '👤';
            case 'product': return '📦';
            case 'category': return '📁';
            case 'auth': return '🔐';
            default: return '📄';
        }
    };

    return (
        <div className="page-content">
            <div className="page-header">
                <div className="page-header__left">
                    <h1><FileText size={28} /> Audit Log</h1>
                    <p>Track all actions performed in the admin panel</p>
                </div>
            </div>

            {/* Filters */}
            <div className="filters-bar">
                <div className="search-box">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search logs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="filter-group">
                    <Filter size={16} />
                    <select value={filterUser} onChange={(e) => setFilterUser(e.target.value)}>
                        <option value="all">All Users</option>
                        {users.map(user => (
                            <option key={user.id} value={user.id.toString()}>{user.name}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <select value={filterAction} onChange={(e) => setFilterAction(e.target.value)}>
                        <option value="all">All Actions</option>
                        {actionTypes.map(action => (
                            <option key={action} value={action}>{action}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <select value={filterEntity} onChange={(e) => setFilterEntity(e.target.value)}>
                        <option value="all">All Entities</option>
                        {entityTypes.map(entity => (
                            <option key={entity} value={entity}>{entity}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Audit Log Entries */}
            <div className="audit-log-container">
                {filteredEntries.length === 0 ? (
                    <div className="empty-state">
                        <FileText size={48} />
                        <h3>No audit entries found</h3>
                        <p>No activities match your current filters.</p>
                    </div>
                ) : (
                    <div className="audit-log-list">
                        {filteredEntries.map(entry => (
                            <div key={entry.id} className="audit-log-entry">
                                <div className="audit-log-entry__icon">
                                    {getEntityIcon(entry.entityType)}
                                </div>

                                <div className="audit-log-entry__content">
                                    <div className="audit-log-entry__header">
                                        <span className={getActionBadgeClass(entry.action)}>
                                            {entry.action}
                                        </span>
                                        <span className="entity-type">{entry.entityType}</span>
                                    </div>
                                    <p className="audit-log-entry__description">
                                        {entry.description}
                                    </p>
                                    <div className="audit-log-entry__meta">
                                        <span className="meta-item">
                                            <User size={12} />
                                            {entry.userName} ({entry.userRole})
                                        </span>
                                        <span className="meta-item">
                                            <Clock size={12} />
                                            {formatDate(entry.timestamp)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="audit-log-footer">
                <p>Showing {filteredEntries.length} of {auditLog.length} entries</p>
            </div>
        </div>
    );
};

export default AuditLog;
