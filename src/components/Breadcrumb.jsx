import { ChevronRight, Home } from 'lucide-react'
import { Link } from 'react-router-dom'

function Breadcrumb({ items }) {
    return (
        <nav className="breadcrumb" aria-label="Breadcrumb">
            <ol className="breadcrumb__list">
                <li className="breadcrumb__item">
                    <Link to="/" className="breadcrumb__link">
                        <Home size={15} />
                        <span>Home</span>
                    </Link>
                </li>
                {items.map((item, index) => (
                    <li key={index} className="breadcrumb__item">
                        <ChevronRight size={14} className="breadcrumb__separator" />
                        {item.to ? (
                            <Link to={item.to} className="breadcrumb__link">
                                {item.label}
                            </Link>
                        ) : (
                            <span className="breadcrumb__current">{item.label}</span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    )
}

export default Breadcrumb
