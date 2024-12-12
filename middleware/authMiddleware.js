const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Expecting "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "Authorization token required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to the request object
    next(); // Pass control to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
