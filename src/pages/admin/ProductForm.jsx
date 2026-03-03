import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, X, ImagePlus } from 'lucide-react';
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

    useEffect(() => {
        if (isEditing && id) {
            const product = getProductById(parseInt(id));
            if (product) {
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

    const filteredSubcategories = subcategories.filter(
        s => s.categoryId === parseInt(formData.categoryId)
    );

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

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleCategoryChange = (e) => {
        const categoryId = e.target.value;
        setFormData(prev => ({
            ...prev,
            categoryId,
            subcategoryIds: []
        }));
    };

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

    const handleAddImageRaw = (url) => {
        setFormData(prev => ({
            ...prev,
            images: [...prev.images, { url, isPrimary: prev.images.length === 0 }]
        }));
    };

    const handleAddImage = () => {
        if (!imageUrl.trim()) return;
        handleAddImageRaw(imageUrl);
        setImageUrl('');
    };

    const handleRemoveImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

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
            <div className="admin-header">
                <div className="admin-header__title">
                    <Link to="/admin/products">
                        <ArrowLeft size={18} /> Back to Products
                    </Link>
                    <h1>{isEditing ? 'Edit Product' : 'Add New Product'}</h1>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="admin-form">

                {/* IMAGE UPLOAD FIXED */}
                <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;

                        const uploadData = new FormData();
                        uploadData.append('image', file);

                        try {
                            const res = await fetch('/api/upload', {
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
                />

                {formData.images.map((img, index) => (
                    <img
                        key={index}
                        src={img.url}
                        alt=""
                    />
                ))}

                <button type="submit" className="btn btn-primary">
                    <Save size={18} />
                    {isEditing ? 'Update Product' : 'Create Product'}
                </button>
            </form>
        </div>
    );
};

export default ProductForm;