const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');

const app = express();
const port = 3000;
const SECRET_KEY = 'your-secret-key'; // Replace with a secure key in production

app.use(express.json());
app.use(cors());

const upload = multer({ dest: 'uploads/' });

const db = new sqlite3.Database('./database.db', (err) => {
  if (err) console.error('Database connection error:', err.message);
  else console.log('Connected to SQLite database.');
});

db.serialize(() => {
  db.run(`DROP TABLE IF EXISTS customers`);
  db.run(`DROP TABLE IF EXISTS invoices`);
  db.run(`DROP TABLE IF EXISTS payments`);
  db.run(`DROP TABLE IF EXISTS users`);
  db.run(`DROP TABLE IF EXISTS deleted_invoices`);
  db.run(`DROP TABLE IF EXISTS deleted_payments`);

  db.run(`
    CREATE TABLE customers (
      customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone_number TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `);
  db.run(`
    CREATE TABLE invoices (
      invoice_id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER,
      customer_name TEXT,
      invoice_no TEXT UNIQUE NOT NULL,
      container_no TEXT,
      container_invoice_no TEXT,
      car_details TEXT,
      vin_no TEXT,
      shipping_towing REAL,
      showroom_commission REAL,
      attestation REAL,
      duty REAL,
      bill REAL,
      vat REAL,
      clearing REAL,
      lifter REAL,
      total_amount REAL,
      date TEXT,
      FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
    )
  `);
  db.run(`
    CREATE TABLE payments (
      payment_id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER,
      payment_no TEXT UNIQUE NOT NULL,
      amount_received REAL,
      received_by TEXT,
      date TEXT,
      FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
    )
  `);
  db.run(`
    CREATE TABLE users (
      user_id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user'
    )
  `);
  db.run(`
    CREATE TABLE deleted_invoices (
      deleted_invoice_id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoice_id INTEGER,
      customer_name TEXT,
      total_amount REAL,
      deleted_by TEXT,
      deleted_at TEXT
    )
  `);
  db.run(`
    CREATE TABLE deleted_payments (
      deleted_payment_id INTEGER PRIMARY KEY AUTOINCREMENT,
      payment_id INTEGER,
      customer_name TEXT,
      amount_received REAL,
      deleted_by TEXT,
      deleted_at TEXT
    )
  `);

  const hashedPassword = bcrypt.hashSync('password123', 10);
  db.run(`INSERT INTO users (username, password, role) VALUES (?, ?, ?)`, ['admin', hashedPassword, 'admin']);
  db.run(`INSERT INTO users (username, password, role) VALUES (?, ?, ?)`, ['testuser', hashedPassword, 'user']);
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
  next();
};

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ user_id: user.user_id, username: user.username, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  });
});

app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  db.run(`INSERT INTO users (username, password, role) VALUES (?, ?, ?)`, [username, hashedPassword, 'user'], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    const token = jwt.sign({ user_id: this.lastID, username, role: 'user' }, SECRET_KEY, { expiresIn: '1h' });
    res.status(201).json({ token });
  });
});

app.get('/api/customers', authenticateToken, (req, res) => {
  db.all('SELECT * FROM customers', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/customers', authenticateToken, (req, res) => {
  const { customer_name, email, phone_number } = req.body;
  const created_at = new Date().toISOString().split('T')[0];
  if (!customer_name || !email || !phone_number) {
    return res.status(400).json({ error: 'Customer name, email, and phone number are required' });
  }
  db.run(
    `INSERT INTO customers (customer_name, email, phone_number, created_at) VALUES (?, ?, ?, ?)`,
    [customer_name, email, phone_number, created_at],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ customer_id: this.lastID });
    }
  );
});

app.put('/api/customers/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { customer_name, email, phone_number } = req.body;
  if (!customer_name || !email || !phone_number) {
    return res.status(400).json({ error: 'Customer name, email, and phone number are required' });
  }
  db.run(
    `UPDATE customers SET customer_name = ?, email = ?, phone_number = ? WHERE customer_id = ?`,
    [customer_name, email, phone_number, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Customer not found' });
      res.status(200).json({ message: 'Customer updated' });
    }
  );
});

app.post('/api/bulk/customers', authenticateToken, requireAdmin, upload.single('file'), (req, res) => {
  const results = [];
  const errors = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => {
      console.log('Raw CSV Row (Customers):', data);
      const normalizedData = {};
      for (let key in data) {
        const trimmedKey = key.trim();
        normalizedData[trimmedKey] = (data[key] || '').trim();
      }
      const customer_name = normalizedData.customer_name;
      const email = normalizedData.email;
      const phone_number = normalizedData.phone_number;
      if (!customer_name || !email || !phone_number) {
        errors.push(`Invalid row: ${JSON.stringify(data)} - Missing required fields (customer_name: ${customer_name}, email: ${email}, phone_number: ${phone_number})`);
      } else {
        results.push({ customer_name, email, phone_number, created_at: normalizedData.created_at });
      }
    })
    .on('end', () => {
      console.log('Parsed Results (Customers):', results);
      console.log('Errors (Customers):', errors);
      if (results.length === 0) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ error: 'No valid rows found', details: errors });
      }

      db.serialize(() => {
        const stmt = db.prepare(`INSERT INTO customers (customer_name, email, phone_number, created_at) VALUES (?, ?, ?, ?)`);
        results.forEach(row => {
          stmt.run(
            row.customer_name,
            row.email,
            row.phone_number,
            row.created_at || new Date().toISOString().split('T')[0],
            (err) => {
              if (err) errors.push(`Error inserting ${row.customer_name}: ${err.message}`);
            }
          );
        });
        stmt.finalize(() => {
          fs.unlinkSync(req.file.path);
          if (errors.length > 0) {
            res.status(207).json({ message: 'Partial success', inserted: results.length - errors.length, errors });
          } else {
            res.status(201).json({ message: `Customers imported successfully (${results.length} rows)` });
          }
        });
      });
    })
    .on('error', (err) => {
      console.error('CSV Parse Error (Customers):', err.message);
      fs.unlinkSync(req.file.path);
      res.status(500).json({ error: err.message });
    });
});

app.get('/api/invoices', authenticateToken, (req, res) => {
  db.all('SELECT * FROM invoices', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/invoices', authenticateToken, (req, res) => {
  const {
    customer_id, container_no, container_invoice_no, car_details, vin_no, shipping_towing,
    showroom_commission, attestation, duty, bill, vat, clearing, lifter, total_amount, date
  } = req.body;
  db.get(`SELECT customer_name FROM customers WHERE customer_id = ?`, [customer_id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Customer not found' });
    const customer_name = row.customer_name;

    db.get(`SELECT COUNT(*) as count FROM invoices`, [], (err, countRow) => {
      if (err) return res.status(500).json({ error: err.message });
      const invoiceCount = countRow.count + 1;
      const invoice_no = `INV-${String(invoiceCount).padStart(4, '0')}`;

      db.run(
        `INSERT INTO invoices (customer_id, customer_name, invoice_no, container_no, container_invoice_no, car_details, vin_no, shipping_towing, showroom_commission, attestation, duty, bill, vat, clearing, lifter, total_amount, date) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [customer_id, customer_name, invoice_no, container_no, container_invoice_no, car_details, vin_no, shipping_towing, showroom_commission, attestation, duty, bill, vat, clearing, lifter, total_amount, date],
        function (err) {
          if (err) return res.status(500).json({ error: err.message });
          res.status(201).json({ invoice_id: this.lastID, invoice_no });
        }
      );
    });
  });
});

app.post('/api/bulk/invoices', authenticateToken, requireAdmin, upload.single('file'), (req, res) => {
  const results = [];
  const errors = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => {
      console.log('Raw CSV Row (Invoices):', data);
      const normalizedData = {};
      for (let key in data) {
        const trimmedKey = key.trim();
        normalizedData[trimmedKey] = (data[key] || '').trim();
      }
      if (!normalizedData.customer_id || !normalizedData.total_amount) {
        errors.push(`Invalid row: ${JSON.stringify(data)} - Missing customer_id or total_amount`);
      } else {
        const cleanNumber = (val) => {
          if (!val || typeof val !== 'string' || /export/i.test(val)) return 0;
          // Handle malformed numbers like "2368..9" by taking first valid number
          const cleaned = val.replace(/[^0-9.]/g, '');
          return parseFloat(cleaned) || 0;
        };
        results.push({
          customer_id: parseInt(normalizedData.customer_id),
          container_no: normalizedData.container_no || null,
          container_invoice_no: normalizedData.container_invoice_no || null,
          car_details: normalizedData.car_details || null,
          vin_no: normalizedData.vin_no || null,
          shipping_towing: cleanNumber(normalizedData.shipping_towing),
          showroom_commission: cleanNumber(normalizedData.showroom_commission),
          attestation: cleanNumber(normalizedData.attestation),
          duty: cleanNumber(normalizedData.duty),
          bill: cleanNumber(normalizedData.bill),
          vat: cleanNumber(normalizedData.vat),
          clearing: cleanNumber(normalizedData.clearing),
          lifter: cleanNumber(normalizedData.lifter),
          total_amount: cleanNumber(normalizedData.total_amount),
          date: normalizedData.date || null
        });
      }
    })
    .on('end', () => {
      console.log('Parsed Results (Invoices):', results);
      console.log('Errors (Invoices):', errors);
      if (results.length === 0) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ error: 'No valid rows found', details: errors });
      }

      db.serialize(() => {
        db.get(`SELECT COUNT(*) as count FROM invoices`, [], (err, countRow) => {
          if (err) return res.status(500).json({ error: err.message });
          let invoiceCount = countRow.count;

          const processRow = (row) => {
            return new Promise((resolve) => {
              db.get(`SELECT customer_name FROM customers WHERE customer_id = ?`, [row.customer_id], (err, customer) => {
                if (err) {
                  errors.push(`Error for row ${JSON.stringify(row)}: ${err.message}`);
                  resolve(null);
                } else if (!customer) {
                  errors.push(`Customer ID ${row.customer_id} not found for row ${JSON.stringify(row)}`);
                  resolve(null);
                } else {
                  invoiceCount++;
                  const invoice_no = `INV-${String(invoiceCount).padStart(4, '0')}`;
                  resolve({ ...row, customer_name: customer.customer_name, invoice_no });
                }
              });
            });
          };

          Promise.all(results.map(processRow)).then((processedRows) => {
            const validRows = processedRows.filter(row => row !== null);
            if (validRows.length === 0) {
              fs.unlinkSync(req.file.path);
              return res.status(400).json({ error: 'No valid rows after customer lookup', details: errors });
            }

            const stmt = db.prepare(`INSERT INTO invoices (customer_id, customer_name, invoice_no, container_no, container_invoice_no, car_details, vin_no, shipping_towing, showroom_commission, attestation, duty, bill, vat, clearing, lifter, total_amount, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
            validRows.forEach(row => {
              stmt.run(
                row.customer_id, row.customer_name, row.invoice_no, row.container_no, row.container_invoice_no, row.car_details, row.vin_no,
                row.shipping_towing, row.showroom_commission, row.attestation, row.duty, row.bill, row.vat, row.clearing, row.lifter, row.total_amount, row.date,
                (err) => {
                  if (err) errors.push(`Error inserting invoice for ${row.customer_id}: ${err.message}`);
                }
              );
            });
            stmt.finalize(() => {
              fs.unlinkSync(req.file.path);
              if (errors.length > 0) {
                res.status(207).json({ message: 'Partial success', inserted: validRows.length - errors.length, errors });
              } else {
                res.status(201).json({ message: `Invoices imported successfully (${validRows.length} rows)` });
              }
            });
          });
        });
      });
    })
    .on('error', (err) => {
      console.error('CSV Parse Error (Invoices):', err.message);
      fs.unlinkSync(req.file.path);
      res.status(500).json({ error: err.message });
    });
});

app.get('/api/payments', authenticateToken, (req, res) => {
  db.all('SELECT * FROM payments', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/payments', authenticateToken, (req, res) => {
  const { customer_id, amount_received, received_by, date } = req.body;
  db.get(`SELECT COUNT(*) as count FROM payments`, [], (err, countRow) => {
    if (err) return res.status(500).json({ error: err.message });
    const paymentCount = countRow.count + 1;
    const payment_no = `PAY-${String(paymentCount).padStart(4, '0')}`;

    db.run(
      `INSERT INTO payments (customer_id, payment_no, amount_received, received_by, date) VALUES (?, ?, ?, ?, ?)`,
      [customer_id, payment_no, amount_received, received_by, date],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ payment_id: this.lastID, payment_no });
      }
    );
  });
});

app.post('/api/bulk/payments', authenticateToken, requireAdmin, upload.single('file'), (req, res) => {
  const results = [];
  const errors = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => {
      console.log('Raw CSV Row (Payments):', data);
      const normalizedData = {};
      for (let key in data) {
        const trimmedKey = key.trim();
        normalizedData[trimmedKey] = (data[key] || '').trim();
      }
      if (!normalizedData.customer_id) {
        errors.push(`Invalid row: ${JSON.stringify(data)} - Missing customer_id`);
      } else {
        const amount_received = normalizedData.amount_received ? parseFloat(normalizedData.amount_received.replace(/,/g, '')) || 0 : 0;
        results.push({
          customer_id: parseInt(normalizedData.customer_id),
          amount_received,
          received_by: normalizedData.received_by || null,
          date: normalizedData.date || null
        });
      }
    })
    .on('end', () => {
      console.log('Parsed Results (Payments):', results);
      console.log('Errors (Payments):', errors);
      if (results.length === 0) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ error: 'No valid rows found', details: errors });
      }

      db.serialize(() => {
        db.get(`SELECT COUNT(*) as count FROM payments`, [], (err, countRow) => {
          if (err) return res.status(500).json({ error: err.message });
          let paymentCount = countRow.count;

          const stmt = db.prepare(`INSERT INTO payments (customer_id, payment_no, amount_received, received_by, date) VALUES (?, ?, ?, ?, ?)`);
          results.forEach(row => {
            paymentCount++;
            const payment_no = `PAY-${String(paymentCount).padStart(4, '0')}`;
            stmt.run(
              row.customer_id, payment_no, row.amount_received, row.received_by, row.date,
              (err) => {
                if (err) errors.push(`Error inserting payment for ${row.customer_id}: ${err.message}`);
              }
            );
          });
          stmt.finalize(() => {
            fs.unlinkSync(req.file.path);
            if (errors.length > 0) {
              res.status(207).json({ message: 'Partial success', inserted: results.length - errors.length, errors });
            } else {
              res.status(201).json({ message: `Payments imported successfully (${results.length} rows)` });
            }
          });
        });
      });
    })
    .on('error', (err) => {
      console.error('CSV Parse Error (Payments):', err.message);
      fs.unlinkSync(req.file.path);
      res.status(500).json({ error: err.message });
    });
});

app.delete('/api/payments/:id', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;
  const deleted_at = new Date().toISOString().split('T')[0];
  const deleted_by = req.user.username;

  db.get(`SELECT payment_id, customer_id, amount_received FROM payments WHERE payment_id = ?`, [id], (err, payment) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!payment) return res.status(404).json({ error: 'Payment not found' });

    db.get(`SELECT customer_name FROM customers WHERE customer_id = ?`, [payment.customer_id], (err, customer) => {
      if (err) return res.status(500).json({ error: err.message });
      const customer_name = customer ? customer.customer_name : 'Unknown';

      db.run(
        `INSERT INTO deleted_payments (payment_id, customer_name, amount_received, deleted_by, deleted_at) VALUES (?, ?, ?, ?, ?)`,
        [payment.payment_id, customer_name, payment.amount_received, deleted_by, deleted_at],
        (err) => {
          if (err) return res.status(500).json({ error: err.message });

          db.run(`DELETE FROM payments WHERE payment_id = ?`, [id], function (err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0) return res.status(404).json({ error: 'Payment not found' });
            res.status(200).json({ message: 'Payment deleted and logged' });
          });
        }
      );
    });
  });
});

app.get('/api/deleted_invoices', authenticateToken, requireAdmin, (req, res) => {
  db.all('SELECT * FROM deleted_invoices', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/deleted_payments', authenticateToken, requireAdmin, (req, res) => {
  db.all('SELECT * FROM deleted_payments', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});