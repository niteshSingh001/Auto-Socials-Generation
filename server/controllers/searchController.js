// controllers/searchController.js
const puppeteerUtils = require("../utils/puppeteerUtils");
const Company = require("../models/Company");

exports.search = async (req, res) => {
  try {
    // Get input data from the request body
    const { companies } = req.body;

    // Use Puppeteer to scrape LinkedIn for each company data
    const companyData = await puppeteerUtils.scrapeLinkedIn(companies);

    // Store scraped data in MongoDB, updating existing entries if necessary
    const bulkOps = companyData.map((data) => ({
      updateOne: {
        filter: { domain: data.domain },
        update: { $set: data },
        upsert: true, // Insert new documents if domain doesn't exist
      },
    }));

    // Perform bulk write operation
    await Company.bulkWrite(bulkOps);

    res.json({ success: true, data: companyData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};
