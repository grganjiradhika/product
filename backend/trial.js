// const express = require("express");
// const { MongoClient, ObjectId } = require("mongodb");
// const cors = require("cors");
// require("dotenv").config();

// const app = express();
// app.use(cors());
// app.use(express.json());
// const client = new MongoClient(process.env.MONGO_URI);
// let db, usersCollection;

// async function connectDB() {
//     await client.connect();
//     db = client.db(process.env.DB_NAME);
//     usersCollection = db.collection("Users");
//     console.log("✅ MongoDB Connected");
// }
// connectDB();


// // Start Server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`🚀 Server running on port ${PORT}`);
// });