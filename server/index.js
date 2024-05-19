const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const searchRoutes = require("./routes/searchRoutes");
const mongoose = require("mongoose");
const Company = require("./models/Company");
require("dotenv").config();
const companyRoutes = require("./routes/companyRoutes");

const app = express();
app.use(cors());

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
  }
};

connectDB();

// Middleware
app.use(bodyParser.json());

// Routes
app.use("/search", searchRoutes);

app.use("/getLinkedinData", companyRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
