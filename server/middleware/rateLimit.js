const rateLimit = require("express-rate-limit");

// 5 scans per IP per hour, matching the free PageSpeed API's quota-friendly usage.
const scanRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error:
      "You've reached the limit of 5 scans per hour. Please try again later.",
  },
});

module.exports = { scanRateLimiter };
