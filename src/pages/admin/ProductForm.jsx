import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Upload, X, ImagePlus } from 'lucide-react';
import useStore from '../../store/useStore';
import EditableSelect from '../../components/common/EditableSelect';

const ProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);

    const {
        products,
        categories,
        subcategories,
        materials,
        colors,
        styles,
        addProduct,
        updateProduct,
        getProductById,
        addCategory,
        addSubcategory,
        addMaterial,
        addColor,
        addStyle
    } = useStore();

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        description: '',
        categoryId: '',
        subcategoryIds: [],
        price: '',
        discountPrice: '',
        stockQuantity: '',
        availabilityStatus: 'in_stock',
        materialId: '',
        colorId: '',
        styleId: '',
        dimensions: { length: '', width: '', height: '' },
        weightKg: '',
        assemblyRequired: false,
        featured: false,
        status: 'active',
        tags: [],
        images: []
    });

    const [errors, setErrors] = useState({});
    const [imageUrl, setImageUrl] = useState('');

    // Load product data if editing
    useEffect(() => {
        if (isEditing && id) {
            const product = getProductById(parseInt(id));
            if (product) {
                // Handle both old single subcategoryId and new subcategoryIds array
                let subcategoryIds = [];
                if (product.subcategoryIds && Array.isArray(product.subcategoryIds)) {
                    subcategoryIds = product.subcategoryIds;
                } else if (product.subcategoryId) {
                    subcategoryIds = [product.subcategoryId];
                }

                setFormData({
                    ...product,
                    categoryId: product.categoryId?.toString() || '',
                    subcategoryIds,
                    materialId: product.materialId?.toString() || '',
                    colorId: product.colorId?.toString() || '',
                    styleId: product.styleId?.toString() || '',
                    price: product.price?.toString() || '',
                    discountPrice: product.discountPrice?.toString() || '',
                    stockQuantity: product.stockQuantity?.toString() || '',
                    weightKg: product.weightKg?.toString() || '',
                    dimensions: {
                        length: product.dimensions?.length?.toString() || '',
                        width: product.dimensions?.width?.toString() || '',
                        height: product.dimensions?.height?.toString() || ''
                    }
                });
            }
        }
    }, [id, isEditing, getProductById]);

    // Filter subcategories based on selected category
    const filteredSubcategories = subcategories.filter(
        s => s.categoryId === parseInt(formData.categoryId)
    );

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name.startsWith('dimensions.')) {
            const dimKey = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                dimensions: { ...prev.dimensions, [dimKey]: value }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }

        // Clear error when field is edited
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    // Handle category change (reset subcategories)
    const handleCategoryChange = (e) => {
        const categoryId = e.target.value;
        setFormData(prev => ({
            ...prev,
            categoryId,
            subcategoryIds: []
        }));
    };

    // Handle subcategory checkbox toggle
    const handleSubcategoryToggle = (subcategoryId) => {
        setFormData(prev => {
            const current = prev.subcategoryIds || [];
            if (current.includes(subcategoryId)) {
                return { ...prev, subcategoryIds: current.filter(id => id !== subcategoryId) };
            } else {
                return { ...prev, subcategoryIds: [...current, subcategoryId] };
            }
        });
    };

    // Add image helper
    const handleAddImageRaw = (url) => {
        setFormData(prev => ({
            ...prev,
            images: [...prev.images, { url, isPrimary: prev.images.length === 0 }]
        }));
    };

    // Add image URL
    const handleAddImage = () => {
        if (!imageUrl.trim()) return;
        handleAddImageRaw(imageUrl);
        setImageUrl('');
    };

    // Remove image
    const handleRemoveImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.categoryId) newErrors.categoryId = 'Category is required';
        if (!formData.price || isNaN(formData.price)) newErrors.price = 'Valid price is required';
        if (!formData.stockQuantity || isNaN(formData.stockQuantity)) {
            newErrors.stockQuantity = 'Valid stock quantity is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const productData = {
            ...formData,
            categoryId: parseInt(formData.categoryId),
            subcategoryIds: formData.subcategoryIds || [],
            materialId: formData.materialId ? parseInt(formData.materialId) : null,
            colorId: formData.colorId ? parseInt(formData.colorId) : null,
            styleId: formData.styleId ? parseInt(formData.styleId) : null,
            price: parseFloat(formData.price),
            discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : null,
            stockQuantity: parseInt(formData.stockQuantity),
            weightKg: formData.weightKg ? parseFloat(formData.weightKg) : null,
            dimensions: {
                length: formData.dimensions.length ? parseFloat(formData.dimensions.length) : null,
                width: formData.dimensions.width ? parseFloat(formData.dimensions.width) : null,
                height: formData.dimensions.height ? parseFloat(formData.dimensions.height) : null
            }
        };

        if (isEditing) {
            updateProduct(parseInt(id), productData);
        } else {
            addProduct(productData);
        }

        navigate('/admin/products');
    };

    return (
        <div className="product-form-page">
            {/* Header */}
            <div className="admin-header">
                <div className="admin-header__title">
                    <Link
                        to="/admin/products"
                        style={{
                            color: 'var(--text-muted)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginBottom: '0.5rem',
                            fontSize: '0.9rem',
                            textDecoration: 'none'
                        }}
                    >
                        <ArrowLeft size={18} />
                        Back to Products
                    </Link>
                    <h1>{isEditing ? 'Edit Product' : 'Add New Product'}</h1>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="admin-form">
                {/* Basic Info */}
                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                        Basic Information
                    </h3>
                    <div className="form-row">
                        <div className="form-group" style={{ flex: 2 }}>
                            <label>Product Name *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter product name"
                                style={errors.name ? { borderColor: '#ef4444' } : {}}
                            />
                            {errors.name && <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>{errors.name}</span>}
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>SKU</label>
                            <input
                                type="text"
                                name="sku"
                                value={formData.sku}
                                onChange={handleChange}
                                placeholder="FP-XXX-001"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Enter product description..."
                        />
                    </div>
                </div>

                {/* Category & Classification */}
                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                        Classification
                    </h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Category *</label>
                            <EditableSelect
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={(e) => {
                                    // Handle both synthetic events from EditableSelect and native events
                                    const val = e.target ? e.target.value : e; // EditableSelect might pass just ID in synth event if not careful, but my implementation mimics event
                                    // Actually EditableSelect calls onChange(e) where e is synthetic { target: { value, name } } or real event
                                    // So handleCategoryChange expects 'e'
                                    handleCategoryChange(e);
                                }}
                                onAdd={(name) => addCategory({ name, description: '' })}
                                options={categories}
                                placeholder="Select Category"
                            />
                            {errors.categoryId && <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>{errors.categoryId}</span>}
                        </div>
                        <div className="form-group">
                            <label>Subcategories</label>
                            {!formData.categoryId ? (
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.5rem 0' }}>
                                    Select a category first to choose subcategories
                                </p>
                            ) : (
                                <>
                                    {/* Selected subcategories as removable pills */}
                                    {formData.subcategoryIds && formData.subcategoryIds.length > 0 && (
                                        <div style={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: '0.5rem',
                                            marginBottom: '0.75rem'
                                        }}>
                                            {formData.subcategoryIds.map(subId => {
                                                const sub = subcategories.find(s => s.id === subId);
                                                if (!sub) return null;
                                                return (
                                                    <span
                                                        key={subId}
                                                        style={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '0.4rem',
                                                            padding: '0.35rem 0.75rem',
                                                            background: 'var(--accent)',
                                                            color: '#0a0a0f',
                                                            borderRadius: '20px',
                                                            fontSize: '0.85rem',
                                                            fontWeight: 600
                                                        }}
                                                    >
                                                        {sub.name}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleSubcategoryToggle(subId)}
                                                            style={{
                                                                background: 'rgba(0, 0, 0, 0.2)',
                                                                border: 'none',
                                                                borderRadius: '50%',
                                                                width: '18px',
                                                                height: '18px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                cursor: 'pointer',
                                                                color: '#0a0a0f',
                                                                fontSize: '0.75rem',
                                                                fontWeight: 'bold'
                                                            }}
                                                        >
                                                            ×
                                                        </button>
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* Dropdown to add more subcategories */}
                                    <EditableSelect
                                        name="addSubcategory"
                                        value=""
                                        onChange={(e) => {
                                            const subId = parseInt(e.target.value);
                                            if (subId && !formData.subcategoryIds?.includes(subId)) {
                                                handleSubcategoryToggle(subId);
                                            }
                                        }}
                                        onAdd={(name) => {
                                            const newSub = addSubcategory({
                                                name,
                                                categoryId: parseInt(formData.categoryId),
                                                description: ''
                                            });
                                            if (newSub && newSub.id) {
                                                // Auto-select the newly created subcategory
                                                setTimeout(() => handleSubcategoryToggle(newSub.id), 0);
                                            }
                                            return newSub;
                                        }}
                                        options={filteredSubcategories.filter(s => !formData.subcategoryIds?.includes(s.id))}
                                        placeholder="Add subcategory..."
                                    />
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', margin: '0.5rem 0 0' }}>
                                        Select from dropdown or choose "Write your own" to add a new subcategory
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Material</label>
                            <EditableSelect
                                name="materialId"
                                value={formData.materialId}
                                onChange={handleChange}
                                onAdd={(name) => addMaterial(name)}
                                options={materials}
                                placeholder="Select Material"
                            />
                        </div>
                        <div className="form-group">
                            <label>Color</label>
                            <EditableSelect
                                name="colorId"
                                value={formData.colorId}
                                onChange={handleChange}
                                onAdd={(name) => addColor(name)}
                                options={colors}
                                placeholder="Select Color"
                            />
                        </div>
                        <div className="form-group">
                            <label>Style</label>
                            <EditableSelect
                                name="styleId"
                                value={formData.styleId}
                                onChange={handleChange}
                                onAdd={(name) => addStyle(name)}
                                options={styles}
                                placeholder="Select Style"
                            />
                        </div>
                    </div>
                </div>

                {/* Pricing & Stock */}
                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                        Pricing & Inventory
                    </h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Price (₹) *</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                style={errors.price ? { borderColor: '#ef4444' } : {}}
                            />
                            {errors.price && <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>{errors.price}</span>}
                        </div>
                        <div className="form-group">
                            <label>Discount Price (₹)</label>
                            <input
                                type="number"
                                name="discountPrice"
                                value={formData.discountPrice}
                                onChange={handleChange}
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                            />
                        </div>
                        <div className="form-group">
                            <label>Stock Quantity *</label>
                            <input
                                type="number"
                                name="stockQuantity"
                                value={formData.stockQuantity}
                                onChange={handleChange}
                                placeholder="0"
                                min="0"
                                style={errors.stockQuantity ? { borderColor: '#ef4444' } : {}}
                            />
                            {errors.stockQuantity && <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>{errors.stockQuantity}</span>}
                        </div>
                        <div className="form-group">
                            <label>Availability</label>
                            <select
                                name="availabilityStatus"
                                value={formData.availabilityStatus}
                                onChange={handleChange}
                            >
                                <option value="in_stock">In Stock</option>
                                <option value="out_of_stock">Out of Stock</option>
                                <option value="preorder">Pre-order</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Dimensions */}
                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                        Dimensions & Weight
                    </h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Length (cm)</label>
                            <input
                                type="number"
                                name="dimensions.length"
                                value={formData.dimensions.length}
                                onChange={handleChange}
                                placeholder="0"
                                min="0"
                            />
                        </div>
                        <div className="form-group">
                            <label>Width (cm)</label>
                            <input
                                type="number"
                                name="dimensions.width"
                                value={formData.dimensions.width}
                                onChange={handleChange}
                                placeholder="0"
                                min="0"
                            />
                        </div>
                        <div className="form-group">
                            <label>Height (cm)</label>
                            <input
                                type="number"
                                name="dimensions.height"
                                value={formData.dimensions.height}
                                onChange={handleChange}
                                placeholder="0"
                                min="0"
                            />
                        </div>
                        <div className="form-group">
                            <label>Weight (kg)</label>
                            <input
                                type="number"
                                name="weightKg"
                                value={formData.weightKg}
                                onChange={handleChange}
                                placeholder="0"
                                min="0"
                                step="0.1"
                            />
                        </div>
                    </div>
                </div>

                {/* Images */}
                {/* Images */}
                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                        Product Images
                    </h3>

                    <div className="image-upload-section" style={{
                        background: 'rgba(0, 0, 0, 0.2)',
                        border: '2px dashed rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        padding: '2rem',
                        textAlign: 'center',
                        transition: 'all 0.2s',
                        cursor: 'pointer'
                    }}>
                        <input
                            type="file"
                            accept="image/*"
                            id="image-upload"
                            onChange={async (e) => {
                                const file = e.target.files[0];
                                if (!file) return;

                                const uploadData = new FormData();
                                uploadData.append('image', file);

                                try {
                                    // Visual feedback (optional: add loading state)
                                    const res = await fetch('http://localhost:3000/api/upload', {
                                        method: 'POST',
                                        body: uploadData
                                    });
                                    const data = await res.json();

                                    if (data.url) {
                                        handleAddImageRaw(data.url);
                                    }
                                } catch (error) {
                                    console.error('Upload failed:', error);
                                    alert('Failed to upload image');
                                }
                            }}
                            style={{ display: 'none' }}
                        />
                        <label htmlFor="image-upload" style={{ cursor: 'pointer', display: 'block' }}>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                background: 'rgba(212, 175, 55, 0.1)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1rem',
                                color: 'var(--accent)'
                            }}>
                                <ImagePlus size={28} />
                            </div>
                            <p style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontWeight: 500 }}>
                                Click to upload image
                            </p>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                SVG, PNG, JPG or GIF (max. 5MB)
                            </p>
                        </label>
                    </div>

                    {/* Fallback URL Input */}
                    <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Or add via URL:</span>
                        <input
                            type="text"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder="https://..."
                            style={{
                                flex: 1,
                                padding: '0.5rem 1rem',
                                background: 'rgba(0, 0, 0, 0.2)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '8px',
                                color: 'var(--text-primary)',
                                fontSize: '0.9rem'
                            }}
                        />
                        <button
                            type="button"
                            onClick={handleAddImage}
                            className="btn btn-secondary"
                            style={{ padding: '0.5rem 1rem' }}
                        >
                            Add
                        </button>
                    </div>

                    {formData.images.length > 0 && (
                        <div className="image-preview" style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '1rem' }}>
                            {formData.images.map((img, index) => (
                                <div key={index} className="image-preview__item" style={{ aspectRatio: '1', borderRadius: '8px', overflow: 'hidden', position: 'relative', border: img.isPrimary ? '2px solid var(--accent)' : '1px solid rgba(255,255,255,0.1)' }}>
                                    <img
                                        src={img.url.startsWith('http') || img.url.startsWith('/') ? img.url : `http://localhost:3000${img.url}`}
                                        alt={`Product ${index}`}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index)}
                                        style={{
                                            position: 'absolute',
                                            top: '4px',
                                            right: '4px',
                                            background: 'rgba(0,0,0,0.6)',
                                            border: 'none',
                                            color: '#fff',
                                            width: '24px',
                                            height: '24px',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Status & Options */}
                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                        Status & Options
                    </h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Status</label>
                            <select name="status" value={formData.status} onChange={handleChange}>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="draft">Draft</option>
                            </select>
                        </div>
                        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '2rem', paddingTop: '1.5rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    name="assemblyRequired"
                                    checked={formData.assemblyRequired}
                                    onChange={handleChange}
                                    style={{ width: 'auto' }}
                                />
                                Assembly Required
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    name="featured"
                                    checked={formData.featured}
                                    onChange={handleChange}
                                    style={{ width: 'auto' }}
                                />
                                Featured Product
                            </label>
                        </div>
                    </div>
                </div>

                {/* Form Actions */}
                <div className="form-actions">
                    <Link to="/admin/products" className="btn btn-secondary">
                        Cancel
                    </Link>
                    <button type="submit" className="btn btn-primary">
                        <Save size={18} />
                        {isEditing ? 'Update Product' : 'Create Product'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;
