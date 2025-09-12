const mongoose = require("mongoose");
const config = require("./config/config");

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log("Database connected successfully");
  } catch (err) {
    console.error("Failed to connect Database", err);
    process.exit(1);
    // In serverless or edge environments, process.exit may not be available or recommended.
  }
};
module.exports = connectDB;