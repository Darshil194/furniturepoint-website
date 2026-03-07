import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import FurniturePage from './pages/FurniturePage'
import About from './pages/About'
import Contact from './pages/Contact'
import AdminLogin from './pages/AdminLogin'
import ProtectedRoute from './components/ProtectedRoute'

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import ProductList from './pages/admin/ProductList'
import ProductForm from './pages/admin/ProductForm'
import CategoryManager from './pages/admin/CategoryManager'
import PolicyManager from './pages/admin/PolicyManager'
import Inquiries from './pages/admin/Inquiries'
import AuditLog from './pages/admin/AuditLog'
import SettingsPage from './pages/admin/SettingsPage'

import Policies from './pages/Policies'

import useStore from './store/useStore'
import './App.css'

function App() {
    const [loading, setLoading] = useState(true)
    const location = useLocation()
    const prevPathRef = useRef(location.pathname)

    // Clear admin session when navigating away from /admin/* via SPA navigation
    useEffect(() => {
        const prevPath = prevPathRef.current
        const currentPath = location.pathname
        prevPathRef.current = currentPath

        // If we were on an admin route and now we're NOT on an admin route
        const wasAdmin = prevPath.startsWith('/admin') && prevPath !== '/admin/login'
        const isAdmin = currentPath.startsWith('/admin') && currentPath !== '/admin/login'

        if (wasAdmin && !isAdmin) {
            sessionStorage.removeItem('fp-admin-active')
            sessionStorage.removeItem('fp-admin-auth')
            useStore.getState().logoutAdmin()
        }
    }, [location.pathname])

    useEffect(() => {
        // Fetch all data from database on initial load
        const initializeData = async () => {
            await Promise.all([
                useStore.getState().fetchProducts(),
                useStore.getState().fetchCategories(),
                useStore.getState().fetchSubcategories(),
                useStore.getState().fetchAuxiliaryData(),
                useStore.getState().fetchPolicies()
            ])
        }
        initializeData()
        // Only show loading briefly for initial app load
        const timer = setTimeout(() => setLoading(false), 500)
        return () => clearTimeout(timer)
    }, [])

    if (loading) {
        return <LoadingScreen />
    }

    return (
        <div className="app">
            <ScrollToTop />
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
                <Route path="/furniture" element={<PublicLayout><FurniturePage /></PublicLayout>} />
                <Route path="/furniture/:categorySlug" element={<PublicLayout><FurniturePage /></PublicLayout>} />
                <Route path="/furniture/:categorySlug/:subSlug" element={<PublicLayout><FurniturePage /></PublicLayout>} />
                <Route path="/catalog" element={<Navigate to="/furniture" replace />} />
                <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
                <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
                <Route path="/policies/:type?" element={<PublicLayout><Policies /></PublicLayout>} />

                {/* Admin Login (outside protected) */}
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* Protected Admin Routes with Layout */}
                <Route path="/admin"
                    element={
                        <ProtectedRoute>
                            <AdminLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Dashboard />} />
                    <Route path="products" element={<ProductList />} />
                    <Route path="products/new" element={<ProductForm />} />
                    <Route path="products/:id/edit" element={<ProductForm />} />
                    <Route path="categories" element={<CategoryManager />} />
                    <Route path="inquiries" element={<Inquiries />} />
                    <Route path="activity" element={<AuditLog />} />
                    <Route path="policies" element={<PolicyManager />} />
                    <Route path="settings" element={<SettingsPage />} />
                </Route>
            </Routes>
        </div>
    )
}

import { FloatingHelpButton, ScrollToTopButton } from './components/FloatingUI'

function PublicLayout({ children }) {
    return (
        <>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <FloatingHelpButton />
            <ScrollToTopButton />
        </>
    )
}

function LoadingScreen() {
    return (
        <div className="loading-screen">
            <div className="loading-content">
                <div className="loading-logo">
                    <span className="logo-text">FP</span>
                </div>
                <div className="loading-bar">
                    <div className="loading-bar-fill"></div>
                </div>
                <p className="loading-text">Crafting Excellence...</p>
            </div>
        </div>
    )
}

export default App
