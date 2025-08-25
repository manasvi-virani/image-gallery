const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const connectDB = require("./db");
const imageRoutes = require("./routes/imageRoutes");
const errorHandler = require("./middlewares/errorHandler");

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Routes
app.use("/api/images", imageRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
