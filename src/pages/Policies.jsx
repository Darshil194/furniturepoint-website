import { useParams, NavLink, Navigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import useStore from '../store/useStore'
import { Shield, FileText, Truck, RotateCcw, HelpCircle } from 'lucide-react'
import './Policies.css'

const POLICY_ICONS = {
    privacy: Shield,
    terms: FileText,
    shipping: Truck,
    returns: RotateCcw,
    faq: HelpCircle
}

const Policies = () => {
    const { type } = useParams()
    const { policies } = useStore()

    // Default to privacy policy if no type specified
    if (!type) {
        return <Navigate to="/policies/privacy" replace />
    }

    const currentPolicy = policies[type]

    if (!currentPolicy) {
        return <Navigate to="/policies/privacy" replace />
    }

    const Icon = POLICY_ICONS[type] || FileText

    return (
        <div className="policies-page">
            <div className="container">
                <div className="policies-layout">
                    {/* Sidebar Navigation */}
                    <aside className="policies-sidebar">
                        <h2 className="policies-nav-title">Help & Policies</h2>
                        <nav className="policies-nav">
                            {Object.entries(policies).map(([key, policy]) => {
                                const PolicyIcon = POLICY_ICONS[key] || FileText
                                return (
                                    <NavLink
                                        key={key}
                                        to={`/policies/${key}`}
                                        className={({ isActive }) => `policy-nav-link ${isActive ? 'active' : ''}`}
                                    >
                                        <PolicyIcon size={18} />
                                        {policy.title}
                                    </NavLink>
                                )
                            })}
                        </nav>
                    </aside>

                    {/* Policy Content */}
                    <main className="policy-content">
                        <header className="policy-header">
                            <div className="policy-icon-wrapper">
                                <Icon size={32} strokeWidth={1.5} />
                            </div>
                            <h1>{currentPolicy.title}</h1>
                        </header>

                        <div className="policy-body">
                            <ReactMarkdown>{currentPolicy.content}</ReactMarkdown>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}

export default Policies
