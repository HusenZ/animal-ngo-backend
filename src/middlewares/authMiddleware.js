// middlewares/authMiddleware.js
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    // Check if Authorization header exists
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized - no token provided" });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized - invalid token" });
      }

      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role || null,
      };

      next(); // Continue to the controller
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error in auth middleware" });
  }
};
