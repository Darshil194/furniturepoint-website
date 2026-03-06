import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    ArrowRight,
    ShieldCheck,
    Truck,
    Settings,
    FileText,
    Ruler,
    CheckCircle2
} from 'lucide-react'
import useStore from '../store/useStore'
import './Home.css'

function Home() {
    const location = useLocation()

    useEffect(() => {
        if (location.hash) {
            const element = document.querySelector(location.hash)
            if (element) {
                setTimeout(() => element.scrollIntoView({ behavior: 'smooth' }), 100)
            }
        } else {
            window.scrollTo(0, 0)
        }
    }, [location])

    return (
        <div className="home">
            <HeroSection />
            <ClientsSection />
            <FeaturesBar />
            <CategoriesSection />
            <ProcessSection />
            <TestimonialsSection />
        </div>
    )
}

function HeroSection() {
    return (
        <section className="hero-premium">
            <div className="hero__background">
                <img
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80"
                    alt="Industrial Excellence"
                    className="hero__image-v2"
                />
                <div className="hero__overlay-v2"></div>
                <div className="hero__grid-pattern"></div>
            </div>

            <div className="hero__content container">
                <motion.div
                    className="hero__inner"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className="hero__badge-container">
                        <span className="hero__badge-glass">
                            <Settings size={14} className="badge-icon-spin" />
                            ISO 9001:2015 Certified
                        </span>
                        <span className="hero__badge-glass">
                            <Settings size={14} className="badge-icon-spin" />
                            ISO 14001:2015 Certified
                        </span>
                    </div>

                    <h1 className="hero__title-premium">
                        Industrial & Corporate <br />
                        <span className="hero__title-accent">Furniture Solutions</span>
                    </h1>

                    <p className="hero__subtitle-premium">
                        We engineer heavy-duty workbenches, ergonomic office setups, and
                        scalable storage systems designed for high-performance environments.
                    </p>

                    <div className="hero__actions-premium">
                        <Link to="/catalog" className="btn-pro btn-pro--primary">
                            View Industrial Catalog
                            <ArrowRight size={18} />
                        </Link>
                        <Link to="/contact" className="btn-pro btn-pro--outline">
                            Request Quote
                        </Link>
                    </div>

                    <div className="hero__trust-v2">
                        <div className="trust-v2__item">
                            <CheckCircle2 size={18} />
                            <span>GST Compliant Billing</span>
                        </div>
                        <div className="trust-v2__divider"></div>
                        <div className="trust-v2__item">
                            <CheckCircle2 size={18} />
                            <span>Pan-India Delivery</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="hero__scroll-indicator">
                <div className="mouse-wheel"></div>
            </div>
        </section>
    )
}

function ClientsSection() {
    const clients = [
        { name: 'Asian Paints', logo: '/assets/clients/asian-paints.svg' },
        { name: 'Adani Group', logo: '/assets/clients/adani-group.svg' },
        { name: 'State Bank of India', logo: '/assets/clients/sbi.svg' },
        { name: 'Welspun Group', logo: '/assets/clients/welspun.svg' },
        { name: 'Larsen & Toubro', logo: '/assets/clients/lnt.svg' },
        { name: 'Essar Group', logo: '/assets/clients/essar.svg' },
        { name: 'ONGC', logo: '/assets/clients/ongc.svg' },
        { name: 'Wockhardt', logo: '/assets/clients/wockhardt.svg' },
        { name: 'BASF', logo: '/assets/clients/basf.svg' },
        { name: 'Aditya Birla Group', logo: '/assets/clients/aditya-birla.svg' },
        { name: 'Aventis Pharma', logo: '/assets/clients/aventis.svg' },
        { name: 'Atul Ltd', logo: '/assets/clients/atul.svg' },
        { name: 'Britannia Industries', logo: '/assets/clients/britannia.svg' },
        { name: 'Lupin', logo: '/assets/clients/lupin.svg' },
        { name: 'Modiguard', logo: '/assets/clients/modiguard.svg' },
        { name: 'Siemens', logo: '/assets/clients/siemens.svg' },
        { name: 'BHEL', logo: '/assets/clients/bhel.svg' },
        { name: 'Zandu', logo: '/assets/clients/zandu.svg' },
        { name: 'SRICT', logo: '/assets/clients/shroff-rotary.svg' },
        { name: 'SIKA India', logo: '/assets/clients/sika.svg' },
        { name: 'Piramal Group', logo: '/assets/clients/piramal.svg' },
        { name: 'Navin Fluorine', logo: '/assets/clients/navin-fluorine.svg' },
        { name: 'Cadila Pharma', logo: '/assets/clients/cadila.svg' },
        { name: 'Kohler', logo: '/assets/clients/kohler.svg' },
        { name: 'GSFC', logo: '/assets/clients/gsfc.svg' },
        { name: 'PI Industries', logo: '/assets/clients/pi-industries.svg' },
        { name: 'UPL', logo: '/assets/clients/upl.svg' },
        { name: 'Gujarat Gas', logo: '/assets/clients/gujarat-gas.svg' },
        { name: 'AM/NS India', logo: '/assets/clients/amns.svg' },
        { name: 'Tata Group', logo: '/assets/clients/tata.svg' },
        { name: 'Mastercard', logo: '/assets/clients/mastercard.svg' }
    ]

    const renderLogo = (client, index) => (
        <div className="client-logo-card" key={index} title={client.name}>
            <img
                src={client.logo}
                alt={client.name}
                className="client-logo-img"
                loading="lazy"
            />
        </div>
    )

    return (
        <section className="clients-section">
            <div className="clients-section__grid-overlay"></div>
            <div className="container">
                <header className="clients-section__header">
                    <span className="clients-section__label">Trusted by Industry Leaders</span>
                    <h2 className="clients-section__heading">Our Clients</h2>
                    <p className="clients-section__subtext">
                        Partnering with India's leading corporations for industrial and workspace solutions.
                    </p>
                </header>
            </div>

            <div className="clients-marquee">
                <div className="clients-track">
                    {[...clients, ...clients].map((client, i) =>
                        renderLogo(client, i)
                    )}
                </div>
            </div>
        </section>
    )
}


function FeaturesBar() {
    const features = [
        { icon: ShieldCheck, title: '5-Year Warranty', desc: 'On structural integrity' },
        { icon: Ruler, title: 'Custom Fabrication', desc: 'Built to your specs' },
        // { icon: Truck, title: 'On-Site Installation', desc: 'Expert assembly team' },
        { icon: FileText, title: 'GST Invoicing', desc: '100% Tax compliant' }
    ]

    return (
        <section className="features-bar">
            <div className="container">
                <div className="features-bar__grid">
                    {features.map((feature, index) => (
                        <div key={index} className="feature-item">
                            <div className="feature-item__icon">
                                <feature.icon size={28} />
                            </div>
                            <div className="feature-item__text">
                                <h4>{feature.title}</h4>
                                <p>{feature.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

function CategoriesSection() {
    const categories = [
        { name: 'Industrial Storage Solutions', image: 'assets/banner/compactor.png', link: '/catalog?category=industrial' },
        { name: 'Corporate Workstations', image: 'https://images.unsplash.com/photo-1765366417030-16d9765d920a?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', link: '/catalog?category=office' },
        { name: 'Lab & Testing Furniture', image: 'https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?auto=format&fit=crop&q=80', link: '/catalog?category=lab' },
        { name: 'Industrial Storage', image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80', link: '/catalog?category=storage' }
    ]

    return (
        <section className="section">
            <div className="container">
                <header className="section-header">
                    <span className="section-tag">Our Solutions</span>
                    <h2>Engineered for Every Sector</h2>
                    <p>Specialized furniture systems for factories, offices, and laboratories.</p>
                </header>

                <div className="categories__grid">
                    {categories.map((cat, index) => (
                        <Link to={cat.link} key={index} className="category-card">
                            <div className="category-card__image">
                                <img src={cat.image} alt={cat.name} />
                            </div>
                            <div className="category-card__content">
                                <h3>{cat.name}</h3>
                                <span className="category-card__link">
                                    View Specs <ArrowRight size={16} />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}

function ProcessSection() {
    const steps = [
        { num: '01', title: 'Consultation', desc: 'We analyze your floor plan and operational needs.' },
        { num: '02', title: 'Design & Quote', desc: 'Get 2D/3D layouts and a detailed commercial proposal.' },
        { num: '03', title: 'Manufacturing', desc: 'Precision fabrication in our Gujarat facility.' },
        { num: '04', title: 'Installation', desc: 'Seamless on-site assembly by our technical team.' }
    ]

    return (
        <section className="process-section">
            <div className="container">
                <header className="section-header">
                    <span className="section-tag">How We Work</span>
                    <h2>From Blueprint to Reality</h2>
                    <p>A streamlined B2B procurement process.</p>
                </header>

                <div className="process-grid">
                    {steps.map((step, index) => (
                        <div key={index} className="process-step">
                            <div className="process-icon">{step.num}</div>
                            <h4>{step.title}</h4>
                            <p>{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

function TestimonialsSection() {
    return (
        <section className="testimonials">
            <div className="container">
                <header className="section-header">
                    <span className="section-tag">Client Trust</span>
                    <h2>Trusted by Industry Leaders</h2>
                </header>

                <div className="testimonials-grid">
                    <div className="b2b-testimonial">
                        <p>"Furniture Point equipped our entire QC lab in Ankleshwar. Their workbenches are extremely durable and the installation was finished 2 days ahead of schedule."</p>
                        <div className="client-info">
                            <h5>Rajesh Patel</h5>
                            <span></span>
                        </div>
                    </div>
                    <div className="b2b-testimonial">
                        <p>"We needed a custom modular layout for our new corporate office. Their design team optimized our space perfectly. Professional service from start to finish."</p>
                        <div className="client-info">
                            <h5>Amit Shah</h5>
                            <span></span>
                        </div>
                    </div>
                    <div className="b2b-testimonial">
                        <p>"The metal storage lockers and heavy-duty racks supplied for our warehouse are high quality. Best B2B furniture vendor in Gujarat."</p>
                        <div className="client-info">
                            <h5>Vikram Singh</h5>
                            <span></span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}


export default Home
