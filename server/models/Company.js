const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  domain: {
    type: String,
    required: true,
    unique: true,
  },
  linkedinProfile: {
    type: String,
    required: true,
  },
  employeeCount: {
    type: String,
    required: true,
  },
  followersCount: {
    type: String,
    required: true,
  },
});

const Company = mongoose.model("Company", companySchema);

module.exports = Company;
