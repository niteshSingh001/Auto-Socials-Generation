// routes/companyRoutes.js
const express = require("express");
const router = express.Router();
const Company = require("../models/Company");

// Route to fetch all company data
router.get("/", async (req, res) => {
  try {
    // Fetch all company data from the database
    const companies = await Company.find({});

    // Send the company data as a response
    res.json({ success: true, data: companies });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

module.exports = router;
