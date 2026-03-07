import { useState, useRef } from 'react';
import { Plus, Edit, Trash2, FolderTree, ChevronRight, Upload, X, Image } from 'lucide-react';
import useStore from '../../store/useStore';
import EditableSelect from '../../components/common/EditableSelect';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const CategoryManager = () => {
    const {
        categories,
        subcategories,
        addCategory,
        updateCategory,
        deleteCategory,
        addSubcategory,
        updateSubcategory,
        deleteSubcategory,
        products
    } = useStore();

    const [editingCategory, setEditingCategory] = useState(null); // null or { id, name, description, imageUrl }
    const [editingSubcategory, setEditingSubcategory] = useState(null); // null or { id, categoryId, name, description, imageUrl }
    const [newCategory, setNewCategory] = useState({ name: '', description: '', imageUrl: '' });
    const [newSubcategory, setNewSubcategory] = useState({ categoryId: '', name: '', description: '', imageUrl: '' });
    const [showAddCategory, setShowAddCategory] = useState(false);
    const [showAddSubcategory, setShowAddSubcategory] = useState(false);
    const [uploading, setUploading] = useState(false);

    const catImageRef = useRef(null);
    const subImageRef = useRef(null);
    const editCatImageRef = useRef(null);
    const editSubImageRef = useRef(null);

    // Upload image helper
    const handleImageUpload = async (file, setStateFn, stateObj) => {
        if (!file) return;

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            alert('Invalid file type. Only JPG, PNG, and WebP are allowed.');
            return;
        }

        // Validate file size (3MB)
        if (file.size > 3 * 1024 * 1024) {
            alert('File too large. Maximum size is 3MB.');
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await fetch(`${API_BASE_URL}/api/upload`, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                // Store only the relative path
                setStateFn({ ...stateObj, imageUrl: data.url });
            } else {
                alert('Failed to upload image.');
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload image.');
        } finally {
            setUploading(false);
        }
    };

    // Get product count for category
    const getCategoryProductCount = (categoryId) => {
        return products.filter(p => p.categoryId === categoryId).length;
    };

    // Get product count for subcategory
    const getSubcategoryProductCount = (subcategoryId) => {
        return products.filter(p => p.subcategoryId === subcategoryId).length;
    };

    // Get subcategories for a category
    const getSubcategoriesForCategory = (categoryId) => {
        return subcategories.filter(s => s.categoryId === categoryId);
    };

    // Handle add category
    const handleAddCategory = () => {
        if (newCategory.name.trim()) {
            addCategory(newCategory);
            setNewCategory({ name: '', description: '', imageUrl: '' });
            setShowAddCategory(false);
        }
    };

    // Handle add subcategory
    const handleAddSubcategory = () => {
        if (newSubcategory.name.trim() && newSubcategory.categoryId) {
            addSubcategory({
                ...newSubcategory,
                categoryId: parseInt(newSubcategory.categoryId)
            });
            setNewSubcategory({ categoryId: '', name: '', description: '', imageUrl: '' });
            setShowAddSubcategory(false);
        }
    };

    // Handle delete category
    const handleDeleteCategory = (categoryId, categoryName) => {
        const productCount = getCategoryProductCount(categoryId);
        const subCount = getSubcategoriesForCategory(categoryId).length;

        if (productCount > 0) {
            alert(`Cannot delete "${categoryName}" - it has ${productCount} products assigned.`);
            return;
        }

        if (subCount > 0) {
            alert(`Cannot delete "${categoryName}" - it has ${subCount} subcategories. Delete subcategories first.`);
            return;
        }

        if (window.confirm(`Delete category "${categoryName}"?`)) {
            deleteCategory(categoryId);
        }
    };

    // Handle delete subcategory
    const handleDeleteSubcategory = (subcategoryId, subcategoryName) => {
        const productCount = getSubcategoryProductCount(subcategoryId);

        if (productCount > 0) {
            alert(`Cannot delete "${subcategoryName}" - it has ${productCount} products assigned.`);
            return;
        }

        if (window.confirm(`Delete subcategory "${subcategoryName}"?`)) {
            deleteSubcategory(subcategoryId);
        }
    };

    // Image preview component
    const ImagePreview = ({ imageUrl, onRemove, size = 60 }) => {
        if (!imageUrl) return null;
        const fullUrl = imageUrl.startsWith('http') ? imageUrl : `${API_BASE_URL}${imageUrl}`;
        return (
            <div style={{
                position: 'relative',
                width: size,
                height: size,
                borderRadius: '8px',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.1)',
                flexShrink: 0
            }}>
                <img
                    src={fullUrl}
                    alt="Preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.src = '/images/category-placeholder.jpg'; }}
                />
                {onRemove && (
                    <button
                        onClick={onRemove}
                        style={{
                            position: 'absolute', top: 2, right: 2,
                            background: 'rgba(0,0,0,0.6)', border: 'none',
                            borderRadius: '50%', width: 20, height: 20,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', color: '#fff', padding: 0
                        }}
                    >
                        <X size={12} />
                    </button>
                )}
            </div>
        );
    };

    // Upload button component
    const UploadButton = ({ inputRef, onUpload, uploading: isUploading }) => (
        <button
            type="button"
            className="btn btn-secondary"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', padding: '0.5rem 0.8rem' }}
        >
            <Upload size={14} />
            {isUploading ? 'Uploading...' : 'Image'}
        </button>
    );

    return (
        <div className="category-manager">
            {/* Header */}
            <div className="admin-header">
                <div className="admin-header__title">
                    <h1>Categories</h1>
                    <p>Manage your product categories and subcategories</p>
                </div>
                <div className="admin-header__actions">
                    <button
                        className="btn btn-secondary"
                        onClick={() => setShowAddSubcategory(!showAddSubcategory)}
                    >
                        <Plus size={18} />
                        Add Subcategory
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowAddCategory(!showAddCategory)}
                    >
                        <Plus size={18} />
                        Add Category
                    </button>
                </div>
            </div>

            {/* Add Category Form */}
            {showAddCategory && (
                <div className="admin-form" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
                    <h3 style={{ color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '1rem' }}>
                        New Category
                    </h3>
                    <div className="form-row">
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <input
                                type="text"
                                value={newCategory.name}
                                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                                placeholder="Category name"
                            />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0, flex: 2 }}>
                            <input
                                type="text"
                                value={newCategory.description}
                                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                                placeholder="Description (optional)"
                            />
                        </div>
                        <input
                            type="file"
                            ref={catImageRef}
                            accept=".jpg,.jpeg,.png,.webp"
                            style={{ display: 'none' }}
                            onChange={(e) => handleImageUpload(e.target.files[0], setNewCategory, newCategory)}
                        />
                        {newCategory.imageUrl ? (
                            <ImagePreview
                                imageUrl={newCategory.imageUrl}
                                onRemove={() => setNewCategory({ ...newCategory, imageUrl: '' })}
                                size={40}
                            />
                        ) : (
                            <UploadButton inputRef={catImageRef} uploading={uploading} />
                        )}
                        <button className="btn btn-primary" onClick={handleAddCategory}>
                            Add
                        </button>
                        <button className="btn btn-secondary" onClick={() => setShowAddCategory(false)}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Add Subcategory Form */}
            {showAddSubcategory && (
                <div className="admin-form" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
                    <h3 style={{ color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '1rem' }}>
                        New Subcategory
                    </h3>
                    <div className="form-row">
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <EditableSelect
                                    options={categories}
                                    value={newSubcategory.categoryId}
                                    onChange={(e) => setNewSubcategory({ ...newSubcategory, categoryId: e.target.value })}
                                    onAdd={(name) => addCategory({ name, description: '' })}
                                    placeholder="Select Category"
                                />
                            </div>
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <input
                                type="text"
                                value={newSubcategory.name}
                                onChange={(e) => setNewSubcategory({ ...newSubcategory, name: e.target.value })}
                                placeholder="Subcategory name"
                            />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0, flex: 2 }}>
                            <input
                                type="text"
                                value={newSubcategory.description}
                                onChange={(e) => setNewSubcategory({ ...newSubcategory, description: e.target.value })}
                                placeholder="Description (optional)"
                            />
                        </div>
                        <input
                            type="file"
                            ref={subImageRef}
                            accept=".jpg,.jpeg,.png,.webp"
                            style={{ display: 'none' }}
                            onChange={(e) => handleImageUpload(e.target.files[0], setNewSubcategory, newSubcategory)}
                        />
                        {newSubcategory.imageUrl ? (
                            <ImagePreview
                                imageUrl={newSubcategory.imageUrl}
                                onRemove={() => setNewSubcategory({ ...newSubcategory, imageUrl: '' })}
                                size={40}
                            />
                        ) : (
                            <UploadButton inputRef={subImageRef} uploading={uploading} onUpload={() => { }} />
                        )}
                        <button className="btn btn-primary" onClick={handleAddSubcategory}>
                            Add
                        </button>
                        <button className="btn btn-secondary" onClick={() => setShowAddSubcategory(false)}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Categories List */}
            <div className="admin-table-container">
                {categories.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state__icon">
                            <FolderTree size={40} />
                        </div>
                        <h3>No categories yet</h3>
                        <p>Create your first category to organize products.</p>
                        <button className="btn btn-primary" onClick={() => setShowAddCategory(true)}>
                            <Plus size={18} />
                            Add Category
                        </button>
                    </div>
                ) : (
                    <div style={{ padding: '1rem' }}>
                        {categories.map(category => (
                            <div key={category.id} style={{ marginBottom: '1rem' }}>
                                {/* Category Row */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '1rem',
                                    background: 'rgba(0, 0, 0, 0.2)',
                                    borderRadius: '10px',
                                    marginBottom: '0.5rem'
                                }}>
                                    {/* Category Image Thumbnail */}
                                    {category.imageUrl ? (
                                        <div style={{
                                            width: 36, height: 36, borderRadius: '6px',
                                            overflow: 'hidden', marginRight: '0.75rem', flexShrink: 0,
                                            border: '1px solid rgba(255,255,255,0.1)'
                                        }}>
                                            <img
                                                src={category.imageUrl.startsWith('http') ? category.imageUrl : `${API_BASE_URL}${category.imageUrl}`}
                                                alt={category.name}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                onError={(e) => { e.target.src = '/images/category-placeholder.jpg'; }}
                                            />
                                        </div>
                                    ) : (
                                        <Image size={20} style={{ color: 'var(--text-muted)', marginRight: '0.75rem', opacity: 0.4 }} />
                                    )}

                                    <FolderTree size={20} style={{ color: 'var(--accent)', marginRight: '0.75rem' }} />

                                    <span style={{ color: 'var(--text-primary)', fontWeight: 500, flex: 1 }}>
                                        {category.name}
                                    </span>

                                    <span style={{
                                        color: 'var(--text-muted)',
                                        fontSize: '0.85rem',
                                        marginRight: '1rem'
                                    }}>
                                        {getCategoryProductCount(category.id)} products
                                    </span>

                                    <div className="action-btns">
                                        <button
                                            className="action-btn action-btn--edit"
                                            onClick={() => setEditingCategory({ id: category.id, name: category.name, description: category.description || '', imageUrl: category.imageUrl || '' })}
                                            title="Edit"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            className="action-btn action-btn--delete"
                                            onClick={() => handleDeleteCategory(category.id, category.name)}
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                {/* Subcategories */}
                                {getSubcategoriesForCategory(category.id).map(sub => (
                                    <div key={sub.id} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '0.75rem 1rem',
                                        marginLeft: '2rem',
                                        background: 'rgba(255, 255, 255, 0.02)',
                                        borderRadius: '8px',
                                        marginBottom: '0.25rem',
                                        borderLeft: '2px solid rgba(212, 175, 55, 0.3)'
                                    }}>
                                        {/* Subcategory Image Thumbnail */}
                                        {sub.imageUrl ? (
                                            <div style={{
                                                width: 28, height: 28, borderRadius: '4px',
                                                overflow: 'hidden', marginRight: '0.5rem', flexShrink: 0,
                                                border: '1px solid rgba(255,255,255,0.1)'
                                            }}>
                                                <img
                                                    src={sub.imageUrl.startsWith('http') ? sub.imageUrl : `${API_BASE_URL}${sub.imageUrl}`}
                                                    alt={sub.name}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    onError={(e) => { e.target.src = '/images/category-placeholder.jpg'; }}
                                                />
                                            </div>
                                        ) : null}

                                        <ChevronRight size={16} style={{ color: 'var(--text-muted)', marginRight: '0.5rem' }} />

                                        <span style={{ color: 'var(--text-secondary)', flex: 1, fontSize: '0.9rem' }}>
                                            {sub.name}
                                        </span>

                                        <span style={{
                                            color: 'var(--text-muted)',
                                            fontSize: '0.8rem',
                                            marginRight: '1rem'
                                        }}>
                                            {getSubcategoryProductCount(sub.id)} products
                                        </span>

                                        <div className="action-btns">
                                            <button
                                                className="action-btn action-btn--edit"
                                                onClick={() => setEditingSubcategory({ id: sub.id, categoryId: sub.categoryId, name: sub.name, description: sub.description || '', imageUrl: sub.imageUrl || '' })}
                                                title="Edit"
                                                style={{ width: '30px', height: '30px' }}
                                            >
                                                <Edit size={14} />
                                            </button>
                                            <button
                                                className="action-btn action-btn--delete"
                                                onClick={() => handleDeleteSubcategory(sub.id, sub.name)}
                                                title="Delete"
                                                style={{ width: '30px', height: '30px' }}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Edit Category Modal */}
            {editingCategory && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 1000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div
                        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
                        onClick={() => setEditingCategory(null)}
                    />
                    <div style={{
                        position: 'relative', background: 'var(--bg-secondary, #1a1a2e)',
                        borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '480px',
                        border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
                    }}>
                        <h3 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                            Edit Category
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.3rem', display: 'block' }}>Name</label>
                                <input
                                    type="text"
                                    value={editingCategory.name}
                                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                                    placeholder="Category name"
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.3rem', display: 'block' }}>Description</label>
                                <input
                                    type="text"
                                    value={editingCategory.description}
                                    onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                                    placeholder="Description (optional)"
                                />
                            </div>
                            <div>
                                <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>Image</label>
                                <input
                                    type="file"
                                    ref={editCatImageRef}
                                    accept=".jpg,.jpeg,.png,.webp"
                                    style={{ display: 'none' }}
                                    onChange={(e) => handleImageUpload(e.target.files[0], setEditingCategory, editingCategory)}
                                />
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    {editingCategory.imageUrl ? (
                                        <ImagePreview
                                            imageUrl={editingCategory.imageUrl}
                                            onRemove={() => setEditingCategory({ ...editingCategory, imageUrl: '' })}
                                            size={60}
                                        />
                                    ) : null}
                                    <UploadButton inputRef={editCatImageRef} uploading={uploading} />
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                            <button className="btn btn-secondary" onClick={() => setEditingCategory(null)}>
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={() => {
                                    updateCategory(editingCategory.id, {
                                        name: editingCategory.name,
                                        description: editingCategory.description,
                                        imageUrl: editingCategory.imageUrl
                                    });
                                    setEditingCategory(null);
                                }}
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Subcategory Modal */}
            {editingSubcategory && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 1000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div
                        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
                        onClick={() => setEditingSubcategory(null)}
                    />
                    <div style={{
                        position: 'relative', background: 'var(--bg-secondary, #1a1a2e)',
                        borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '480px',
                        border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
                    }}>
                        <h3 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                            Edit Subcategory
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.3rem', display: 'block' }}>Name</label>
                                <input
                                    type="text"
                                    value={editingSubcategory.name}
                                    onChange={(e) => setEditingSubcategory({ ...editingSubcategory, name: e.target.value })}
                                    placeholder="Subcategory name"
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.3rem', display: 'block' }}>Description</label>
                                <input
                                    type="text"
                                    value={editingSubcategory.description}
                                    onChange={(e) => setEditingSubcategory({ ...editingSubcategory, description: e.target.value })}
                                    placeholder="Description (optional)"
                                />
                            </div>
                            <div>
                                <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>Image</label>
                                <input
                                    type="file"
                                    ref={editSubImageRef}
                                    accept=".jpg,.jpeg,.png,.webp"
                                    style={{ display: 'none' }}
                                    onChange={(e) => handleImageUpload(e.target.files[0], setEditingSubcategory, editingSubcategory)}
                                />
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    {editingSubcategory.imageUrl ? (
                                        <ImagePreview
                                            imageUrl={editingSubcategory.imageUrl}
                                            onRemove={() => setEditingSubcategory({ ...editingSubcategory, imageUrl: '' })}
                                            size={60}
                                        />
                                    ) : null}
                                    <UploadButton inputRef={editSubImageRef} uploading={uploading} />
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                            <button className="btn btn-secondary" onClick={() => setEditingSubcategory(null)}>
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={() => {
                                    updateSubcategory(editingSubcategory.id, {
                                        name: editingSubcategory.name,
                                        description: editingSubcategory.description,
                                        imageUrl: editingSubcategory.imageUrl,
                                        categoryId: editingSubcategory.categoryId
                                    });
                                    setEditingSubcategory(null);
                                }}
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryManager;
