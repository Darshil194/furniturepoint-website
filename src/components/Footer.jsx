import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter, Youtube, ArrowRight, Check } from 'lucide-react'
import './Footer.css'

function Footer() {
    const [email, setEmail] = useState('')
    const [subscribed, setSubscribed] = useState(false)

    const handleSubscribe = (e) => {
        e.preventDefault()
        if (email) {
            // In production, this would send to an API
            console.log('Subscribed:', email)
            setSubscribed(true)
            setEmail('')
            // Reset after 3 seconds
            setTimeout(() => setSubscribed(false), 3000)
        }
    }

    return (
        <footer className="footer">
            {/* Newsletter Section Removed */}

            {/* Main Footer */}
            <div className="footer__main">
                <div className="container">
                    <div className="footer__grid">
                        {/* Brand Column */}
                        <div className="footer__brand">
                            <Link to="/" className="footer__logo">
                                <span className="logo-icon">FP</span>
                                <span className="logo-name">Furniture Point</span>
                            </Link>
                            <p className="footer__about">
                                Industrial and corporate furniture solutions engineered for durability,
                                functionality, and long-term performance. <strong>ISO 9001 & 14001 Certified.</strong> Serving businesses across Gujarat and India.
                            </p>
                            <div className="footer__social">
                                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><Facebook size={20} /></a>
                                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram size={20} /></a>
                                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><Twitter size={20} /></a>
                                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="Youtube"><Youtube size={20} /></a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="footer__column">
                            <h4>Quick Links</h4>
                            <ul>
                                <li><Link to="/catalog">All Products</Link></li>
                                {/* <li><Link to="/#featured">Featured</Link></li> */}
                                <li><Link to="/about">About Us</Link></li>
                            </ul>
                        </div>

                        {/* Categories */}
                        <div className="footer__column">
                            <h4>Categories</h4>
                            <ul>
                                <li><Link to="/catalog">Office furniture</Link></li>
                                <li><Link to="/catalog">Industrial Furniture</Link></li>
                                <li><Link to="/catalog">Storage Solutions</Link></li>
                                <li><Link to="/catalog">Seating</Link></li>
                                <li><Link to="/catalog">Desks & Tables</Link></li>
                            </ul>
                        </div>

                        {/* Support */}
                        <div className="footer__column">
                            <h4>Support</h4>
                            <ul>
                                <li><Link to="/contact">Contact Us</Link></li>
                                <li><Link to="/policies/shipping">Shipping Info</Link></li>
                                <li><Link to="/policies/returns">Returns</Link></li>
                                <li><Link to="/policies/faq">FAQ</Link></li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div className="footer__column footer__contact">
                            <h4>Contact Us</h4>
                            <ul>
                                <li>
                                    <MapPin size={18} />
                                    <span>
                                        Sardar Patel Complex, CG-1<br />
                                        Station Road, Near SBI Bank<br />
                                        Ankleshwar GIDC, Gujarat – 393002</span>
                                </li>
                                <li>
                                    <a href="tel:+919825038287">
                                        <Phone size={18} />
                                        <span>+91 98250 38287</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="mailto:furniturepointank@gmail.com">
                                        <Mail size={18} />
                                        <span>furniturepointank@gmail.com</span>
                                    </a>
                                </li>
                                <li>
                                    <Clock size={18} />
                                    <span>Mon–Sat: 9:00 AM – 6:00 PM</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="footer__bottom">
                <div className="container">
                    <p>&copy; 2026 Furniture Point. All rights reserved.</p>
                    <div className="footer__legal">
                        <Link to="/policies/privacy">Privacy Policy</Link>
                        <Link to="/policies/terms">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
