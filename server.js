const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Define a Schema
const dataSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  country: { type: String, required: true },
  district: { type: String, required: true },
});

const Data = mongoose.model("Data", dataSchema);

// Routes
app.post("/submit", async (req, res) => {
  try {
    const { firstName, lastName, country, district } = req.body;

    // Check if all required fields are present
    if (!firstName || !lastName || !country || !district) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newData = new Data({ firstName, lastName, country, district });
    await newData.save();
    res.status(201).json({ message: "Data saved successfully" });
  } catch (error) {
    console.error("Error saving data:", error); // Log the error for debugging
    res.status(500).json({ error: "Failed to save data" });
  }
});

app.get("/", (req, res) => {
  res.send("Quamin Backend is running");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
