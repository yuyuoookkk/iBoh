import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'pakjapi',
  password: process.env.DB_PASSWORD || 'pakjapi123',
  database: process.env.DB_NAME || 'pakjapi_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ── Auto-create tables ───────────────────────────────────────────────────────

export async function initDatabase() {
  const conn = await pool.getConnection();
  try {
    await conn.query(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price INT NOT NULL,
        image VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        total_amount INT NOT NULL,
        payment_method ENUM('qr','ewallet','card') DEFAULT 'qr',
        ewallet_provider VARCHAR(50) NULL,
        status ENUM('pending_payment','paid','shipped','cancelled') DEFAULT 'pending_payment',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        paid_at TIMESTAMP NULL
      )
    `);

    // Migration: add columns if table already exists but lacks them
    try {
      await conn.query(`ALTER TABLE orders ADD COLUMN payment_method ENUM('qr','ewallet','card') DEFAULT 'qr' AFTER total_amount`);
    } catch { /* column already exists */ }
    try {
      await conn.query(`ALTER TABLE orders ADD COLUMN ewallet_provider VARCHAR(50) NULL AFTER payment_method`);
    } catch { /* column already exists */ }

    await conn.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        product_id VARCHAR(50) NOT NULL,
        product_name VARCHAR(255) NOT NULL,
        price INT NOT NULL,
        quantity INT NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id)
      )
    `);

    console.log('[DB] Tables verified / created.');

    try {
      await conn.query(`UPDATE products SET image = '/mypacar.jpeg' WHERE id = 'mclass-core-node'`);
    } catch (e) {
      console.error('[DB] Failed to update mclass-core-node image:', e.message);
    }


    // Seed products if empty
    const [rows] = await conn.query('SELECT COUNT(*) as count FROM products');
    if (rows[0].count === 0) {
      await seedProducts(conn);
    }
  } finally {
    conn.release();
  }
}

// ── Seed default products ────────────────────────────────────────────────────

async function seedProducts(conn) {
  const products = [
    {
      id: 'mclass-core-node',
      name: 'Aq Sayang Natashia',
      description: 'I love you so much my pacar',
      price: '∞',
      image: '/mypacar.jpeg',
    },
    {
      id: 'mclass-core-matrix',
      name: 'Macbooh semi trondol',
      description: 'Dual-die architecture with expanded unified memory.',
      price: 349900,
      image: '/sequence/ezgif-frame-050.jpg',
    },
    {
      id: 'mclass-quantum-array',
      name: 'Macbooh trondol',
      description: 'For enterprise-grade rendering and real-time physical simulations.',
      price: 599900,
      image: '/sequence/ezgif-frame-100.jpg',
    },
  ];

  for (const p of products) {
    await conn.query(
      'INSERT INTO products (id, name, description, price, image) VALUES (?, ?, ?, ?, ?)',
      [p.id, p.name, p.description, p.price, p.image]
    );
  }

  console.log('[DB] Seeded', products.length, 'products.');
}

export default pool;
