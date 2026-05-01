import rateLimit from "express-rate-limit";

// General API Rate Limiter
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 6000, // 15 minutes
  limit: 500,
  message: {
    succuss: false,
    message: "Too many requests, please try again after some time.",
  },
});

// Auth Rate Limiter (Login/Register)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5,
  message: {
    succuss: false,
    message: "Too many login attempts. Try again after 15 minutes.",
  },
});

export default { rateLimiter, authLimiter };
