import { useState, useMemo, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Filter, Grid3X3, LayoutGrid, Search, SlidersHorizontal, X, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../store/useStore'
import ProductCard from '../components/ProductCard'
import CategoryCards from '../components/CategoryCards'
import Breadcrumb from '../components/Breadcrumb'
import './FurniturePage.css'

// Generate URL-friendly slug from name (fallback when API data lacks slug field)
const toSlug = (name) => {
    if (!name) return ''
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function FurniturePage() {
    const { categorySlug, subSlug } = useParams()

    const products = useStore(state => state.products)
    const categories = useStore(state => state.categories)
    const subcategories = useStore(state => state.subcategories)

    const [sortBy, setSortBy] = useState('featured')
    const [searchQuery, setSearchQuery] = useState('')
    const [viewMode, setViewMode] = useState('grid')
    const [showFilters, setShowFilters] = useState(false)
    const [toolbarVisible, setToolbarVisible] = useState(true)

    // Scroll detection for hiding toolbar
    const lastScrollY = useRef(0)
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY
            if (currentScrollY < 100) {
                setToolbarVisible(true)
            } else if (currentScrollY < lastScrollY.current) {
                setToolbarVisible(true)
            } else if (currentScrollY > lastScrollY.current + 5) {
                setToolbarVisible(false)
            }
            lastScrollY.current = currentScrollY
        }
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Resolve current category and subcategory from URL slugs
    const currentCategory = useMemo(() => {
        if (!categorySlug) return null
        return categories.find(c => (c.slug || toSlug(c.name)) === categorySlug) || null
    }, [categorySlug, categories])

    const currentSubcategory = useMemo(() => {
        if (!subSlug || !currentCategory) return null
        return subcategories.find(
            s => (s.slug || toSlug(s.name)) === subSlug && s.categoryId === currentCategory.id
        ) || null
    }, [subSlug, currentCategory, subcategories])

    // Get subcategories for current category
    const categorySubcategories = useMemo(() => {
        if (!currentCategory) return []
        return subcategories.filter(s => s.categoryId === currentCategory.id)
    }, [currentCategory, subcategories])

    // Determine view mode: 'allProducts' | 'subcategoryCards' | 'filteredProducts'
    const pageMode = useMemo(() => {
        if (!categorySlug) return 'allProducts'
        if (categorySlug && !subSlug) return 'subcategoryCards'
        return 'filteredProducts'
    }, [categorySlug, subSlug])

    // Filter only active products for public display
    const activeProducts = useMemo(() => {
        return products.filter(p => p.status === 'active')
    }, [products])

    // Product counts per subcategory (for cards)
    const productCounts = useMemo(() => {
        const counts = {}
        activeProducts.forEach(p => {
            if (p.subcategoryId) {
                counts[p.subcategoryId] = (counts[p.subcategoryId] || 0) + 1
            }
        })
        return counts
    }, [activeProducts])

    // Filtered products based on current page mode
    const filteredProducts = useMemo(() => {
        let result = [...activeProducts]

        if (pageMode === 'filteredProducts' && currentSubcategory) {
            result = result.filter(p => p.subcategoryId === currentSubcategory.id)
        } else if (pageMode === 'subcategoryCards') {
            // No products shown in card mode
            return []
        }

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            result = result.filter(p =>
                p.name.toLowerCase().includes(query) ||
                p.description.toLowerCase().includes(query)
            )
        }

        // Sort
        switch (sortBy) {
            case 'newest':
                result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                break
            default:
                result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
        }

        return result
    }, [activeProducts, pageMode, currentSubcategory, searchQuery, sortBy])

    // Build breadcrumb items
    const breadcrumbItems = useMemo(() => {
        const items = [{ label: 'All Furniture', to: '/furniture' }]

        if (currentCategory) {
            if (currentSubcategory) {
                items.push({
                    label: currentCategory.name,
                    to: `/furniture/${currentCategory.slug || toSlug(currentCategory.name)}`
                })
                items.push({ label: currentSubcategory.name })
            } else {
                items.push({ label: currentCategory.name })
            }
        }

        return items
    }, [currentCategory, currentSubcategory])

    // Page title
    const pageTitle = useMemo(() => {
        if (currentSubcategory) return currentSubcategory.name
        if (currentCategory) return currentCategory.name
        return 'Our Collection'
    }, [currentCategory, currentSubcategory])

    const pageDescription = useMemo(() => {
        if (currentSubcategory) return currentSubcategory.description
        if (currentCategory) return `Explore our ${currentCategory.name.toLowerCase()} collection`
        return 'Discover furniture that transforms spaces into sanctuaries'
    }, [currentCategory, currentSubcategory])

    return (
        <div className="furniture-page">
            {/* Hero Banner - Commented out for cleaner catalog layout
            <motion.div
                className="furniture-page__hero"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                <div className="container">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                    >
                        {pageTitle}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                    >
                        {pageDescription}
                    </motion.p>
                </div>
            </motion.div>
            */}

            {/* Breadcrumb */}
            <div className="furniture-page__breadcrumb">
                <div className="container">
                    <Breadcrumb items={breadcrumbItems} />
                </div>
            </div>

            {/* Toolbar - always visible */}
            <div className={`furniture-page__toolbar ${!toolbarVisible ? 'furniture-page__toolbar--hidden' : ''}`}>
                <div className="container">
                    <div className="toolbar__left">
                        <button
                            className="toolbar__filter-btn btn btn-outline"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <SlidersHorizontal size={18} />
                            Filters
                        </button>

                        <div className="toolbar__search">
                            <Search size={18} />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button onClick={() => setSearchQuery('')}>
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="toolbar__right">
                        <span className="toolbar__count">{filteredProducts.length} Products</span>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="toolbar__sort"
                        >
                            <option value="featured">Featured</option>
                            <option value="newest">Newest</option>
                        </select>

                        <div className="toolbar__view">
                            <button
                                className={viewMode === 'grid' ? 'active' : ''}
                                onClick={() => setViewMode('grid')}
                            >
                                <Grid3X3 size={18} />
                            </button>
                            <button
                                className={viewMode === 'list' ? 'active' : ''}
                                onClick={() => setViewMode('list')}
                            >
                                <LayoutGrid size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="furniture-page__main section">
                <div className="container">
                    <div className={`furniture-page__layout ${pageMode === 'subcategoryCards' ? 'furniture-page__layout--full' : ''}`}>
                        {/* Filters Sidebar */}
                        <AnimatePresence>
                            {(showFilters || window.innerWidth > 992) && (
                                <motion.aside
                                    className={`catalog__filters ${showFilters ? 'catalog__filters--open' : ''}`}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="filters__header">
                                        <h3>Categories</h3>
                                        <button className="filters__close" onClick={() => setShowFilters(false)}>
                                            <X size={20} />
                                        </button>
                                    </div>

                                    {/* Category list */}
                                    <div className="filter-group">
                                        <ul className="filter-list">
                                            <li>
                                                <Link
                                                    to="/furniture"
                                                    className={`filter-link ${!categorySlug ? 'active' : ''}`}
                                                >
                                                    All Furniture
                                                </Link>
                                            </li>
                                            {categories.map(category => (
                                                <li key={category.id}>
                                                    <Link
                                                        to={`/furniture/${category.slug || toSlug(category.name)}`}
                                                        className={`filter-link ${categorySlug === (category.slug || toSlug(category.name)) ? 'active' : ''}`}
                                                    >
                                                        {category.name}
                                                        <ChevronRight size={14} className="filter-link__chevron" />
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </motion.aside>
                            )}
                        </AnimatePresence>

                        {/* Right Content Area */}
                        <div className="furniture-page__content">
                            {/* Subcategory Cards View */}
                            {pageMode === 'subcategoryCards' && currentCategory && (
                                <motion.div
                                    key={`cards-${currentCategory.id}`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <div className="furniture-page__cards-header">
                                        <h2>Browse {currentCategory.name}</h2>
                                        <p>Select a category to explore products</p>
                                    </div>
                                    <CategoryCards
                                        subcategories={categorySubcategories}
                                        categorySlug={currentCategory.slug || toSlug(currentCategory.name)}
                                        productCounts={productCounts}
                                    />
                                </motion.div>
                            )}

                            {/* Products Grid View */}
                            {pageMode !== 'subcategoryCards' && (
                                <div className="catalog__products">
                                    {filteredProducts.length > 0 ? (
                                        <motion.div
                                            className={`products-grid ${viewMode === 'list' ? 'products-grid--list' : ''}`}
                                            layout
                                        >
                                            <AnimatePresence>
                                                {filteredProducts.map((product, index) => (
                                                    <motion.div
                                                        key={product.id}
                                                        layout
                                                        initial={{ opacity: 0, scale: 0.9 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.9 }}
                                                        transition={{ duration: 0.3 }}
                                                    >
                                                        <ProductCard product={product} index={index} />
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                        </motion.div>
                                    ) : (
                                        <div className="catalog__empty">
                                            <Filter size={48} />
                                            <h3>No products found</h3>
                                            <p>Try adjusting your filters or search terms</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Overlay for mobile filters */}
            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        className="catalog__overlay"
                        onClick={() => setShowFilters(false)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}

export default FurniturePage
