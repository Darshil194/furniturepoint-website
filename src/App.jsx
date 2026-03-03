import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
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

import Policies from './pages/Policies'

import useStore from './store/useStore'
import './App.css'

function App() {
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Fetch all data from database on initial load
        const initializeData = async () => {
            await Promise.all([
                useStore.getState().fetchProducts(),
                useStore.getState().fetchCategories(),
                useStore.getState().fetchSubcategories(),
                useStore.getState().fetchAuxiliaryData()
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
                <Route path="/catalog" element={<PublicLayout><Catalog /></PublicLayout>} />
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
                    <Route path="policies" element={<PolicyManager />} />
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
