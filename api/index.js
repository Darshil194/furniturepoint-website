import express from 'express';
import { neon } from '@neondatabase/serverless';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve Uploads Directory
const uploadsDir = path.join(rootDir, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Multer Memory Storage Config (for Cloudinary)
const storage = multer.memoryStorage();

// Multer file filter - only allow jpg, png, webp
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPG, PNG, and WebP are allowed.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 3 * 1024 * 1024 } // 3MB max
});

// Slug generator helper
function generateSlug(name) {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/-+/g, '-');
}

// Helper to safely convert values (correctly handles 0, null, and empty strings)
const toInt = (val) => (val !== undefined && val !== null && val !== '') ? parseInt(val) : null;
const toFloat = (val) => (val !== undefined && val !== null && val !== '') ? parseFloat(val) : null;

// Database Connection
const sql = neon(process.env.DATABASE_URL);

// Audit Log Helper
async function logActivity(action, entityType, entityId, description, userId = '1', userName = 'Admin User', userRole = 'admin') {
    try {
        // Ensure inputs are strings or handled correctly
        const eId = entityId ? String(entityId) : null;

        await sql`
            INSERT INTO audit_logs 
            (action, entity_type, entity_id, user_id, user_name, user_role, description)
            VALUES 
            (${action}, ${entityType}, ${eId}, ${userId}, ${userName}, ${userRole}, ${description})
        `;
    } catch (err) {
        console.error('Audit log error:', err);
    }
}

// Test DB Connection & Create tables if missing
(async () => {
    try {
        const result = await sql`SELECT NOW()`;
        console.log('Connected to Neon PostgreSQL Database!', result[0].now);

        // Ensure audit_logs table exists (fallback if schema.sql wasn't run)
        await sql`
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
            )
        `;

        // Ensure inquiries table exists
        await sql`
            CREATE TABLE IF NOT EXISTS inquiries (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                company_name VARCHAR(255),
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(50),
                product_name VARCHAR(255),
                quantity INTEGER,
                project_location VARCHAR(255),
                message TEXT,
                status VARCHAR(20) DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
    } catch (err) {
        console.error('Error connecting to Neon:', err.message);
    }
})();

// =======================
// HEALTH CHECK
// =======================
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

// =======================
// UPLOAD ENDPOINT
// =======================
app.post('/api/upload', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Upload to Cloudinary using a buffer
        const uploadToCloudinary = () => {
            return new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'furniture_point', // Optional: subfolder in Cloudinary
                        resource_type: 'auto'
                    },
                    (error, result) => {
                        if (error) {
                            console.error('Cloudinary upload error:', error);
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                );
                uploadStream.end(req.file.buffer);
            });
        };

        const result = await uploadToCloudinary();
        console.log('File uploaded to Cloudinary successfully:', result.secure_url);

        res.json({ url: result.secure_url });
    } catch (err) {
        console.error('Upload handler error:', err);
        // Providing more descriptive error for debugging
        res.status(500).json({ error: 'Failed to upload image to cloud storage: ' + (err.message || String(err)) });
    }
});

// Error handling middleware (catches Multer errors)
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File too large. Maximum size is 3MB.' });
        }
        return res.status(400).json({ error: 'Multer error: ' + err.message });
    } else if (err) {
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
    next();
});

// =======================
// AUDIT LOGS
// =======================
app.get('/api/audit-logs', async (req, res) => {
    try {
        const rows = await sql`SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 100`;
        // Map snake_case to camelCase
        const logs = rows.map(row => ({
            id: row.id,
            action: row.action,
            entityType: row.entity_type,
            entityId: row.entity_id,
            userId: row.user_id,
            userName: row.user_name,
            userRole: row.user_role,
            description: row.description,
            timestamp: row.timestamp
        }));
        res.json(logs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch audit logs' });
    }
});

// =======================
// INQUIRIES
// =======================
app.get('/api/inquiries', async (req, res) => {
    try {
        const rows = await sql`SELECT * FROM inquiries ORDER BY created_at DESC`;
        const inquiries = rows.map(row => ({
            id: row.id,
            name: row.name,
            companyName: row.company_name,
            email: row.email,
            phone: row.phone,
            productName: row.product_name,
            quantity: row.quantity,
            projectLocation: row.project_location,
            message: row.message,
            status: row.status,
            createdAt: row.created_at
        }));
        res.json(inquiries);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch inquiries' });
    }
});

app.post('/api/inquiries', async (req, res) => {
    try {
        const { name, companyName, email, phone, productName, quantity, projectLocation, message } = req.body;
        const result = await sql`
            INSERT INTO inquiries (name, company_name, email, phone, product_name, quantity, project_location, message)
            VALUES (${name}, ${companyName || null}, ${email}, ${phone || null}, ${productName || null}, ${quantity ? parseInt(quantity) : null}, ${projectLocation || null}, ${message || null})
            RETURNING *
        `;
        res.status(201).json(result[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create inquiry' });
    }
});

app.put('/api/inquiries/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const result = await sql`
            UPDATE inquiries SET status = ${status} WHERE id = ${id} RETURNING *
        `;
        if (result.length === 0) {
            return res.status(404).json({ error: 'Inquiry not found' });
        }
        res.json(result[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update inquiry status' });
    }
});

app.delete('/api/inquiries/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await sql`DELETE FROM inquiries WHERE id = ${id}`;
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete inquiry' });
    }
});

// =======================
// CATEGORIES
// =======================
app.get('/api/categories', async (req, res) => {
    try {
        const rows = await sql`SELECT * FROM categories ORDER BY id`;
        const categories = rows.map(row => ({
            id: row.id,
            name: row.name,
            slug: row.slug || '',
            description: row.description,
            imageUrl: row.image_url || ''
        }));
        res.json(categories);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/categories', async (req, res) => {
    try {
        const { name, description, imageUrl } = req.body;
        const slug = generateSlug(name);
        const result = await sql`
            INSERT INTO categories (name, slug, description, image_url)
            VALUES (${name}, ${slug}, ${description}, ${imageUrl || null})
            RETURNING *
        `;
        const newCat = result[0];
        await logActivity('create', 'category', newCat.id, `Created category: ${newCat.name}`);
        res.status(201).json({
            id: newCat.id,
            name: newCat.name,
            slug: newCat.slug || '',
            description: newCat.description,
            imageUrl: newCat.image_url || ''
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/categories/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, imageUrl } = req.body;
        const slug = generateSlug(name);
        const result = await sql`
            UPDATE categories 
            SET name = ${name}, slug = ${slug}, description = ${description}, image_url = ${imageUrl || null}
            WHERE id = ${id}
            RETURNING *
        `;
        if (result.length === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }
        await logActivity('update', 'category', id, `Updated category: ${name}`);
        res.json({
            id: result[0].id,
            name: result[0].name,
            slug: result[0].slug || '',
            description: result[0].description,
            imageUrl: result[0].image_url || ''
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/categories/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await sql`DELETE FROM categories WHERE id = ${id}`;
        await logActivity('delete', 'category', id, `Deleted category ID: ${id}`);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// =======================
// SUBCATEGORIES  
// =======================
app.get('/api/subcategories', async (req, res) => {
    try {
        const rows = await sql`SELECT * FROM subcategories ORDER BY id`;
        // Map to camelCase for frontend
        const subcategories = rows.map(row => ({
            id: row.id,
            categoryId: row.category_id,
            name: row.name,
            slug: row.slug || '',
            description: row.description,
            imageUrl: row.image_url || ''
        }));
        res.json(subcategories);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/subcategories', async (req, res) => {
    try {
        const { categoryId, name, description, imageUrl } = req.body;
        const slug = generateSlug(name);
        const result = await sql`
            INSERT INTO subcategories (category_id, name, slug, description, image_url)
            VALUES (${categoryId}, ${name}, ${slug}, ${description || ''}, ${imageUrl || null})
            RETURNING *
        `;
        const newSub = result[0];
        await logActivity('create', 'subcategory', newSub.id, `Created subcategory: ${newSub.name}`);
        res.status(201).json({
            id: newSub.id,
            categoryId: newSub.category_id,
            name: newSub.name,
            slug: newSub.slug || '',
            description: newSub.description,
            imageUrl: newSub.image_url || ''
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/subcategories/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { categoryId, name, description, imageUrl } = req.body;
        const slug = generateSlug(name);
        const result = await sql`
            UPDATE subcategories 
            SET category_id = ${categoryId}, name = ${name}, slug = ${slug}, description = ${description || ''}, image_url = ${imageUrl || null}
            WHERE id = ${id}
            RETURNING *
        `;
        if (result.length === 0) {
            return res.status(404).json({ error: 'Subcategory not found' });
        }
        await logActivity('update', 'subcategory', id, `Updated subcategory: ${name}`);
        res.json({
            id: result[0].id,
            categoryId: result[0].category_id,
            name: result[0].name,
            slug: result[0].slug || '',
            description: result[0].description,
            imageUrl: result[0].image_url || ''
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/subcategories/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await sql`DELETE FROM subcategories WHERE id = ${id}`;
        await logActivity('delete', 'subcategory', id, `Deleted subcategory ID: ${id}`);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// =======================
// PRODUCTS
// =======================
app.get('/api/products', async (req, res) => {
    try {
        const rows = await sql`
            SELECT p.*, 
                   c.name as category_name, 
                   s.name as subcategory_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN subcategories s ON p.subcategory_id = s.id
            ORDER BY p.id DESC
        `;
        // Map snake_case to camelCase for frontend compatibility
        const products = rows.map(row => ({
            id: row.id,
            sku: row.sku,
            name: row.name,
            slug: row.slug,
            description: row.description,
            categoryId: row.category_id,
            subcategoryId: row.subcategory_id,
            price: parseFloat(row.price),
            stockQuantity: row.stock_quantity,
            images: row.images || [],
            featured: row.featured,
            status: row.status,
            tags: row.tags || [],
            rating: parseFloat(row.rating) || 0,
            reviews: row.reviews || 0,
            categoryName: row.category_name,
            subcategoryName: row.subcategory_name,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        }));
        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const rows = await sql`
            SELECT p.*, 
                   c.name as category_name, 
                   s.name as subcategory_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN subcategories s ON p.subcategory_id = s.id
            WHERE p.id = ${id}
        `;
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        const row = rows[0];
        res.json({
            id: row.id,
            sku: row.sku,
            name: row.name,
            slug: row.slug,
            description: row.description,
            categoryId: row.category_id,
            subcategoryId: row.subcategory_id,
            price: parseFloat(row.price),
            stockQuantity: row.stock_quantity,
            images: row.images || [],
            featured: row.featured,
            status: row.status,
            tags: row.tags || [],
            rating: parseFloat(row.rating) || 0,
            reviews: row.reviews || 0,
            categoryName: row.category_name,
            subcategoryName: row.subcategory_name,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/products', async (req, res) => {
    try {
        const p = req.body;
        console.log('DEBUG PRODUCT BODY:', JSON.stringify(p, null, 2));

        // Generate SKU/Slug if missing
        if (!p.sku) p.sku = `FP-${Date.now()}`;
        if (!p.slug && p.name) {
            p.slug = p.name.toLowerCase().trim()
                .replace(/[^\w\s-]/g, '')
                .replace(/[\s_-]+/g, '-') + '-' + Date.now();
        }

        // Handle integers for IDs (convert '' to null)

        const result = await sql`
            INSERT INTO products (
                sku, name, slug, description, category_id, subcategory_id, 
                price, stock_quantity, images, featured, status, tags,
                material_id, color_id, style_id, discount_price, weight_kg, 
                dimensions, assembly_required, availability_status,
                created_at, updated_at
            ) VALUES (
                ${p.sku}, ${p.name}, ${p.slug}, ${p.description}, 
                ${toInt(p.categoryId)}, ${toInt(p.subcategoryId) || (p.subcategoryIds && p.subcategoryIds.length > 0 ? toInt(p.subcategoryIds[0]) : null)}, ${toFloat(p.price)}, 
                ${toInt(p.stockQuantity)}, ${JSON.stringify(p.images)}, 
                ${p.featured || false}, ${p.status || 'active'}, ${JSON.stringify(p.tags || [])},
                ${toInt(p.materialId)}, ${toInt(p.colorId)}, ${toInt(p.styleId)}, 
                ${toFloat(p.discountPrice)}, ${toFloat(p.weightKg)}, 
                ${JSON.stringify(p.dimensions || {})}, ${p.assemblyRequired || false}, 
                ${p.availabilityStatus || 'in_stock'},
                CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
            )
            RETURNING *
        `;
        const newProd = result[0];
        await logActivity('create', 'product', newProd.id, `Created product: ${newProd.name}`);
        res.status(201).json(newProd);
    } catch (err) {
        console.error('Create Error:', err);
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const p = req.body;
        const result = await sql`
            UPDATE products SET
                sku = ${p.sku},
                name = ${p.name},
                slug = ${p.slug},
                description = ${p.description},
                category_id = ${toInt(p.categoryId)},
                subcategory_id = ${toInt(p.subcategoryId) || (p.subcategoryIds && p.subcategoryIds.length > 0 ? toInt(p.subcategoryIds[0]) : null)},
                price = ${toFloat(p.price)},
                stock_quantity = ${toInt(p.stockQuantity)},
                images = ${JSON.stringify(p.images)},
                featured = ${p.featured || false},
                status = ${p.status || 'active'},
                tags = ${JSON.stringify(p.tags || [])},
                material_id = ${toInt(p.materialId)},
                color_id = ${toInt(p.colorId)},
                style_id = ${toInt(p.styleId)},
                discount_price = ${toFloat(p.discountPrice)},
                weight_kg = ${toFloat(p.weightKg)},
                dimensions = ${JSON.stringify(p.dimensions || {})},
                assembly_required = ${p.assemblyRequired || false},
                availability_status = ${p.availabilityStatus || 'in_stock'},
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ${id}
            RETURNING *
        `;
        if (result.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        await logActivity('update', 'product', id, `Updated product: ${p.name}`);
        res.json(result[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await sql`DELETE FROM products WHERE id = ${id}`;
        await logActivity('delete', 'product', id, `Deleted product ID: ${id}`);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// =======================
// POLICIES
// =======================
app.get('/api/policies', async (req, res) => {
    try {
        const rows = await sql`SELECT * FROM policies ORDER BY type`;
        // Convert to object format for frontend
        const policies = {};
        rows.forEach(row => {
            policies[row.type] = {
                title: row.title,
                content: row.content
            };
        });
        res.json(policies);
    } catch (err) {
        console.error(err);
        // Return default policies if table doesn't exist
        res.json({
            privacy: { title: 'Privacy Policy', content: 'Privacy policy content' },
            terms: { title: 'Terms of Service', content: 'Terms content' },
            shipping: { title: 'Shipping Information', content: 'Shipping content' },
            returns: { title: 'Returns & Refunds', content: 'Returns content' },
            faq: { title: 'FAQ', content: 'FAQ content' }
        });
    }
});

app.get('/api/policies/:type', async (req, res) => {
    try {
        const { type } = req.params;
        const rows = await sql`SELECT * FROM policies WHERE type = ${type}`;
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Policy not found' });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/policies/:type', async (req, res) => {
    try {
        const { type } = req.params;
        const { title, content } = req.body;

        // Upsert - insert or update
        const result = await sql`
            INSERT INTO policies (type, title, content)
            VALUES (${type}, ${title}, ${content})
            ON CONFLICT (type) DO UPDATE SET
                title = EXCLUDED.title,
                content = EXCLUDED.content,
                updated_at = CURRENT_TIMESTAMP
            RETURNING *
        `;
        res.json(result[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});


// =======================
// MATERIALS
// =======================
app.get('/api/materials', async (req, res) => {
    try {
        const rows = await sql`SELECT * FROM materials ORDER BY name`;
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/materials', async (req, res) => {
    try {
        const { name } = req.body;
        const result = await sql`
            INSERT INTO materials (name)
            VALUES (${name})
            ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
            RETURNING *
        `;
        res.status(201).json(result[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// =======================
// COLORS
// =======================
app.get('/api/colors', async (req, res) => {
    try {
        const rows = await sql`SELECT * FROM colors ORDER BY name`;
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/colors', async (req, res) => {
    try {
        const { name, hex_code } = req.body;
        const result = await sql`
            INSERT INTO colors (name, hex_code)
            VALUES (${name}, ${hex_code || '#000000'})
            ON CONFLICT (name) DO UPDATE SET hex_code = EXCLUDED.hex_code
            RETURNING *
        `;
        res.status(201).json(result[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// =======================
// STYLES
// =======================
app.get('/api/styles', async (req, res) => {
    try {
        const rows = await sql`SELECT * FROM styles ORDER BY name`;
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/styles', async (req, res) => {
    try {
        const { name } = req.body;
        const result = await sql`
            INSERT INTO styles (name)
            VALUES (${name})
            ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
            RETURNING *
        `;
        res.status(201).json(result[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Start Server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

export default app;
