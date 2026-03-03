import React from 'react';
import './About.css';
import {
    Factory,
    Building2,
    Wrench,
    ShieldCheck,
    Settings,
    Truck
} from 'lucide-react';

function About() {
    return (
        <section className="about">
            {/* Hero Section */}
            <div className="about-hero">
                <div className="container">
                    <span className="about-tag">About Furniture Point</span>
                    <h1>Engineering Industrial & <br /> Office Workspaces</h1>
                    <p>
                        We design and manufacture high-performance industrial and corporate
                        furniture solutions built for durability, efficiency, and long-term value.
                    </p>
                </div>
            </div>

            {/* Company Profile Section */}
            <div className="about-section">
                <div className="container">
                    <div className="profile-grid">
                        <div className="profile-text">
                            <h2 className="section-title">Who We Are</h2>
                            <p>
                                <strong>Furniture Point</strong> is a Gujarat-based B2B manufacturing company specializing in
                                industrial and corporate furniture solutions. We also provide home furniture solutions.
                                We serve factories, laboratories, corporate offices, educational institutions, and commercial facilities.
                            </p>
                            <p>
                                With decades of expertise in precision manufacturing, we deliver engineered solutions that meet
                                the rigorous demands of industrial environments while maintaining the aesthetic standards of
                                modern corporate workspaces.
                            </p>
                        </div>
                        <div className="profile-stats">
                            <div className="stat-box">
                                <span className="stat-number">25+</span>
                                <span className="stat-label">Years Experience</span>
                            </div>
                            <div className="stat-box">
                                <span className="stat-number">500+</span>
                                <span className="stat-label">Projects Delivered</span>
                            </div>
                            <div className="stat-box">
                                <span className="stat-number">100%</span>
                                <span className="stat-label">In-House Mfg</span>
                            </div>
                            <div className="stat-box">
                                <span className="stat-number">B2B</span>
                                <span className="stat-label">Specialists</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Core Areas Section */}
            <div className="about-section bg-light">
                <div className="container">
                    <h2 className="section-title">Our Core Areas</h2>
                    <div className="verticals-grid">
                        {/* Industrial Solutions */}
                        <div className="vertical-card">
                            <h3><Factory size={32} /> Industrial Solutions</h3>
                            <ul className="vertical-list">
                                <li>Heavy-duty industrial workbenches</li>
                                <li>Modular industrial tables</li>
                                <li>Lab furniture & testing stations</li>
                                <li>Tool storage systems</li>
                                <li>Industrial lockers & cabinets</li>
                                <li>Custom sheet metal fabrication</li>
                                <li>Material handling trolleys</li>
                            </ul>
                        </div>

                        {/* Office & Corporate */}
                        <div className="vertical-card">
                            <h3><Building2 size={32} /> Office & Corporate</h3>
                            <ul className="vertical-list">
                                <li>Modular office workstations</li>
                                <li>Executive desks & management cabins</li>
                                <li>Conference tables</li>
                                <li>Ergonomic office chairs</li>
                                <li>Filing & storage systems</li>
                                <li>Complete workspace setups</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Manufacturing Capabilities */}
            <div className="about-section">
                <div className="container">
                    <h2 className="section-title">Manufacturing Capabilities</h2>
                    <div className="capabilities-grid">
                        <div className="capability-item">
                            <Settings size={40} className="mb-4 text-primary" />
                            <h4>Sheet Metal Fabrication</h4>
                        </div>
                        <div className="capability-item">
                            <Wrench size={40} className="mb-4 text-primary" />
                            <h4>CNC Laser Cutting</h4>
                        </div>
                        <div className="capability-item">
                            <Settings size={40} className="mb-4 text-primary" />
                            <h4>CNC Bending</h4>
                        </div>
                        <div className="capability-item">
                            <ShieldCheck size={40} className="mb-4 text-primary" />
                            <h4>Powder Coating</h4>
                        </div>
                        <div className="capability-item">
                            <ShieldCheck size={40} className="mb-4 text-primary" />
                            <h4>Quality-Controlled Production</h4>
                        </div>
                    </div>
                </div>
            </div>

            {/* Certifications & Quality */}
            <div className="about-section bg-light">
                <div className="container">
                    <h2 className="section-title">Certifications & Quality</h2>
                    <div className="profile-grid">
                        <div className="profile-text">
                            <p>
                                Quality is at the core of our manufacturing philosophy. We adhere to rigorous
                                international standards to ensure that every product leaving our facility
                                meets the highest benchmarks of durability and safety.
                            </p>
                            <p>
                                Our integrated management system reflects our commitment to both
                                operational excellence and environmental responsibility.
                            </p>
                        </div>
                        <div className="profile-stats">
                            <div className="stat-box certification-box">
                                <span className="stat-number">ISO 9001:2015</span>
                                <span className="stat-label">Quality Management System</span>
                            </div>
                            <div className="stat-box certification-box">
                                <span className="stat-number">ISO 14001:2015</span>
                                <span className="stat-label">Environmental Management</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Brand Positioning */}
            <div className="brand-strip">
                <div className="container">
                    <div className="brand-values">
                        <div className="brand-value">
                            <div className="brand-icon"><ShieldCheck /></div>
                            <span>Industrial-Grade</span>
                        </div>
                        <div className="brand-value">
                            <div className="brand-icon"><Wrench /></div>
                            <span>Durable & Functional</span>
                        </div>
                        <div className="brand-value">
                            <div className="brand-icon"><Settings /></div>
                            <span>Engineered Solutions</span>
                        </div>
                        <div className="brand-value">
                            <div className="brand-icon"><Building2 /></div>
                            <span>Professional</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default About;
