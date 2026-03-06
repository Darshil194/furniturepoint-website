import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const API_BASE_URL = 'https://furniturepoint-website.onrender.com'
const PLACEHOLDER_IMAGE = '/images/category-placeholder.jpg'

// Generate URL-friendly slug from name (fallback when API data lacks slug field)
const toSlug = (name) => {
    if (!name) return ''
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

// Gradient backgrounds for category cards when no image is available
const cardGradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)',
    'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
    'linear-gradient(135deg, #f5576c 0%, #ff7e5f 100%)',
    'linear-gradient(135deg, #667eea 0%, #ee609c 100%)',
    'linear-gradient(135deg, #c3cfe2 0%, #f5f7fa 100%)',
]

// Icon patterns for category cards
const getCategoryIcon = (name) => {
    const lower = name.toLowerCase()
    if (lower.includes('sofa') || lower.includes('couch')) return '🛋️'
    if (lower.includes('chair')) return '🪑'
    if (lower.includes('table') && lower.includes('coffee')) return '☕'
    if (lower.includes('table') && lower.includes('dining')) return '🍽️'
    if (lower.includes('table') || lower.includes('desk')) return '🗂️'
    if (lower.includes('bed')) return '🛏️'
    if (lower.includes('dresser')) return '🗄️'
    if (lower.includes('shelf') || lower.includes('bookshel')) return '📚'
    if (lower.includes('cabinet')) return '🗃️'
    return '🪑'
}

function CategoryCards({ subcategories, categorySlug, productCounts }) {
    return (
        <div className="category-cards">
            <div className="category-cards__grid">
                {subcategories.map((sub, index) => (
                    <motion.div
                        key={sub.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.08 }}
                    >
                        <Link
                            to={`/furniture/${categorySlug}/${sub.slug || toSlug(sub.name)}`}
                            className="category-card"
                        >
                            <div
                                className="category-card__image"
                                style={sub.imageUrl
                                    ? { background: '#f5f5f5' }
                                    : { background: cardGradients[index % cardGradients.length] }
                                }
                            >
                                {sub.imageUrl ? (
                                    <img
                                        src={sub.imageUrl.startsWith('http') ? sub.imageUrl : `${API_BASE_URL}${sub.imageUrl}`}
                                        alt={sub.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
                                    />
                                ) : (
                                    <span className="category-card__icon">
                                        {getCategoryIcon(sub.name)}
                                    </span>
                                )}
                            </div>
                            <div className="category-card__content">
                                <h3 className="category-card__title">{sub.name}</h3>
                                <div className="category-card__footer">
                                    <span className="category-card__count">
                                        {productCounts[sub.id] || 0} Products
                                    </span>
                                    <ArrowRight size={16} className="category-card__arrow" />
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

export default CategoryCards
