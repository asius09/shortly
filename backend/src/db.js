const mongoose = require('mongoose');
const config = require('./config/config');

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUri);
  } catch (err) {
    process.exit(1);
  }
};
module.exports = connectDB;
