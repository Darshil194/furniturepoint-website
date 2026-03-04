import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react'
import './Contact.css'

function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        companyName: '',
        email: '',
        phone: '',
        productName: '',
        quantity: '',
        projectLocation: '',
        message: ''
    })
    const [submitting, setSubmitting] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        try {
            await fetch('https://furniturepoint-website-k3j7.onrender.com/api/inquiries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
        } catch (err) {
            console.error('Failed to submit inquiry:', err)
        }
        setSubmitting(false)
        alert('Thank you for your enquiry. Our B2B team will contact you within 24 hours.')
        setFormData({
            name: '', companyName: '', email: '', phone: '',
            productName: '', quantity: '', projectLocation: '', message: ''
        })
    }

    return (
        <div className="contact-page">
            <header className="contact-header">
                <h1>Contact Furniture Point</h1>
                <p>Industrial &amp; Corporate Furniture Solutions tailored to your business needs.</p>
            </header>

            <div className="contact-container">
                {/* Main Content: Enquiry Form */}
                <div className="contact-main">
                    <form className="contact-form" onSubmit={handleSubmit}>
                        {/* Common Fields */}
                        <div className="form-group">
                            <label>Full Name *</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="name + surname" required />
                        </div>
                        <div className="form-group">
                            <label>Company Name *</label>
                            <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="XYZ Industries Ltd." required />
                        </div>
                        <div className="form-group">
                            <label>Business Email *</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="business email" required />
                        </div>
                        <div className="form-group">
                            <label>Phone Number *</label>
                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 xxxxx xxxxx" required />
                        </div>

                        {/* Product Enquiry Fields */}
                        <div className="form-group">
                            <label>Product Name / Model</label>
                            <input type="text" name="productName" value={formData.productName} onChange={handleChange} placeholder="e.g. Industrial Workbench Type-A" />
                        </div>
                        <div className="form-group">
                            <label>Quantity Required</label>
                            <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} placeholder="e.g. 10" min="1" />
                        </div>
                        <div className="form-group full-width">
                            <label>Project Location / Delivery Site</label>
                            <input type="text" name="projectLocation" value={formData.projectLocation} onChange={handleChange} placeholder="e.g. Dholera, Unit 2" />
                        </div>

                        <div className="form-group full-width">
                            <label>Message / Specific Requirements</label>
                            <textarea rows="4" name="message" value={formData.message} onChange={handleChange} placeholder="Describe your requirements..."></textarea>
                        </div>

                        <div className="form-group full-width">
                            <button type="submit" className="submit-btn" disabled={submitting}>
                                <Send size={18} style={{ display: 'inline', marginRight: '8px' }} />
                                {submitting ? 'Sending...' : 'Send Enquiry'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Sidebar: Contact Info */}
                <aside className="contact-sidebar">
                    <div className="sidebar-card">
                        <h3>Head Office</h3>
                        <div className="contact-info-item">
                            <MapPin size={20} />
                            <div>
                                <strong>Furniture Point</strong>
                                Sardar Patel Complex, CG-1<br />
                                Station Road, Near SBI Bank<br />
                                Ankleshwar GIDC, Gujarat – 393002
                            </div>
                        </div>
                        <div className="contact-info-item">
                            <Phone size={20} />
                            <div>
                                <strong>Phone</strong>
                                +91 98250 38287
                            </div>
                        </div>
                        <div className="contact-info-item">
                            <Mail size={20} />
                            <div>
                                <strong>Email</strong>
                                furniturepointank@gmail.com
                            </div>
                        </div>
                        <div className="contact-info-item">
                            <Clock size={20} />
                            <div>
                                <strong>Business Hours</strong>
                                Mon - Sat: 9:00 AM - 6:00 PM<br />
                                Sunday: Closed
                            </div>
                        </div>
                    </div>

                    <div className="map-container">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3649.1999081909166!2d73.0030248!3d21.6249255!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be023272f832fb1%3A0x34b703ffaecbfdc9!2sFurniture+Point!5e0!3m2!1sen!2sin!4v1740520677000!5m2!1sen!2sin"
                            allowFullScreen=""
                            loading="lazy"
                            title="Furniture Point, Sardar Patel Complex"
                        ></iframe>
                    </div>
                </aside>
            </div>
        </div>
    )
}

export default Contact
