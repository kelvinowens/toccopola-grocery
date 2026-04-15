const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// 1. MIDDLEWARE
app.use(express.json());
app.use(cors());

// --- THE SLASH COLLAPSER ---
// This fixes the "//api/menu" issue by forcing double slashes into single slashes
app.use((req, res, next) => {
    if (req.url.includes('//')) {
        req.url = req.url.replace(/\/\/+/g, '/');
    }
    next();
});

// 2. MONGODB CONNECTION
// Replace <password> with your actual database user password
const MONGO_URI = "mongodb+srv://kelvinowens:Giogi006$1234!@cluster0.mongodb.net/toccopola_grocery?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// 3. DATABASE SCHEMA & MODEL
const menuSchema = new mongoose.Schema({
    items: Array 
});
const Menu = mongoose.model('Menu', menuSchema, 'menu');

// 4. API ROUTES (Placed before static files to prevent 404s)

// GET the menu data
app.get('/api/menu', async (req, res) => {
    try {
        const data = await Menu.findOne();
        res.json(data ? data.items : []);
    } catch (err) {
        console.error("GET Error:", err);
        res.status(500).json({ error: "Failed to fetch menu" });
    }
});

// SAVE the menu data
app.post('/api/menu', async (req, res) => {
    try {
        let data = await Menu.findOne();
        if (!data) {
            data = new Menu({ items: req.body });
        } else {
            data.items = req.body;
        }
        await data.save();
        res.status(200).json({ message: "Saved successfully" });
    } catch (err) {
        console.error("POST Error:", err);
        res.status(500).json({ error: "Failed to save menu" });
    }
});

// 5. STATIC FILE SERVING
app.use(express.static(path.join(__dirname, 'public')));

// Explicitly serve index.html for the main URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 6. START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});