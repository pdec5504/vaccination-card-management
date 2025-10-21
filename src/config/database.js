const mongoose = require("mongoose");
require("dotenv").config();

const isTestEnvironment = process.env.NODE_ENV === "test";

const dbName = isTestEnvironment
  ? process.env.DB_NAME_TEST
  : process.env.DB_NAME;

if (
  !process.env.DB_USER ||
  !process.env.DB_PASS ||
  !process.env.DB_HOST ||
  !process.env.DB_PORT ||
  !dbName
) {
  console.error("Configuration Error: Variables on .env file are missing.");
  process.exit(1);
}

const MONGO_URI = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${dbName}?authSource=admin`;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    if (!isTestEnvironment) {
      console.log("Database connected.");
    }
  } catch (error) {
    console.error("Error connecting to database:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
