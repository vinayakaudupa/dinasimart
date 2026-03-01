const express = require('express');
const cors = require('cors');
const db = require('./database');
const { Category, Item, Shop } = require('./models');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// API Endpoints

app.get('/', (req, res) => {
    res.send('DinasiMart API is running');
});

// Get all categories
app.get('/api/categories', (req, res) => {
    res.json({
        "message": "success",
        "data": Category.findAll()
    });
});

// Search items with autocomplete
app.get('/api/search', (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.json({ data: [] });
    }
    res.json({
        "message": "success",
        "data": Item.search(query)
    });
});

// Get shops that have a specific item, sorted by distance
app.get('/api/items/:id/shops', (req, res) => {
    const itemId = req.params.id;
    res.json({
        "message": "success",
        "data": Shop.findByItemId(itemId)
    });
});

// Get related items (same category)
app.get('/api/items/:id/related', (req, res) => {
    const itemId = req.params.id;
    const item = Item.findById(itemId);

    if (!item) {
        return res.status(400).json({ "error": "Item not found" });
    }

    res.json({
        "message": "success",
        "data": Item.findRelated(itemId, item.category_id)
    });
});

// Add to Cart (Persistent)
app.post('/api/cart', (req, res) => {
    const { itemId, shopId, price, quantity } = req.body;

    // Check if item from SAME shop is already in cart
    db.get("SELECT * FROM cart_items WHERE item_id = ? AND shop_id = ?", [itemId, shopId], (err, row) => {
        if (row) {
            const newQuantity = row.quantity + quantity;
            db.run("UPDATE cart_items SET quantity = ? WHERE id = ?", [newQuantity, row.id], function (err) {
                if (err) return res.status(400).json({ "error": err.message });
                res.json({ "message": "updated", data: { itemId, quantity: newQuantity } });
            });
        } else {
            db.run("INSERT INTO cart_items (item_id, shop_id, price, quantity) VALUES (?, ?, ?, ?)", [itemId, shopId, price, quantity], function (err) {
                if (err) return res.status(400).json({ "error": err.message });
                res.json({ "message": "added", data: { itemId, quantity } });
            });
        }
    });
});

// Update Cart Quantity
app.post('/api/cart/update', (req, res) => {
    const { id, quantity } = req.body;
    if (quantity <= 0) {
        db.run("DELETE FROM cart_items WHERE id = ?", [id], function (err) {
            if (err) return res.status(400).json({ "error": err.message });
            res.json({ "message": "deleted", data: { id } });
        });
    } else {
        db.run("UPDATE cart_items SET quantity = ? WHERE id = ?", [quantity, id], function (err) {
            if (err) return res.status(400).json({ "error": err.message });
            res.json({ "message": "updated", data: { id, quantity } });
        });
    }
});


// Clear Cart
app.post('/api/cart/clear', (req, res) => {
    db.run("DELETE FROM cart_items", [], function (err) {
        if (err) return res.status(400).json({ "error": err.message });
        res.json({ "message": "cleared" });
    });
});

// Place Order
app.post('/api/orders', (req, res) => {
    const { orderData, totalPrice } = req.body;

    // Convert orderData object/array to JSON string securely for SQLite
    const orderDataString = JSON.stringify(orderData);

    db.run("INSERT INTO orders (order_data, total_price) VALUES (?, ?)", [orderDataString, totalPrice], function (err) {
        if (err) return res.status(400).json({ "error": err.message });

        const orderId = this.lastID;

        // Clear cart after placing order
        db.run("DELETE FROM cart_items", [], function (err) {
            if (err) console.error("Error clearing cart after order:", err.message);

            res.json({
                "message": "Order placed successfully",
                "data": { id: orderId }
            });
        });
    });
});

// Get Order History
app.get('/api/orders', (req, res) => {
    const sql = "SELECT * FROM orders ORDER BY created_at DESC";
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        });
    });
});


// Get Cart
app.get('/api/cart', (req, res) => {
    db.all("SELECT * FROM cart_items", [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }

        // Map in-memory item and shop names onto the SQL items
        const cartWithDetails = rows.map(ci => {
            const item = Item.findById(ci.item_id);
            const shop = Shop.findById(ci.shop_id);
            return {
                id: ci.id,
                item_id: ci.item_id,
                quantity: ci.quantity,
                price: ci.price,
                shop_id: ci.shop_id,
                name: item ? item.name : 'Unknown Item',
                image: item ? item.image : '',
                shop_name: shop ? shop.name : 'Unknown Shop'
            };
        });

        res.json({
            "message": "success",
            "data": cartWithDetails
        });
    });
});

// Get all items (for Home page display)
app.get('/api/items', (req, res) => {
    res.json({
        "message": "success",
        "data": Item.findAll()
    });
});

// Get single item
app.get('/api/items/:id', (req, res) => {
    const item = Item.findById(req.params.id);
    if (!item) {
        return res.status(400).json({ "error": "Item not found" });
    }
    res.json({
        "message": "success",
        "data": item
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
