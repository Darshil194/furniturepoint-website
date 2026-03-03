import { useState, useEffect, useRef } from 'react'
import { MessageSquare, X, Phone, Mail, Clock, ChevronRight, ArrowUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import './FloatingUI.css'

export function FloatingHelpButton() {
    const [isOpen, setIsOpen] = useState(false)
    const popupRef = useRef(null)

    // Auto-close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target) && isOpen) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen])

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="help-panel"
                        ref={popupRef}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                        <div className="help-panel__header">
                            <div className="help-panel__title">
                                <h4>Need Assistance?</h4>
                                <span>Sales & Support Team</span>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="close-btn" aria-label="Close help">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="help-panel__body">
                            <p className="help-message">
                                For B2B inquiries, bulk orders, or technical support, contact our team directly.
                            </p>

                            <div className="contact-list">
                                <a href="tel:+919825038287" className="contact-item">
                                    <div className="contact-icon phone">
                                        <Phone size={18} />
                                    </div>
                                    <div className="contact-info">
                                        <span className="label">Call Us Directly</span>
                                        <span className="value">+91 98250 38287</span>
                                    </div>
                                    <ChevronRight size={16} className="arrow" />
                                </a>

                                <a href="mailto:furniturepointank@gmail.com" className="contact-item">
                                    <div className="contact-icon email">
                                        <Mail size={18} />
                                    </div>
                                    <div className="contact-info">
                                        <span className="label">Email Support</span>
                                        <span className="value">furniturepointank@gmail.com</span>
                                    </div>
                                    <ChevronRight size={16} className="arrow" />
                                </a>
                            </div>

                            <div className="office-hours">
                                <Clock size={14} />
                                <span>Mon–Sat: 9:00 AM – 6:00 PM</span>
                            </div>

                            <a href="/contact" className="quote-btn">
                                Request a Quote
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                className={`floating-btn ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Open support"
            >
                {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
            </motion.button>
        </>
    )
}

// Re-export other components if needed, or keep them here
export function ScrollToTopButton() {
    // ... kept same as before but minimal implementation for brevity if unchanged
    // Assuming user wants the whole file replaced, I will include the full ScrollToTop and AnimatedStatCounter
    // to avoid breaking exports.
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const toggleVisibility = () => {
            setIsVisible(window.scrollY > 400)
        }
        window.addEventListener('scroll', toggleVisibility)
        return () => window.removeEventListener('scroll', toggleVisibility)
    }, [])

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    // Import ArrowUp specifically for this component
    // ArrowUp is now imported at the top level

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    className="scroll-to-top-btn"
                    onClick={scrollToTop}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <ArrowUp size={24} />
                </motion.button>
            )}
        </AnimatePresence>
    )
}

// Helper hook
export function useAnimatedCounter(target, duration = 2000) {
    const [count, setCount] = useState(0)
    const [hasAnimated, setHasAnimated] = useState(false)

    const startAnimation = () => {
        if (hasAnimated) return
        setHasAnimated(true)
        const steps = 60
        const increment = target / steps
        const stepDuration = duration / steps
        let current = 0
        const timer = setInterval(() => {
            current += increment
            if (current >= target) {
                setCount(target)
                clearInterval(timer)
            } else {
                setCount(Math.floor(current))
            }
        }, stepDuration)
    }
    return { count, startAnimation, hasAnimated }
}

export function AnimatedStatCounter({ value, suffix = '', label, icon: Icon }) {
    const numericValue = parseInt(value.replace(/[^0-9]/g, ''))
    const { count, startAnimation, hasAnimated } = useAnimatedCounter(numericValue)

    return (
        <motion.div
            className="animated-stat"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onViewportEnter={startAnimation}
        >
            {Icon && <div className="stat-icon"><Icon size={32} /></div>}
            <span className="stat-number">{hasAnimated ? count.toLocaleString() : '0'}{suffix}</span>
            <span className="stat-label">{label}</span>
        </motion.div>
    )
}
