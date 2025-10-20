const mongoose = require("mongoose");
require("dotenv").config();

const MONGO_URI = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=admin`;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Database connected.");
  } catch (error) {
    console.error("Error connecting to database:", error.massage);
    process.exit(1);
  }
};

module.exports = connectDB;
