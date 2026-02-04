require("dotenv").config();

// Server
const serverPort = process.env.SERVER_PORT || 5000;

// Database
const mongodbURL = process.env.MONGO_URL || "mongodb://localhost:27017/";

// Image
const defaultImagePath =
  process.env.DEFAULT_USER_IMAGE_PATH ||
  "/server/public/images/users/default.jpg";

// JWT Keys
const jwtActivationKey =
  process.env.JWT_ACTIVATION_KEY || "activation_fallback";
const jwtAccessKey = process.env.JWT_ACCESS_KEY || "access_fallback";
const jwtRefreshKey = process.env.JWT_REFRESH_KEY || "refresh_fallback";
const jwtResetPasswordKey =
  process.env.JWT_RESET_PASSWORD_KEY || "reset_fallback";
const jwtAdminAccessKey =
  process.env.JWT_ADMIN_ACCESS_KEY || "access_admin_fallback";
const jwtAdminRefreshKey =
  process.env.JWT_ADMIN_REFRESH_KEY || "refresh_admin_fallback";

// Email (SMTP)
const smtpUsername = process.env.SMTP_USERNAME || "";
const smtpPassword = process.env.SMTP_PASSWORD || "";

// Cloudinary
const cloudinaryName = process.env.CLOUDINARY_NAME || "";
const cloudinaryApiKey = process.env.CLOUDINARY_API || "";
const cloudinarySecret = process.env.CLOUDINARY_SECRET || ""; // Corrected spelling

// Environment
const nodeEnv = process.env.NODE_ENV || "development";

// Google OAuth
const clientId = process.env.GOOGLE_CLIENT_ID || "";
const clientSecret = process.env.GOOGLE_CLIENT_SECRET || "";
const callbackURL = process.env.GOOGLE_CALLBACK_URL || "";

// Client URL (frontend)
const clientURL =
  nodeEnv === "production"
    ? process.env.CLIENT_URL || "https://ecomerce-zone1.netlify.app"
    : "http://localhost:5173";

// Final Export
module.exports = {
  serverPort,
  mongodbURL,
  defaultImagePath,
  jwtActivationKey,
  jwtAccessKey,
  jwtRefreshKey,
  jwtResetPasswordKey,
  jwtAdminAccessKey,
  jwtAdminRefreshKey,
  smtpUsername,
  smtpPassword,
  clientURL,
  cloudinaryName,
  cloudinaryApiKey,
  cloudinarySecret,
  nodeEnv,
  clientId,
  clientSecret,
  callbackURL,
};
