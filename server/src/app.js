const express = require("express");
const createError = require("http-errors");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const helmet = require("helmet");

//import
const applyCors = require("./middlewares/corsHandler");
const { errorResponse } = require("./controllers/responseController");
const seedRouter = require("./routes/seedRouter");

const app = express();

// ✅ CORS middleware প্রয়োগ করুন
applyCors(app);

// ✅ Other middleware
app.use(cookieParser());
app.use(morgan("dev"));
app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

// ✅ Rate limiter
const limiter = rateLimit({
  windowMs: 5000 * 60 * 1000,
  max: 5000,
  message: "Too many requests. Please try again later.",
});
app.use(limiter);

//Route
app.use("/api/seed", seedRouter);

// ✅ 404 handler

app.use((req, res, next) => {
  next(createError(404, "Route not found"));
});

//Global error handler

app.use((err, req, res, next) => {
  return errorResponse(res, {
    statusCode: err.status || 500,
    message: err.message || "Internal server error",
  });
});

module.exports = app;
