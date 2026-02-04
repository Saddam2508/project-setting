// middlewares/corsHandler.js
const cors = require("cors");

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:3001",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
};

const applyCors = (app) => {
  try {
    app.use(cors(corsOptions));

    // ✅ Preflight only for API routes or root
    app.options(/^\/api\/.*/, cors(corsOptions));
    // অথবা app.options("/", cors(corsOptions));

    app.get("/api/test", (req, res) => {
      res.json({ message: "CORS working ✅" });
    });

    console.log("✅ CORS middleware applied successfully.");
  } catch (error) {
    console.error("❌ Failed to apply CORS middleware:", error.message);
  }
};

module.exports = applyCors;
