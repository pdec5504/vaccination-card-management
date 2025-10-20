const app = require("./app");
const connectDB = require("./config/database");
const PORT = process.env.PORT;

const startServer = async () => {
  app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
