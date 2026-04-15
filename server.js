const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// 1. MIDDLEWARE
app.use(express.json());
app.use(cors());

// --- THE SLASH COLLAPSER ---
app.use((req, res, next) => {
    if (req.url.includes('//')) {
        req.url = req.url.replace(/\/\/+/g, '/');
    }
    next();
});

// 2. MONGODB CONNECTION
const MONGO_URI = "mongodb+srv://kelvinowens:Giogi006$1234!@cluster0.ddp1odw.mongodb.net/toccopola_grocery?appName=Cluster0";

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// 3. DATABASE SCHEMA & MODEL
// This treats the entire menu as one array inside a single document
const menuSchema = new mongoose.Schema({
    items: Array 
});
const Menu = mongoose.model('Menu', menuSchema, 'menu');

// 4. API ROUTES

// GET: Returns the items array from the single menu document
app.get('/api/menu', async (req, res) => {
    try {
        const data = await Menu.findOne();
        res.json(data ? data.items : []);
    } catch (err) {
        console.error("GET Error:", err);
        res.status(500).json({ error: "Failed to fetch menu" });
    }
});

// POST: Replaces the entire items array with the new version from Admin
app.post('/api/menu', async (req, res) => {
    try {
        // findOneAndUpdate with upsert:true finds the one document and replaces its 'items' 
        // with the new list. If it doesn't exist, it creates it.
        await Menu.findOneAndUpdate({}, { items: req.body }, { upsert: true, new: true });
        res.status(200).json({ message: "Menu updated successfully" });
    } catch (err) {
        console.error("POST Error:", err);
        res.status(400).json({ message: err.message });
    }
});

// 5. STATIC FILE SERVING
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 6. START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});