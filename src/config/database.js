const mongoose = require("mongoose");
require("dotenv").config();

const isTestEnvironment = procces.env.NODE_ENV === "test";

const MONGO_URI = isTestEnvironment
  ? procces.env.MONGO_URI_TEST
  : `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=admin`;

if (!MONGO_URI) {
  console.error(
    "ERROR: MONGO_URI not defined. Verify .env file or tests configuration."
  );
  procces.exit(1);
}

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
