const JWT = require("jsonwebtoken");

// Middleware function to check for valid tokens
const tokenChecker = (req, res, next) => {
  const authHeader = req.get("Authorization") || req.get("authorization");

  if (!authHeader?.startsWith("Bearer "))
    return res.status(401).json({ message: "Unauthorized" });

  const token = authHeader.slice(7);

  JWT.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) return res.status(401).json({ message: "Unauthorized" });

    req.user_id = payload.user_id;
    next();
  });
};

module.exports = tokenChecker;
