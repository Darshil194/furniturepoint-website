import { useRef, useEffect } from 'react'
import { X, FileText, CheckCircle2, ChevronRight, Mail } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../store/useStore'
import './QuickViewModal.css'

// Helper to normalize images
const normalizeImages = (images) => {
    if (!images || images.length === 0) return [{ url: '/placeholder.png' }]
    return images.map(img => {
        if (typeof img === 'string') return { url: img }
        if (typeof img === 'object' && img.url) return img
        return { url: '/placeholder.png' }
    })
}

function QuickViewModal({ product, isOpen, onClose }) {
    const categories = useStore(state => state.categories)

    if (!product) return null

    const categoryName = categories.find(c => c.id === product.categoryId)?.name || ''
    const images = normalizeImages(product.images)
    const mainImage = images[0]?.url

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="spec-modal-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        className="spec-modal"
                        initial={{ opacity: 0, x: '100%' }} // Desktop: Slide in from right? or Center? User asked for Centered OR Slide-in. Let's do Center for now as it's cleaner for specs.
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        style={{ x: 0 }} // Override initial for center if using center class
                    >
                        <button className="spec-modal-close" onClick={onClose}>
                            <X size={24} />
                        </button>

                        <div className="spec-modal-grid">
                            {/* Left: Image Side */}
                            <div className="spec-modal-image">
                                <img src={mainImage} alt={product.name} />
                                <div className="spec-modal-image-overlay">
                                    <span className="spec-badge">Industrial Grade</span>
                                </div>
                            </div>

                            {/* Right: Content Side */}
                            <div className="spec-modal-content">
                                <div className="spec-header">
                                    <span className="spec-category">{categoryName}</span>
                                    <h2>{product.name}</h2>
                                    <div className="spec-meta">
                                        <span className="spec-sku">SKU: {product.sku}</span>
                                        {product.stockQuantity > 0 ? (
                                            <span className="spec-stock in-stock">In Stock</span>
                                        ) : (
                                            <span className="spec-stock out-of-stock">Backorder</span>
                                        )}
                                    </div>
                                    <p className="spec-description">{product.description}</p>
                                </div>

                                <div className="spec-divider"></div>

                                {/* Technical Specs via Dynamic Fields */}
                                {product.technicalSpecs && product.technicalSpecs.length > 0 && (
                                    <div className="spec-section">
                                        <h3><FileText size={18} /> Technical Specifications</h3>
                                        <div className="spec-table">
                                            {product.technicalSpecs.map((spec, idx) => (
                                                <div key={idx} className="spec-row">
                                                    <span className="spec-label">{spec.label}</span>
                                                    <span className="spec-value">{spec.value}</span>
                                                </div>
                                            ))}
                                            {/* Fallback dimensions if no dynamic specs but dimensions exist */}
                                            {product.dimensions && !product.technicalSpecs.some(s => s.label === 'Dimensions') && (
                                                <div className="spec-row">
                                                    <span className="spec-label">Dimensions (cm)</span>
                                                    <span className="spec-value">
                                                        {product.dimensions.length}L x {product.dimensions.width}W x {product.dimensions.height}H
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Key Features */}
                                {product.features && product.features.length > 0 && (
                                    <div className="spec-section">
                                        <h3><CheckCircle2 size={18} /> Key Features</h3>
                                        <ul className="spec-list">
                                            {product.features.map((feature, idx) => (
                                                <li key={idx}>{feature}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div className="spec-actions">
                                    <a href="/contact" className="btn btn-primary btn-block">
                                        Request Quotation <ChevronRight size={18} />
                                    </a>
                                    {/* <p className="spec-note">
                                        <Mail size={14} /> Bulk pricing available for orders over 10 units.
                                    </p> */}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

export default QuickViewModal
