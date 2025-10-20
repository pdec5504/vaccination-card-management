const app = require("./app");
const PORT = 3000;

const startServer = async () => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
