import { useState } from 'react'
import { Eye } from 'lucide-react'
import useStore from '../store/useStore'
import QuickViewModal from './QuickViewModal'
import './ProductCard.css'

// Helper to extract image URL from various formats
const getImageUrl = (images) => {
    if (!images || images.length === 0) return '/placeholder.png'
    const firstImage = images[0]
    // Handle object format: {url: '...'} or {url: '...', isPrimary: true}
    if (typeof firstImage === 'object' && firstImage.url) return firstImage.url
    // Handle plain string format
    if (typeof firstImage === 'string') return firstImage
    return '/placeholder.png'
}

function ProductCard({ product, index = 0 }) {
    const [isHovered, setIsHovered] = useState(false)
    const [showQuickView, setShowQuickView] = useState(false)

    // Store actions
    const categories = useStore(state => state.categories)

    // Get category name from ID
    const categoryName = categories.find(c => c.id === product.categoryId)?.name || ''

    // Get primary image URL (handles both formats)
    const imageUrl = getImageUrl(product.images) || product.image || '/placeholder.png'

    return (
        <>
            <article
                className="product-card animate-fadeInUp"
                style={{ animationDelay: `${index * 100}ms`, cursor: 'pointer' }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => setShowQuickView(true)}
            >
                {/* Image Container */}
                <div className="product-card__image">
                    <img src={imageUrl} alt={product.name} loading="lazy" />

                    {/* Badges */}
                    <div className="product-card__badges">
                        {product.tags?.includes('new') && (
                            <span className="badge badge--new">New</span>
                        )}
                        {product.tags?.includes('bestseller') && (
                            <span className="badge badge--bestseller">Bestseller</span>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="product-card__content">
                    <span className="product-card__category">{categoryName}</span>
                    <h3 className="product-card__title">{product.name}</h3>
                </div>
            </article>

            {/* Quick View Modal */}
            <QuickViewModal
                product={product}
                isOpen={showQuickView}
                onClose={() => setShowQuickView(false)}
            />
        </>
    )
}

export default ProductCard
