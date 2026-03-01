const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DBSOURCE = path.join(__dirname, "db.sqlite");

const db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        console.error(err.message);
        throw err;
    } else {
        console.log('Connected to the SQLite database.');
        initDatabase();
    }
});

function initDatabase() {
    db.serialize(() => {
        // Cart - Rebuilt without strict foreign keys to in-memory items/shops
        db.run(`CREATE TABLE IF NOT EXISTS cart_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            item_id INTEGER,
            shop_id INTEGER,
            quantity INTEGER,
            price REAL
        )`);

        // Orders
        db.run(`CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_data TEXT,
            total_price REAL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        console.log('SQLite database initialized for Cart and Orders persistence.');
    });
}

module.exports = db;
