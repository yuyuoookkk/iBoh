import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import QRCode from 'qrcode';
import path from 'path';
import { fileURLToPath } from 'url';
import pool, { initDatabase } from './db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const SERVER_URL = process.env.SERVER_URL || `http://localhost:${PORT}`;

// In production, allow same-origin. In dev, allow the Vite dev server.
app.use(cors({ origin: CLIENT_URL }));
app.use(express.json());

// Serve frontend static build
const frontendDist = path.join(__dirname, 'public');
app.use(express.static(frontendDist));

// ── Routes ───────────────────────────────────────────────────────────────────

// GET /api/products — return product catalog from MySQL
app.get('/api/products', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products ORDER BY price ASC');
    const formatted = rows.map((p) => ({
      ...p,
      displayPrice: `$${(p.price / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
    }));
    res.json(formatted);
  } catch (err) {
    console.error('Products fetch error:', err.message);
    res.status(500).json({ error: 'Failed to fetch products.' });
  }
});

// POST /api/orders — create a new order
app.post('/api/orders', async (req, res) => {
  try {
    const { customerName, customerEmail, items, paymentMethod, ewalletProvider } = req.body;

    if (!customerName || !customerEmail) {
      return res.status(400).json({ error: 'Name and email are required.' });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty.' });
    }

    const validMethods = ['qr', 'ewallet', 'card'];
    const method = validMethods.includes(paymentMethod) ? paymentMethod : 'qr';
    const provider = method === 'ewallet' ? (ewalletProvider || null) : null;

    // Validate items against DB
    const validatedItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [item.productId]);
      if (rows.length === 0) {
        return res.status(400).json({ error: `Unknown product: ${item.productId}` });
      }
      const product = rows[0];
      if (!item.quantity || item.quantity < 1) {
        return res.status(400).json({ error: `Invalid quantity for ${product.name}` });
      }
      validatedItems.push({ ...product, quantity: item.quantity });
      totalAmount += product.price * item.quantity;
    }

    // Insert order
    const [orderResult] = await pool.query(
      'INSERT INTO orders (customer_name, customer_email, total_amount, payment_method, ewallet_provider) VALUES (?, ?, ?, ?, ?)',
      [customerName, customerEmail, totalAmount, method, provider]
    );
    const orderId = orderResult.insertId;

    // Insert order items
    for (const item of validatedItems) {
      await pool.query(
        'INSERT INTO order_items (order_id, product_id, product_name, price, quantity) VALUES (?, ?, ?, ?, ?)',
        [orderId, item.id, item.name, item.price, item.quantity]
      );
    }

    console.log(`[ORDER] #${orderId} created — ${customerName} — ${method} — $${(totalAmount / 100).toFixed(2)}`);

    res.json({ orderId, totalAmount, paymentMethod: method });
  } catch (err) {
    console.error('Order creation error:', err.message);
    res.status(500).json({ error: 'Failed to create order.' });
  }
});

// GET /api/orders/:id — get order details
app.get('/api/orders/:id', async (req, res) => {
  try {
    const orderId = req.params.id;

    const [orders] = await pool.query('SELECT * FROM orders WHERE id = ?', [orderId]);
    if (orders.length === 0) {
      return res.status(404).json({ error: 'Order not found.' });
    }
    const order = orders[0];

    const [items] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [orderId]);

    res.json({
      id: order.id,
      customerName: order.customer_name,
      customerEmail: order.customer_email,
      totalAmount: order.total_amount,
      paymentMethod: order.payment_method || 'qr',
      ewalletProvider: order.ewallet_provider || null,
      status: order.status,
      createdAt: order.created_at,
      paidAt: order.paid_at,
      items: items.map((i) => ({
        productId: i.product_id,
        productName: i.product_name,
        price: i.price,
        quantity: i.quantity,
      })),
    });
  } catch (err) {
    console.error('Order fetch error:', err.message);
    res.status(500).json({ error: 'Failed to fetch order.' });
  }
});

// POST /api/orders/:id/pay — mark order as paid (called from phone)
app.post('/api/orders/:id/pay', async (req, res) => {
  try {
    const orderId = req.params.id;

    const [orders] = await pool.query('SELECT * FROM orders WHERE id = ?', [orderId]);
    if (orders.length === 0) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    const order = orders[0];
    if (order.status === 'paid') {
      return res.json({ success: true, message: 'Order already paid.' });
    }
    if (order.status !== 'pending_payment') {
      return res.status(400).json({ error: `Cannot pay order with status: ${order.status}` });
    }

    await pool.query(
      'UPDATE orders SET status = ?, paid_at = NOW() WHERE id = ?',
      ['paid', orderId]
    );

    console.log(`[PAYMENT] Order #${orderId} marked as PAID`);

    res.json({ success: true, message: 'Payment confirmed.' });
  } catch (err) {
    console.error('Payment error:', err.message);
    res.status(500).json({ error: 'Failed to process payment.' });
  }
});

// GET /api/orders/:id/qr — generate QR code as PNG
app.get('/api/orders/:id/qr', async (req, res) => {
  try {
    const orderId = req.params.id;

    // Verify order exists
    const [orders] = await pool.query('SELECT id FROM orders WHERE id = ?', [orderId]);
    if (orders.length === 0) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    // QR points to mobile payment page (use SERVER_URL in prod since backend serves frontend)
    const payUrl = `${SERVER_URL}/pay/${orderId}`;
    const qrBuffer = await QRCode.toBuffer(payUrl, {
      type: 'png',
      width: 400,
      margin: 2,
      color: {
        dark: '#00ff41',
        light: '#00000000', // transparent background
      },
    });

    res.set('Content-Type', 'image/png');
    res.send(qrBuffer);
  } catch (err) {
    console.error('QR generation error:', err.message);
    res.status(500).json({ error: 'Failed to generate QR code.' });
  }
});

// GET /api/orders — list all orders (admin)
app.get('/api/orders', async (_req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM orders ORDER BY created_at DESC LIMIT 50'
    );
    res.json(rows);
  } catch (err) {
    console.error('Orders list error:', err.message);
    res.status(500).json({ error: 'Failed to fetch orders.' });
  }
});

// ── SPA catch-all (must be AFTER all /api routes) ────────────────────────────

app.get('*', (_req, res) => {
  const indexPath = path.join(frontendDist, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(404).send('Not found');
    }
  });
});

// ── Start ────────────────────────────────────────────────────────────────────

async function start() {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`[SERVER] Online at http://localhost:${PORT}`);
      console.log(`[SERVER] Public URL: ${SERVER_URL}`);
      console.log(`[SERVER] Client origin: ${CLIENT_URL}`);
      console.log(`[SERVER] MySQL connected ✓`);
    });
  } catch (err) {
    console.error('[SERVER] Failed to start:', err.message);
    process.exit(1);
  }
}

start();
