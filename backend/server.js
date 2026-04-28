const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGO_URI);

let db, usersCollection;

// Connect to MongoDB
async function connectDB() {
    await client.connect();
    db = client.db("DB_NAME");
    usersCollection = db.collection("Users");
    console.log("✅ MongoDB Connected");
}
connectDB();

// 🟢 CREATE (POST)
app.post("/users", async (req, res) => {
    try {
        const user = req.body;
        if (!user.name || !user.phone) {
            return res.status(400).json({ message: "Name and phone required" });
        }
        const result = await usersCollection.insertOne(user);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// 🔵 READ ALL (GET)
app.get("/getusers", async (req, res) => {
    try {
        const users = await usersCollection.find().toArray();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// 🔵 READ ONE (GET by ID)
app.get("/users/:id", async (req, res) => {
    try {
        const user = await usersCollection.findOne({
            _id: new ObjectId(req.params.id)
        });

        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// 🟡 UPDATE (PUT)
app.put("/users/:id", async (req, res) => {
    try {
        const result = await usersCollection.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: req.body }
        );

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// 🔴 DELETE (DELETE)
app.delete("/users/:id", async (req, res) => {
    try {
        const result = await usersCollection.deleteOne({
            _id: new ObjectId(req.params.id)
        });

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});