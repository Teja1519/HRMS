const app = require("./app");
const { connectDB } = require("./config/database");
require("dotenv").config();
// const cors = require("cors");

// app.use(cors());

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect to database first, then start server
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 HRMS Server running on http://localhost:${PORT}`);
    console.log(`📋 Environment: ${process.env.NODE_ENV}`);
    console.log(`📡 API Base URL: http://localhost:${PORT}/api`);
  });
};

startServer();
