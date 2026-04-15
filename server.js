const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

// Serve your static HTML files
app.use(express.static(path.join(__dirname, 'public'))); 

// REPLACE with your actual MongoDB Connection String from Atlas
const MONGO_URI = "mongodb+srv://kelvinowens:Giogi006$1234!@cluster0.ddp1odw.mongodb.net/?appName=Cluster0";

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Define the Schema
const menuSchema = new mongoose.Schema({
    items: Array // We will store the menu array here
});

const Menu = mongoose.model('Menu', menuSchema);

// ROUTE: Get the menu
app.get('/api/menu', async (req, res) => {
    try {
        const data = await Menu.findOne();
        res.json(data ? data.items : []);
    } catch (err) {
        res.status(500).send(err);
    }
});

// ROUTE: Save the menu
app.post('/api/menu', async (req, res) => {
    try {
        let data = await Menu.findOne();
        if (!data) {
            data = new Menu({ items: req.body });
        } else {
            data.items = req.body;
        }
        await data.save();
        res.status(200).send({ message: "Saved Successfully" });
    } catch (err) {
        res.status(500).send(err);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));