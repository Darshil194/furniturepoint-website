import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Load environment variables
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const sql = neon(process.env.DATABASE_URL);

async function updateSchema() {
    try {
        console.log('Starting schema update...');

        // 1. Add missing columns to products table
        await sql`
            ALTER TABLE products
            ADD COLUMN IF NOT EXISTS material_id INTEGER,
            ADD COLUMN IF NOT EXISTS color_id INTEGER,
            ADD COLUMN IF NOT EXISTS style_id INTEGER,
            ADD COLUMN IF NOT EXISTS discount_price DECIMAL(10, 2),
            ADD COLUMN IF NOT EXISTS weight_kg DECIMAL(10, 2),
            ADD COLUMN IF NOT EXISTS dimensions JSONB DEFAULT '{"length": 0, "width": 0, "height": 0}',
            ADD COLUMN IF NOT EXISTS assembly_required BOOLEAN DEFAULT false,
            ADD COLUMN IF NOT EXISTS availability_status VARCHAR(50) DEFAULT 'in_stock';
        `;
        console.log('Added missing columns to products table.');

        // 2. Create tables for materials, colors, styles if they don't exist
        // (Assuming they might be needed for FKs, but for now we just add columns to store IDs.
        // If frontend expects these tables, we should create them to store reference data)

        await sql`
            CREATE TABLE IF NOT EXISTS materials (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL UNIQUE
            );
        `;
        await sql`
            CREATE TABLE IF NOT EXISTS colors (
                id SERIAL PRIMARY KEY,
                name VARCHAR(50) NOT NULL UNIQUE,
                hex_code VARCHAR(20)
            );
        `;
        await sql`
            CREATE TABLE IF NOT EXISTS styles (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL UNIQUE
            );
        `;
        console.log('Created reference tables (materials, colors, styles).');

        // 3. Add FK constraints (optional but good practice)
        // We add them only if tables exist.
        try {
            await sql`ALTER TABLE products ADD CONSTRAINT fk_material FOREIGN KEY (material_id) REFERENCES materials(id)`;
            console.log('Added FK for material_id');
        } catch (e) { console.log('FK material_id might already exist or failed'); }

        try {
            await sql`ALTER TABLE products ADD CONSTRAINT fk_color FOREIGN KEY (color_id) REFERENCES colors(id)`;
            console.log('Added FK for color_id');
        } catch (e) { console.log('FK color_id might already exist or failed'); }

        try {
            await sql`ALTER TABLE products ADD CONSTRAINT fk_style FOREIGN KEY (style_id) REFERENCES styles(id)`;
            console.log('Added FK for style_id');
        } catch (e) { console.log('FK style_id might already exist or failed'); }

        // 4. Insert some default data if empty
        const materialsCount = await sql`SELECT count(*) FROM materials`;
        if (materialsCount[0].count == 0) {
            await sql`INSERT INTO materials (name) VALUES ('Wood'), ('Metal'), ('Glass'), ('Leather'), ('Fabric')`;
            console.log('Inserted default materials.');
        }

        const colorsCount = await sql`SELECT count(*) FROM colors`;
        if (colorsCount[0].count == 0) {
            await sql`INSERT INTO colors (name, hex_code) VALUES 
                ('Black', '#000000'), 
                ('White', '#FFFFFF'), 
                ('Brown', '#8B4513'), 
                ('Gray', '#808080'), 
                ('Beige', '#F5F5DC'),
                ('Blue', '#0000FF')`;
            console.log('Inserted default colors.');
        }

        const stylesCount = await sql`SELECT count(*) FROM styles`;
        if (stylesCount[0].count == 0) {
            await sql`INSERT INTO styles (name) VALUES ('Modern'), ('Traditional'), ('Industrial'), ('Scandinavian'), ('Mid-Century')`;
            console.log('Inserted default styles.');
        }

        console.log('Schema update complete!');
    } catch (err) {
        console.error('Schema update failed:', err);
    } finally {
        await sql.end();
    }
}

updateSchema();
