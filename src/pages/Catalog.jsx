import { useState, useMemo, useEffect, useRef } from 'react'
import { Filter, Grid3X3, LayoutGrid, Search, SlidersHorizontal, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../store/useStore'
import ProductCard from '../components/ProductCard'
import './Catalog.css'

function Catalog() {
    const products = useStore(state => state.products)
    const categories = useStore(state => state.categories)

    const [selectedCategory, setSelectedCategory] = useState('all')
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
            // Show toolbar when scrolling up or at top, hide when scrolling down
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

    // Filter only active products for public catalog
    const activeProducts = useMemo(() => {
        return products.filter(p => p.status === 'active')
    }, [products])

    const filteredProducts = useMemo(() => {
        let result = [...activeProducts]

        // Category filter (using categoryId now)
        if (selectedCategory !== 'all') {
            result = result.filter(p => p.categoryId === parseInt(selectedCategory))
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
    }, [activeProducts, selectedCategory, searchQuery, sortBy])

    // Add "All" option to categories for filter
    const categoryOptions = [
        { id: 'all', name: 'All Furniture' },
        ...categories
    ]

    return (
        <div className="catalog">
            {/* Hero Banner - Commented out for cleaner catalog layout
            <motion.div
                className="catalog__hero"
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
                        Our Collection
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                    >
                        Discover furniture that transforms spaces into sanctuaries
                    </motion.p>
                </div>
            </motion.div>
            */}

            {/* Toolbar */}
            <div className={`catalog__toolbar ${!toolbarVisible ? 'catalog__toolbar--hidden' : ''}`}>
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
            <div className="catalog__main section">
                <div className="container">
                    <div className="catalog__layout">
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
                                        <h3>Filters</h3>
                                        <button className="filters__close" onClick={() => setShowFilters(false)}>
                                            <X size={20} />
                                        </button>
                                    </div>

                                    {/* Categories */}
                                    <div className="filter-group">
                                        <h4>Categories</h4>
                                        <ul className="filter-list">
                                            {categoryOptions.map(category => (
                                                <li key={category.id}>
                                                    <button
                                                        className={selectedCategory === category.id.toString() ? 'active' : ''}
                                                        onClick={() => setSelectedCategory(category.id.toString())}
                                                    >
                                                        {category.name}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Clear Filters */}
                                    <button
                                        className="btn btn-outline filters__clear"
                                        onClick={() => {
                                            setSelectedCategory('all')
                                            setSearchQuery('')
                                        }}
                                    >
                                        Clear All Filters
                                    </button>
                                </motion.aside>
                            )}
                        </AnimatePresence>

                        {/* Products Grid */}
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

export default Catalog
