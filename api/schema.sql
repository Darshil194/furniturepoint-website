-- Neon PostgreSQL Schema for Furniture Point
-- Run this in the Neon SQL Editor to create the tables

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

-- Subcategories table
CREATE TABLE IF NOT EXISTS subcategories (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES categories(id),
    name VARCHAR(100) NOT NULL,
    description TEXT
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    sku VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    category_id INTEGER REFERENCES categories(id),
    subcategory_id INTEGER REFERENCES subcategories(id),
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INTEGER DEFAULT 0,
    images JSONB DEFAULT '[]',
    featured BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'active',
    tags JSONB DEFAULT '[]',
    rating DECIMAL(2, 1) DEFAULT 0,
    reviews INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Policies table
CREATE TABLE IF NOT EXISTS policies (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default policies
INSERT INTO policies (type, title, content) VALUES
    ('privacy', 'Privacy Policy', '## 1. Information We Collect
We collect information you provide directly to us, such as when you create an account, make a purchase, or sign up for our newsletter.

## 2. How We Use Your Information
We use the information we collect to process your orders and payments, communicate with you about your orders, and improve our website.

## 3. Information Sharing
We do not share your personal information with third parties, except as necessary to process your orders.'),
    ('terms', 'Terms of Service', '## 1. Acceptance of Terms
By accessing or using our website, you agree to be bound by these Terms of Service.

## 2. Use of Site
You may use our site strictly for lawful purposes.

## 3. Product Descriptions
We attempt to be as accurate as possible regarding product descriptions.'),
    ('shipping', 'Shipping Information', '## Shipping Rates
Standard shipping is free for all orders over $500. For orders under $500, a flat rate of $50 applies.

## Delivery Times
- **Standard Shipping**: 5-7 business days
- **Express Shipping**: 2-3 business days'),
    ('returns', 'Returns & Refunds', '## Return Policy
You have 30 days from the date of delivery to return your item. The item must be unused and in original condition.

## Refund Process
Once we receive your item, we will inspect it and notify you of the refund status.'),
    ('faq', 'Frequently Asked Questions', '## Do you offer warranty?
Yes, all our furniture comes with a 1-year manufacturer warranty covering structural defects.

## Can I cancel my order?
You can cancel your order within 24 hours of placing it.')
ON CONFLICT (type) DO NOTHING;

-- Audit Logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(50),
    user_id VARCHAR(50),
    user_name VARCHAR(100),
    user_role VARCHAR(50),
    description TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample categories
INSERT INTO categories (id, name, description) VALUES
    (1, 'Living Room', 'Sofas, chairs, and tables'),
    (2, 'Dining', 'Dining tables and chairs'),
    (3, 'Bedroom', 'Beds, dressers, and nightstands'),
    (4, 'Office', 'Home office furniture'),
    (5, 'Storage', 'Shelves, cabinets, and organizers')
ON CONFLICT (id) DO NOTHING;

-- Insert sample subcategories
INSERT INTO subcategories (id, category_id, name, description) VALUES
    (1, 1, 'Sofas', 'Couches and loveseats'),
    (2, 1, 'Chairs', 'Accent and armchairs'),
    (3, 1, 'Tables', 'Coffee and side tables'),
    (4, 2, 'Dining Sets', 'Complete dining sets'),
    (5, 2, 'Dining Chairs', 'Individual dining chairs'),
    (6, 3, 'Beds', 'All types of beds'),
    (7, 3, 'Dressers', 'Storage dressers'),
    (8, 4, 'Desks', 'Work desks'),
    (9, 4, 'Office Chairs', 'Ergonomic chairs'),
    (10, 5, 'Bookshelves', 'Book storage')
ON CONFLICT (id) DO NOTHING;

-- Insert sample products
INSERT INTO products (id, sku, name, slug, description, category_id, subcategory_id, price, stock_quantity, images, featured, tags, rating, reviews) VALUES
    (1, 'FP-SOFA-001', 'Velvet Navy Sofa', 'velvet-navy-sofa', 'Luxurious velvet sofa in deep navy blue with gold-tipped wooden legs.', 1, 1, 2499.00, 15, '["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800"]', true, '["bestseller", "luxury"]', 4.9, 124),
    (2, 'FP-DINING-001', 'Scandinavian Dining Set', 'scandinavian-dining-set', 'Elegant 6-seater dining set with solid oak wood construction.', 2, 4, 1899.00, 8, '["https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800"]', true, '["new", "eco-friendly"]', 4.8, 89),
    (3, 'FP-CHAIR-001', 'Sculptural Accent Chair', 'sculptural-accent-chair', 'Modern sculptural accent chair with burnt orange velvet upholstery.', 1, 2, 899.00, 20, '["https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800"]', true, '["trending"]', 4.7, 67),
    (4, 'FP-BED-001', 'Walnut Platform Bed', 'walnut-platform-bed', 'Luxurious king size platform bed with dark walnut wood frame.', 3, 6, 3299.00, 5, '["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800"]', true, '["bestseller"]', 4.9, 156),
    (5, 'FP-TABLE-001', 'Marble & Gold Coffee Table', 'marble-gold-coffee-table', 'Stunning coffee table with genuine marble top and brushed gold legs.', 1, 3, 1299.00, 12, '["https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=800"]', false, '["luxury", "trending"]', 4.8, 92),
    (6, 'FP-SHELF-001', 'Industrial Bookshelf', 'industrial-bookshelf', 'Tall industrial-style bookshelf with reclaimed wood and black metal frame.', 5, 10, 799.00, 18, '["https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800"]', false, '["new"]', 4.6, 45)
ON CONFLICT (id) DO NOTHING;

-- Reset sequences to avoid conflicts with future inserts
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));
SELECT setval('subcategories_id_seq', (SELECT MAX(id) FROM subcategories));
SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));
