const dns = require("dns");
const mongoose = require("mongoose");
require("dotenv").config();

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw error;
  }
};

module.exports = connectDB;
