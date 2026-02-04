require("dotenv").config();
const app = require("./src/app");
const connectDatabase = require("./src/config/db");
const logger = require("./src/controllers/loggerController");
const { serverPort } = require("./src/secret");

const PORT = serverPort;

const startServer = async () => {
  try {
    await connectDatabase(); // ✅ DB connect আগে
    app.listen(PORT, () => {
      logger.log("info", `http://localhost:${PORT}`);
    });
  } catch (err) {
    logger.log("error", "Failed to start server:", err.message);
  }
};

startServer();
