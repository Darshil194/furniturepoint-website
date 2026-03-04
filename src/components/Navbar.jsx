import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Search } from 'lucide-react'
import './Navbar.css'

// Glance images with descriptions for each nav item
const glanceData = {
    policies: {
        title: 'Customer Support',
        items: [
            // { img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=300&fit=crop', desc: 'Easy Returns' },
            { img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop', desc: 'Secure Payments' },
            { img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop', desc: 'Free Shipping T&C apply' },
            { img: 'https://images.unsplash.com/photo-1556742111-a301076d9d18?w=400&h=300&fit=crop', desc: 'Warranty' },
            { img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop', desc: 'Support' }
        ]
    }
}

function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isHidden, setIsHidden] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [activeDropdown, setActiveDropdown] = useState(null)
    const location = useLocation()
    const lastScrollY = useRef(0)
    const dropdownTimeout = useRef(null)

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY
            setIsScrolled(currentScrollY > 50)
            if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
                setIsHidden(true)
                setActiveDropdown(null)
            } else {
                setIsHidden(false)
            }
            lastScrollY.current = currentScrollY
        }
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        setIsMobileMenuOpen(false)
        setActiveDropdown(null)
        lastScrollY.current = 0
        setIsHidden(false)
    }, [location])

    const handleMouseEnter = (key) => {
        if (key === 'home') return;
        if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current)
        setActiveDropdown(key)
    }

    const handleMouseLeave = () => {
        dropdownTimeout.current = setTimeout(() => {
            setActiveDropdown(null)
        }, 400)
    }

    // Home has NO dropdown
    const navItems = [
        { key: 'home', label: 'Home', path: '/', hasDropdown: false },
        { key: 'catalog', label: 'Catalog', path: '/catalog', hasDropdown: false },
        { key: 'about', label: 'About', path: '/about', hasDropdown: false },
        { key: 'contact', label: 'Contact', path: '/contact', hasDropdown: false },
        { key: 'policies', label: 'Policies', path: '/policies', hasDropdown: true }
    ]

    return (
        <>
            <motion.header
                className={`navbar navbar--always-dark ${isScrolled ? 'navbar--scrolled' : ''} ${isHidden ? 'navbar--hidden' : ''}`}
                initial={{ y: 0 }}
                animate={{ y: isHidden ? -100 : 0 }}
                transition={{ duration: 0.3 }}
            >
                <nav className="navbar__container container">
                    <Link to="/" className="navbar__logo">
                        <img
                            src="/assets/logo/furniture-point-logo.svg"
                            alt="Furniture Point - ISO 9001 & 14001 Certified Company"
                            className="logo-image"
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <ul className="navbar__nav">
                        {navItems.map(item => (
                            <li
                                key={item.key}
                                className={`navbar__nav-item ${item.hasDropdown ? 'has-dropdown' : ''}`}
                                onMouseEnter={() => item.hasDropdown && handleMouseEnter(item.key)}
                                onMouseLeave={handleMouseLeave}
                            >
                                <Link
                                    to={item.path}
                                    className={location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path)) ? 'active' : ''}
                                    onClick={() => window.scrollTo(0, 0)}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div className="navbar__actions">
                        <div className="navbar__search-wrapper">
                            <button
                                className="navbar__action-btn"
                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                                aria-label="Search"
                            >
                                <Search size={20} />
                            </button>

                            <AnimatePresence>
                                {isSearchOpen && (
                                    <motion.div
                                        className="navbar__search navbar__search--open"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <input
                                            type="text"
                                            placeholder="Search for furniture..."
                                            className="navbar__search-input"
                                            autoFocus
                                        />
                                        <button className="navbar__search-close" onClick={() => setIsSearchOpen(false)}>
                                            <X size={16} />
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <button
                            className="navbar__mobile-toggle"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </nav>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            className="navbar__mobile-menu navbar__mobile-menu--open"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ul>
                                {navItems.map(item => (
                                    <li key={item.key}>
                                        <Link to={item.path} onClick={() => window.scrollTo(0, 0)}>
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.header>

            {/* Full-Width Light Themed Glance Panel */}
            <AnimatePresence>
                {activeDropdown && glanceData[activeDropdown] && (
                    <motion.div
                        key={activeDropdown}
                        className="navbar__glance-panel"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        onMouseEnter={() => handleMouseEnter(activeDropdown)}
                        onMouseLeave={handleMouseLeave}
                    >
                        <div className="glance-panel__title">
                            {glanceData[activeDropdown].title}
                        </div>
                        <div className="glance-panel__images">
                            {glanceData[activeDropdown].items.map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    className="glance-panel__image"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: idx * 0.08 }}
                                >
                                    <img src={item.img} alt={item.desc} />
                                    <div className="glance-panel__desc">{item.desc}</div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default Navbar
