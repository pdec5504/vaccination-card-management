const app = require("./app");
const connectDB = require("./config/database");

const PORT = process.env.PORT;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, async () => {
      if (process.env.NODE_ENV !== "test") {
        console.log(`Server is running on port ${PORT}`);
      }
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
