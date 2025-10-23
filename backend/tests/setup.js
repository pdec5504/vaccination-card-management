const mongoose = require("mongoose");
require("dotenv").config();
// const connectDB = require("../src/config/database");

module.exports = async () => {
  process.env.NODE_ENV = "test";
  console.log('\n[Global Setup] NODE_ENV defined as "test".');

  const dbNameTest = process.env.DB_NAME_TEST;

  if (
    !process.env.DB_USER ||
    !process.env.DB_PASS ||
    !process.env.DB_HOST ||
    !process.env.DB_PORT ||
    !dbNameTest
  ) {
    console.error(
      "[Global Setup] ERRO DE CONFIGURAÇÃO: Faltam variáveis de base de dados para teste no .env"
    );
    process.exit(1);
  }
  const MONGO_URI_TEST = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${dbNameTest}?authSource=admin`;

  try {
    console.log("[Global Setup] Connecting to test database.");
    await mongoose.connect(MONGO_URI_TEST);
    console.log("[Global Setup] Test database succesfully connected.");
  } catch (error) {
    console.error("[Global Setup] Error connecting to test database:", error);
    process.exit(1);
  }
};
