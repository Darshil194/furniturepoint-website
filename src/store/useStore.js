import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// ============================================
// LOOKUP TABLES (Normalized Reference Data)
// ============================================

const initialCategories = [
    { id: 1, name: 'Living Room', slug: 'living-room', description: 'Furniture for living spaces', imageUrl: '' },
    { id: 2, name: 'Dining Room', slug: 'dining-room', description: 'Dining tables and chairs', imageUrl: '' },
    { id: 3, name: 'Bedroom', slug: 'bedroom', description: 'Beds, dressers, and nightstands', imageUrl: '' },
    { id: 4, name: 'Office', slug: 'office', description: 'Home office furniture', imageUrl: '' },
    { id: 5, name: 'Storage', slug: 'storage', description: 'Shelves, cabinets, and organizers', imageUrl: '' }
]

const initialSubcategories = [
    { id: 1, categoryId: 1, name: 'Sofas', slug: 'sofas', description: 'Couches and loveseats', imageUrl: '' },
    { id: 2, categoryId: 1, name: 'Chairs', slug: 'chairs', description: 'Accent and armchairs', imageUrl: '' },
    { id: 3, categoryId: 1, name: 'Coffee Tables', slug: 'coffee-tables', description: 'Center tables', imageUrl: '' },
    { id: 4, categoryId: 2, name: 'Dining Tables', slug: 'dining-tables', description: 'Eating tables', imageUrl: '' },
    { id: 5, categoryId: 2, name: 'Dining Chairs', slug: 'dining-chairs', description: 'Seating for dining', imageUrl: '' },
    { id: 6, categoryId: 3, name: 'Beds', slug: 'beds', description: 'Bed frames and platforms', imageUrl: '' },
    { id: 7, categoryId: 3, name: 'Dressers', slug: 'dressers', description: 'Clothing storage', imageUrl: '' },
    { id: 8, categoryId: 4, name: 'Desks', slug: 'desks', description: 'Work surfaces', imageUrl: '' },
    { id: 9, categoryId: 4, name: 'Office Chairs', slug: 'office-chairs', description: 'Ergonomic seating', imageUrl: '' },
    { id: 10, categoryId: 5, name: 'Bookshelves', slug: 'bookshelves', description: 'Book storage', imageUrl: '' },
    { id: 11, categoryId: 5, name: 'Cabinets', slug: 'cabinets', description: 'Enclosed storage', imageUrl: '' }
]

const initialMaterials = [
    { id: 1, name: 'Velvet' },
    { id: 2, name: 'Leather' },
    { id: 3, name: 'Wood' },
    { id: 4, name: 'Metal' },
    { id: 5, name: 'Marble' },
    { id: 6, name: 'Glass' },
    { id: 7, name: 'Fabric' },
    { id: 8, name: 'Rattan' }
]

const initialColors = [
    { id: 1, name: 'Navy Blue', hex: '#1e3a5f' },
    { id: 2, name: 'Burnt Orange', hex: '#cc5500' },
    { id: 3, name: 'Walnut', hex: '#5d432c' },
    { id: 4, name: 'Cream White', hex: '#fffdd0' },
    { id: 5, name: 'Gold', hex: '#d4af37' },
    { id: 6, name: 'Black', hex: '#1a1a1a' },
    { id: 7, name: 'Gray', hex: '#808080' },
    { id: 8, name: 'Forest Green', hex: '#228b22' }
]

const initialStyles = [
    { id: 1, name: 'Modern' },
    { id: 2, name: 'Scandinavian' },
    { id: 3, name: 'Mid-Century' },
    { id: 4, name: 'Industrial' },
    { id: 5, name: 'Minimalist' },
    { id: 6, name: 'Bohemian' },
    { id: 7, name: 'Traditional' },
    { id: 8, name: 'Art Deco' }
]

// ============================================
// USERS & ROLES (Security System)
// ============================================

const ROLES = {
    ADMIN: 'admin',
    MANAGER: 'manager',
    STAFF: 'staff'
}

// Permission definitions
const PERMISSIONS = {
    VIEW_PRODUCTS: 'view_products',
    VIEW_PRICES: 'view_prices',
    EDIT_PRODUCTS: 'edit_products',
    DELETE_PRODUCTS: 'delete_products',
    MANAGE_CATEGORIES: 'manage_categories',
    VIEW_AUDIT_LOG: 'view_audit_log',
    MANAGE_USERS: 'manage_users',
    VIEW_DASHBOARD_STATS: 'view_dashboard_stats'
}

// Role-permission mapping
const ROLE_PERMISSIONS = {
    [ROLES.ADMIN]: Object.values(PERMISSIONS), // All permissions
    [ROLES.MANAGER]: [
        PERMISSIONS.VIEW_PRODUCTS,
        PERMISSIONS.VIEW_PRICES,
        PERMISSIONS.EDIT_PRODUCTS,
        PERMISSIONS.MANAGE_CATEGORIES,
        PERMISSIONS.VIEW_AUDIT_LOG,
        PERMISSIONS.VIEW_DASHBOARD_STATS
    ],
    [ROLES.STAFF]: [
        PERMISSIONS.VIEW_PRODUCTS,
        PERMISSIONS.VIEW_DASHBOARD_STATS
    ]
}

const initialUsers = [
    {
        id: 1,
        name: 'Admin User',
        email: 'admin@furniturepoint.com',
        password: 'admin123', // In production, this should be hashed
        role: ROLES.ADMIN,
        status: 'active',
        createdAt: '2024-01-01T00:00:00Z',
        lastLogin: null
    }
]

// ============================================
// PRODUCTS (Main Table - 3NF Compliant)
// ============================================

const initialProducts = [
    {
        id: 1,
        sku: 'FP-SOFA-001',
        name: 'Velvet Navy Sofa',
        slug: 'velvet-navy-sofa',
        description: 'Luxurious mid-century modern velvet sofa in deep navy blue with elegant gold metal legs. Perfect for contemporary living spaces.',
        categoryId: 1,
        subcategoryId: 1,
        price: 2499,
        discountPrice: 2299,
        stockQuantity: 15,
        availabilityStatus: 'in_stock',
        materialId: 1,
        colorId: 1,
        styleId: 3,
        dimensions: { length: 220, width: 95, height: 85 },
        weightKg: 45,
        assemblyRequired: false,
        images: [{ url: '/images/sofa_navy_1769266772936.png', isPrimary: true }],
        rating: 4.9,
        reviews: 124,
        featured: true,
        tags: ['bestseller', 'luxury'],
        technicalSpecs: [
            { label: "Frame Material", value: "Kiln-Dried Hardwood" },
            { label: "Upholstery", value: "Premium Velvet Fabric" },
            { label: "Leg Finish", value: "Brushed Gold Plating" },
            { label: "Seat Cushion", value: "High-Density Foam" }
        ],
        features: [
            "Stain-resistant velvet fabric",
            "Hand-tufted detailing",
            "Ergonomic back support",
            "Reinforced joinery"
        ],
        status: 'active',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
    },
    {
        id: 2,
        sku: 'FP-DINING-001',
        name: 'Scandinavian Dining Set',
        slug: 'scandinavian-dining-set',
        description: 'Elegant solid oak dining table with natural grain finish, accompanied by 6 modern chairs with cream upholstery.',
        categoryId: 2,
        subcategoryId: 4,
        price: 3299,
        discountPrice: 2999,
        stockQuantity: 8,
        availabilityStatus: 'in_stock',
        materialId: 3,
        colorId: 3,
        styleId: 2,
        dimensions: { length: 180, width: 90, height: 75 },
        weightKg: 65,
        assemblyRequired: true,
        images: [{ url: '/images/dining_table_1769266790055.png', isPrimary: true }],
        rating: 4.8,
        reviews: 89,
        featured: true,
        tags: ['new', 'eco-friendly'],
        technicalSpecs: [
            { label: "Table Top", value: "Solid White Oak" },
            { label: "Chair Fabric", value: "Linen Blend" },
            { label: "Seating Capacity", value: "6 Persons" },
            { label: "Finish", value: "Matte Lacquer" }
        ],
        features: [
            "Sustainably sourced wood",
            "Scratch-resistant finish",
            "Easy-clean upholstery",
            "Compact footprint design"
        ],
        status: 'active',
        createdAt: '2024-01-20T10:00:00Z',
        updatedAt: '2024-01-20T10:00:00Z'
    },
    {
        id: 3,
        sku: 'FP-CHAIR-001',
        name: 'Sculptural Accent Chair',
        slug: 'sculptural-accent-chair',
        description: 'Modern luxury accent armchair in burnt orange velvet with sculptural curved design and stunning brass metal base.',
        categoryId: 1,
        subcategoryId: 2,
        price: 1299,
        discountPrice: 1099,
        stockQuantity: 12,
        availabilityStatus: 'in_stock',
        materialId: 1,
        colorId: 2,
        styleId: 1,
        dimensions: { length: 75, width: 70, height: 85 },
        weightKg: 18,
        assemblyRequired: false,
        images: [{ url: '/images/armchair_orange_1769266807177.png', isPrimary: true }],
        rating: 4.7,
        reviews: 67,
        featured: true,
        tags: ['trending'],
        technicalSpecs: [
            { label: "Base Material", value: "Stainless Steel" },
            { label: "Weight Limit", value: "150 kg" },
            { label: "Swivel Mechanism", value: "360-degree Smooth Turn" }
        ],
        features: [
            "Statement sculptural design",
            "Deep seating comfort",
            "Luxe velvet texture",
            "No assembly required"
        ],
        status: 'active',
        createdAt: '2024-02-01T10:00:00Z',
        updatedAt: '2024-02-01T10:00:00Z'
    },
    {
        id: 4,
        sku: 'FP-BED-001',
        name: 'Walnut Platform Bed',
        slug: 'walnut-platform-bed',
        description: 'Luxurious king size platform bed with dark walnut wood frame and cream white tufted linen headboard.',
        categoryId: 3,
        subcategoryId: 6,
        price: 2899,
        discountPrice: 2599,
        stockQuantity: 5,
        availabilityStatus: 'in_stock',
        materialId: 3,
        colorId: 3,
        styleId: 3,
        dimensions: { length: 220, width: 180, height: 120 },
        weightKg: 85,
        assemblyRequired: true,
        images: [{ url: '/images/bed_walnut_1769266824462.png', isPrimary: true }],
        rating: 4.9,
        reviews: 156,
        featured: true,
        tags: ['bestseller'],
        technicalSpecs: [
            { label: "Wood Type", value: "American Walnut" },
            { label: "Slat System", value: "Solid Pine" },
            { label: "Headboard Height", value: "120 cm" }
        ],
        features: [
            "Low profile platform design",
            "Integrated nightstands enabled",
            "Silent slat system (Squeak-free)",
            "Tufted linen headboard"
        ],
        status: 'active',
        createdAt: '2024-02-10T10:00:00Z',
        updatedAt: '2024-02-10T10:00:00Z'
    },
    {
        id: 5,
        sku: 'FP-TABLE-001',
        name: 'Marble & Gold Coffee Table',
        slug: 'marble-gold-coffee-table',
        description: 'Stunning white Carrara marble top with geometric gold brass base. A statement piece for any living room.',
        categoryId: 1,
        subcategoryId: 3,
        price: 1899,
        discountPrice: 1699,
        stockQuantity: 10,
        availabilityStatus: 'in_stock',
        materialId: 5,
        colorId: 4,
        styleId: 8,
        dimensions: { length: 120, width: 60, height: 45 },
        weightKg: 35,
        assemblyRequired: false,
        images: [{ url: '/images/coffee_table_marble_1769266843304.png', isPrimary: true }],
        rating: 4.8,
        reviews: 92,
        featured: false,
        tags: ['luxury', 'trending'],
        technicalSpecs: [
            { label: "Top Material", value: "Italian Carrara Marble" },
            { label: "Base Finish", value: "Polished Gold" },
            { label: "Marble Thickness", value: "20 mm" }
        ],
        features: [
            "Unique natural veining",
            "Geometric architectural base",
            "Heat and stain resistant coating"
        ],
        status: 'active',
        createdAt: '2024-02-15T10:00:00Z',
        updatedAt: '2024-02-15T10:00:00Z'
    },
    {
        id: 6,
        sku: 'FP-SHELF-001',
        name: 'Industrial Bookshelf',
        slug: 'industrial-bookshelf',
        description: 'Elegant modern bookshelf with sleek black metal frame and warm walnut wood shelves. Industrial chic design.',
        categoryId: 5,
        subcategoryId: 10,
        price: 899,
        discountPrice: 799,
        stockQuantity: 20,
        availabilityStatus: 'in_stock',
        materialId: 4,
        colorId: 6,
        styleId: 4,
        dimensions: { length: 100, width: 35, height: 180 },
        weightKg: 28,
        assemblyRequired: true,
        images: [{ url: '/images/bookshelf_modern_1769266858656.png', isPrimary: true }],
        rating: 4.6,
        reviews: 45,
        featured: false,
        tags: ['new'],
        technicalSpecs: [
            { label: "Frame", value: "Powder Coated Steel" },
            { label: "Shelves", value: "Engineered Walnut Wood" },
            { label: "Shelf Capacity", value: "25 kg per shelf" }
        ],
        features: [
            "Open back design",
            "Anti-tip hardware included",
            "Modular expandability",
            "Adjustable leveling feet"
        ],
        status: 'active',
        createdAt: '2024-02-20T10:00:00Z',
        updatedAt: '2024-02-20T10:00:00Z'
    }
]

const initialPolicies = {
    privacy: {
        title: 'Privacy Policy',
        content: `
## 1. Information We Collect
We collect information you provide directly to us, such as when you create an account, make a purchase, or sign up for our newsletter. This may include your name, email address, shipping address, and payment information.

## 2. How We Use Your Information
We use the information we collect to:
- Process your orders and payments
- Communicate with you about your orders
- Send you marketing communications (if you opt in)
- Improve our website and customer service

## 3. Information Sharing
We do not share your personal information with third parties, except as necessary to process your orders (e.g., with shipping carriers and payment processors).
        `
    },
    terms: {
        title: 'Terms of Service',
        content: `
## 1. Acceptance of Terms
By accessing or using our website, you agree to be bound by these Terms of Service.

## 2. Use of Site
You may use our specific strictly for lawful purposes. You may not use our site in any way that violates applicable laws or regulations.

## 3. Product Descriptions
We attempt to be as accurate as possible. However, we do not warrant that product descriptions or other content of this site is accurate, complete, reliable, current, or error-free.
        `
    },
    shipping: {
        title: 'Shipping Information',
        content: `
## Shipping Rates
Standard shipping is free for all orders over ₹500. For orders under ₹500, a flat rate of ₹50 applies.

## Delivery Times
- **Standard Shipping**: 5-7 business days
- **Express Shipping**: 2-3 business days

## International Shipping
We currently ship to the US, Canada, and select European countries. International shipping rates vary by location.
        `
    },
    returns: {
        title: 'Returns & Refunds',
        content: `
## Return Policy
You have 30 days from the date of delivery to return your item. The item must be unused and in the same condition that you received it.

## Refund Process
Once we receive your item, we will inspect it and notify you that we have received your returned item. We will immediately notify you on the status of your refund after inspecting the item.
        `
    },
    faq: {
        title: 'Frequently Asked Questions',
        content: `
## Do you offer warranty?
Yes, all our furniture comes with a 1-year manufacturer warranty covering structural defects.

## Can I cancel my order?
You can cancel your order within 24 hours of placing it. After that, the order may have already been processed and shipped.
        `
    }
}

// ============================================
// ZUSTAND STORE
// ============================================

const useStore = create(
    persist(
        (set, get) => ({
            // ==================
            // LOOKUP TABLES
            // ==================
            categories: initialCategories,
            subcategories: initialSubcategories,
            materials: initialMaterials,
            colors: initialColors,
            styles: initialStyles,

            // ==================
            // POLICIES
            // ==================
            policies: initialPolicies,

            fetchAuxiliaryData: async () => {
                try {
                    const [mRes, cRes, sRes] = await Promise.all([
                        fetch('https://furniturepoint-website.onrender.com/api/materials'),
                        fetch('https://furniturepoint-website.onrender.com/api/colors'),
                        fetch('https://furniturepoint-website.onrender.com/api/styles')
                    ])
                    if (mRes.ok) set({ materials: await mRes.json() })
                    if (cRes.ok) set({ colors: await cRes.json() })
                    if (sRes.ok) set({ styles: await sRes.json() })
                } catch (error) {
                    console.error('Failed to fetch auxiliary data:', error)
                }
            },

            fetchPolicies: async () => {
                try {
                    const response = await fetch('https://furniturepoint-website.onrender.com/api/policies')
                    if (response.ok) {
                        const data = await response.json()
                        set({ policies: data })
                    }
                } catch (error) {
                    console.error('Failed to fetch policies:', error)
                }
            },

            updatePolicy: async (type, content) => {
                try {
                    const policy = get().policies[type]
                    const response = await fetch(`https://furniturepoint-website.onrender.com/api/policies/${type}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ title: policy?.title || type, content })
                    })
                    if (response.ok) {
                        set(state => ({
                            policies: {
                                ...state.policies,
                                [type]: {
                                    ...state.policies[type],
                                    content
                                }
                            }
                        }))
                        get().addAuditLogEntry('update', 'policy', type, `Updated ${type} policy`)
                    }
                } catch (error) {
                    console.error('Failed to update policy:', error)
                    // Fallback to local update
                    set(state => ({
                        policies: {
                            ...state.policies,
                            [type]: { ...state.policies[type], content }
                        }
                    }))
                }
            },


            // ==================
            // PRODUCTS
            // ==================
            products: initialProducts,

            // Product CRUD
            fetchProducts: async () => {
                try {
                    const response = await fetch('https://furniturepoint-website.onrender.com/api/products')
                    if (response.ok) {
                        const data = await response.json()
                        set({ products: data })
                    }
                } catch (error) {
                    console.error('Failed to fetch products:', error)
                }
            },

            addProduct: async (productData) => {
                try {
                    const response = await fetch('https://furniturepoint-website.onrender.com/api/products', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(productData)
                    })
                    if (response.ok) {
                        // Refetch all products to get properly mapped data
                        await get().fetchProducts()
                        get().addAuditLogEntry('create', 'product', null, `Created product: ${productData.name}`)
                        return true
                    }
                } catch (error) {
                    console.error('Failed to add product:', error)
                }
                return false
            },

            updateProduct: async (productId, updates) => {
                try {
                    const currentProduct = get().products.find(p => p.id === productId)
                    const updatedProduct = { ...currentProduct, ...updates }

                    const response = await fetch(`https://furniturepoint-website.onrender.com/api/products/${productId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(updatedProduct)
                    })
                    if (response.ok) {
                        // Refetch to get properly mapped data
                        await get().fetchProducts()
                        get().addAuditLogEntry('update', 'product', productId, `Updated product: ${updates.name || currentProduct?.name}`)
                        return true
                    }
                } catch (error) {
                    console.error('Failed to update product:', error)
                }
                return false
            },

            deleteProduct: async (productId) => {
                try {
                    const product = get().products.find(p => p.id === productId)
                    const response = await fetch(`https://furniturepoint-website.onrender.com/api/products/${productId}`, {
                        method: 'DELETE'
                    })
                    if (response.ok) {
                        set({ products: get().products.filter(p => p.id !== productId) })
                        get().addAuditLogEntry('delete', 'product', productId, `Deleted product: ${product?.name}`)
                        return true
                    }
                } catch (error) {
                    console.error('Failed to delete product:', error)
                }
                return false
            },

            getProductById: (productId) => {
                return get().products.find(p => p.id === productId)
            },

            // Helper: Get product with resolved references
            getProductWithDetails: (productId) => {
                const product = get().products.find(p => p.id === productId)
                if (!product) return null

                return {
                    ...product,
                    category: get().categories.find(c => c.id === product.categoryId),
                    subcategory: get().subcategories.find(s => s.id === product.subcategoryId),
                    material: get().materials.find(m => m.id === product.materialId),
                    color: get().colors.find(c => c.id === product.colorId),
                    style: get().styles.find(s => s.id === product.styleId)
                }
            },

            // ==================
            // CATEGORY CRUD (API-connected)
            // ==================
            fetchCategories: async () => {
                try {
                    const response = await fetch('https://furniturepoint-website.onrender.com/api/categories')
                    if (response.ok) {
                        const data = await response.json()
                        set({ categories: data })
                    }
                } catch (error) {
                    console.error('Failed to fetch categories:', error)
                }
            },

            addCategory: async (categoryData) => {
                try {
                    const response = await fetch('https://furniturepoint-website.onrender.com/api/categories', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(categoryData)
                    })
                    if (response.ok) {
                        await get().fetchCategories()
                        get().addAuditLogEntry('create', 'category', null, `Created category: ${categoryData.name}`)
                        return true
                    }
                } catch (error) {
                    console.error('Failed to add category:', error)
                }
                return false
            },

            updateCategory: async (categoryId, updates) => {
                try {
                    const response = await fetch(`https://furniturepoint-website.onrender.com/api/categories/${categoryId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(updates)
                    })
                    if (response.ok) {
                        await get().fetchCategories()
                        get().addAuditLogEntry('update', 'category', categoryId, `Updated category: ${updates.name}`)
                        return true
                    }
                } catch (error) {
                    console.error('Failed to update category:', error)
                }
                return false
            },

            deleteCategory: async (categoryId) => {
                try {
                    const response = await fetch(`https://furniturepoint-website.onrender.com/api/categories/${categoryId}`, {
                        method: 'DELETE'
                    })
                    if (response.ok) {
                        await get().fetchCategories()
                        get().addAuditLogEntry('delete', 'category', categoryId, `Deleted category ID: ${categoryId}`)
                        return true
                    }
                } catch (error) {
                    console.error('Failed to delete category:', error)
                }
                return false
            },

            // ==================
            // SUBCATEGORY CRUD (API-connected)
            // ==================
            fetchSubcategories: async () => {
                try {
                    const response = await fetch('https://furniturepoint-website.onrender.com/api/subcategories')
                    if (response.ok) {
                        const data = await response.json()
                        set({ subcategories: data })
                    }
                } catch (error) {
                    console.error('Failed to fetch subcategories:', error)
                }
            },

            addSubcategory: async (subcategoryData) => {
                try {
                    const response = await fetch('https://furniturepoint-website.onrender.com/api/subcategories', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(subcategoryData)
                    })
                    if (response.ok) {
                        await get().fetchSubcategories()
                        get().addAuditLogEntry('create', 'subcategory', null, `Created subcategory: ${subcategoryData.name}`)
                        return true
                    }
                } catch (error) {
                    console.error('Failed to add subcategory:', error)
                }
                return false
            },

            updateSubcategory: async (subcategoryId, updates) => {
                try {
                    const currentSub = get().subcategories.find(s => s.id === subcategoryId)
                    const response = await fetch(`https://furniturepoint-website.onrender.com/api/subcategories/${subcategoryId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ ...currentSub, ...updates })
                    })
                    if (response.ok) {
                        await get().fetchSubcategories()
                        get().addAuditLogEntry('update', 'subcategory', subcategoryId, `Updated subcategory: ${updates.name}`)
                        return true
                    }
                } catch (error) {
                    console.error('Failed to update subcategory:', error)
                }
                return false
            },

            deleteSubcategory: async (subcategoryId) => {
                try {
                    const response = await fetch(`https://furniturepoint-website.onrender.com/api/subcategories/${subcategoryId}`, {
                        method: 'DELETE'
                    })
                    if (response.ok) {
                        await get().fetchSubcategories()
                        get().addAuditLogEntry('delete', 'subcategory', subcategoryId, `Deleted subcategory ID: ${subcategoryId}`)
                        return true
                    }
                } catch (error) {
                    console.error('Failed to delete subcategory:', error)
                }
                return false
            },

            // ==================
            // EXTENDED LOOKUP CRUD (API-connected)
            // ==================
            addMaterial: async (materialName) => {
                try {
                    const response = await fetch('https://furniturepoint-website.onrender.com/api/materials', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name: materialName })
                    })
                    if (response.ok) {
                        const newMaterial = await response.json()
                        set({ materials: [...get().materials, newMaterial] })
                        return newMaterial
                    }
                } catch (error) {
                    console.error('Failed to add material:', error)
                }
                const fallback = { id: Date.now(), name: materialName }
                set({ materials: [...get().materials, fallback] })
                return fallback
            },

            addColor: async (colorName) => {
                try {
                    const response = await fetch('https://furniturepoint-website.onrender.com/api/colors', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name: colorName, hex_code: '#000000' })
                    })
                    if (response.ok) {
                        const newColor = await response.json()
                        set({ colors: [...get().colors, newColor] })
                        return newColor
                    }
                } catch (error) {
                    console.error('Failed to add color:', error)
                }
                const fallback = { id: Date.now(), name: colorName, hex: '#000000' }
                set({ colors: [...get().colors, fallback] })
                return fallback
            },

            addStyle: async (styleName) => {
                try {
                    const response = await fetch('https://furniturepoint-website.onrender.com/api/styles', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name: styleName })
                    })
                    if (response.ok) {
                        const newStyle = await response.json()
                        set({ styles: [...get().styles, newStyle] })
                        return newStyle
                    }
                } catch (error) {
                    console.error('Failed to add style:', error)
                }
                const fallback = { id: Date.now(), name: styleName }
                set({ styles: [...get().styles, fallback] })
                return fallback
            },

            // ==================
            // AUDIT LOG
            // ==================
            auditLog: [],

            fetchAuditLogs: async () => {
                try {
                    const response = await fetch('https://furniturepoint-website.onrender.com/api/audit-logs')
                    if (response.ok) {
                        const data = await response.json()
                        set({ auditLog: data })
                    }
                } catch (error) {
                    console.error('Failed to fetch audit logs:', error)
                }
            },

            addAuditLog: (productId, action) => {
                // Client-side optimisic log (optional, or remove if relying on API)
                // For now, we'll keep it but typically we'd just refetch
                const adminUser = get().adminUser
                const product = get().products.find(p => p.id === productId)
                const newEntry = {
                    id: Date.now(),
                    productId,
                    productName: product?.name || 'Unknown',
                    adminId: adminUser?.id || 1,
                    adminName: adminUser?.name || 'Admin',
                    action,
                    timestamp: new Date().toISOString()
                }
                set({ auditLog: [newEntry, ...get().auditLog].slice(0, 100) })
            },



            // ==================
            // ADMIN AUTH & USERS
            // ==================
            users: initialUsers,
            isAdminLoggedIn: false,
            adminUser: null,

            // Login with user credentials
            loginAdmin: (email, password) => {
                const users = get().users
                const user = users.find(u =>
                    u.email.toLowerCase() === email.toLowerCase() &&
                    u.password === password &&
                    u.status === 'active'
                )

                if (user) {
                    const adminUserData = {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role
                    }
                    // Update last login
                    set({
                        users: users.map(u =>
                            u.id === user.id
                                ? { ...u, lastLogin: new Date().toISOString() }
                                : u
                        ),
                        isAdminLoggedIn: true,
                        adminUser: adminUserData
                    })
                    // Persist auth to sessionStorage
                    try {
                        sessionStorage.setItem('fp-admin-auth', JSON.stringify({ isAdminLoggedIn: true, adminUser: adminUserData }))
                    } catch (e) { /* ignore */ }
                    // Log the login
                    get().addAuditLogEntry('login', 'auth', null, `User logged in: ${user.email}`)
                    return true
                }
                return false
            },

            logoutAdmin: () => {
                const user = get().adminUser
                if (user) {
                    get().addAuditLogEntry('logout', 'auth', null, `User logged out: ${user.email}`)
                }
                set({ isAdminLoggedIn: false, adminUser: null })
                try {
                    sessionStorage.removeItem('fp-admin-auth')
                } catch (e) { /* ignore */ }
            },

            // Check if current user has a specific permission
            hasPermission: (permission) => {
                const adminUser = get().adminUser
                if (!adminUser) return false
                const rolePermissions = ROLE_PERMISSIONS[adminUser.role] || []
                return rolePermissions.includes(permission)
            },

            // Get all permissions for current user
            getCurrentUserPermissions: () => {
                const adminUser = get().adminUser
                if (!adminUser) return []
                return ROLE_PERMISSIONS[adminUser.role] || []
            },

            // ==================
            // USER MANAGEMENT
            // ==================
            addUser: (userData) => {
                const users = get().users
                // Check for duplicate email
                if (users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
                    return { success: false, error: 'Email already exists' }
                }

                const newUser = {
                    ...userData,
                    id: Date.now(),
                    status: 'active',
                    createdAt: new Date().toISOString(),
                    lastLogin: null
                }
                set({ users: [...users, newUser] })
                get().addAuditLogEntry('create', 'user', newUser.id, `Created user: ${newUser.email}`)
                return { success: true, user: newUser }
            },

            updateUser: (userId, updates) => {
                const users = get().users
                // Check for duplicate email if email is being changed
                if (updates.email) {
                    const existingUser = users.find(u =>
                        u.email.toLowerCase() === updates.email.toLowerCase() && u.id !== userId
                    )
                    if (existingUser) {
                        return { success: false, error: 'Email already exists' }
                    }
                }

                set({
                    users: users.map(u =>
                        u.id === userId ? { ...u, ...updates } : u
                    )
                })
                get().addAuditLogEntry('update', 'user', userId, `Updated user ID: ${userId}`)
                return { success: true }
            },

            toggleUserStatus: (userId) => {
                const users = get().users
                const user = users.find(u => u.id === userId)
                if (!user) return false

                // Prevent disabling yourself
                if (get().adminUser?.id === userId) {
                    return { success: false, error: 'Cannot disable your own account' }
                }

                const newStatus = user.status === 'active' ? 'inactive' : 'active'
                set({
                    users: users.map(u =>
                        u.id === userId ? { ...u, status: newStatus } : u
                    )
                })
                get().addAuditLogEntry('status_change', 'user', userId, `User ${user.email} ${newStatus}`)
                return { success: true }
            },

            deleteUser: (userId) => {
                const user = get().users.find(u => u.id === userId)
                if (!user) return false

                // Prevent deleting yourself
                if (get().adminUser?.id === userId) {
                    return { success: false, error: 'Cannot delete your own account' }
                }

                get().addAuditLogEntry('delete', 'user', userId, `Deleted user: ${user.email}`)
                set({ users: get().users.filter(u => u.id !== userId) })
                return { success: true }
            },

            // ==================
            // ENHANCED AUDIT LOG (Client-side events)
            // ==================
            addAuditLogEntry: (action, entityType, entityId, description) => {
                const adminUser = get().adminUser
                const newEntry = {
                    id: Date.now(),
                    userId: adminUser?.id || 'client',
                    userName: adminUser?.name || 'System',
                    userRole: adminUser?.role || 'system',
                    action,
                    entityType,
                    entityId,
                    description,
                    timestamp: new Date().toISOString()
                }
                // Optimistically add to top
                set({ auditLog: [newEntry, ...get().auditLog].slice(0, 200) })
            },

            // ==================
            // STATS (for dashboard)
            // ==================
            getStats: () => {
                const products = get().products
                const activeProducts = products.filter(p => p.status === 'active')
                const lowStock = products.filter(p => p.stockQuantity < 10)
                const outOfStock = products.filter(p => p.stockQuantity === 0 || p.availabilityStatus === 'out_of_stock')
                const totalValue = products.reduce((sum, p) => sum + (p.price * p.stockQuantity), 0)

                return {
                    totalProducts: products.length,
                    activeProducts: activeProducts.length,
                    totalCategories: get().categories.length,
                    lowStockCount: lowStock.length,
                    outOfStockCount: outOfStock.length,
                    totalInventoryValue: totalValue,
                    totalStock: products.reduce((sum, p) => sum + p.stockQuantity, 0),
                    totalUsers: get().users.length,
                    activeUsers: get().users.filter(u => u.status === 'active').length
                }
            },

            // ==================
            // INQUIRIES
            // ==================
            inquiries: [],

            fetchInquiries: async () => {
                try {
                    const response = await fetch('https://furniturepoint-website.onrender.com/api/inquiries')
                    if (response.ok) {
                        const data = await response.json()
                        set({ inquiries: data })
                    }
                } catch (error) {
                    console.error('Failed to fetch inquiries:', error)
                }
            },

            updateInquiryStatus: async (id, status) => {
                try {
                    const response = await fetch(`https://furniturepoint-website.onrender.com/api/inquiries/${id}/status`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ status })
                    })
                    if (response.ok) {
                        set({
                            inquiries: get().inquiries.map(inq =>
                                inq.id === id ? { ...inq, status } : inq
                            )
                        })
                    }
                } catch (error) {
                    console.error('Failed to update inquiry status:', error)
                }
            },

            deleteInquiry: async (id) => {
                try {
                    const response = await fetch(`https://furniturepoint-website.onrender.com/api/inquiries/${id}`, {
                        method: 'DELETE'
                    })
                    if (response.ok) {
                        set({ inquiries: get().inquiries.filter(inq => inq.id !== id) })
                    }
                } catch (error) {
                    console.error('Failed to delete inquiry:', error)
                }
            }
        }),
        {
            name: 'furniture-point-storage',
            partialize: (state) => ({
                products: state.products,
                categories: state.categories,
                subcategories: state.subcategories,
                policies: state.policies,
                users: state.users,
                auditLog: state.auditLog
            }),
            merge: (persistedState, currentState) => {
                // Strip auth fields from old localStorage data to prevent stale auth
                if (persistedState) {
                    delete persistedState.isAdminLoggedIn
                    delete persistedState.adminUser
                }
                return { ...currentState, ...persistedState }
            }
        }
    )
)

// Hydrate admin auth from sessionStorage on startup
try {
    const stored = sessionStorage.getItem('fp-admin-auth')
    if (stored) {
        const { isAdminLoggedIn, adminUser } = JSON.parse(stored)
        if (isAdminLoggedIn && adminUser) {
            useStore.setState({ isAdminLoggedIn, adminUser })
        }
    }
} catch (e) { /* ignore */ }

// Export constants for use in other components
export { ROLES, PERMISSIONS }
export default useStore
