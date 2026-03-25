import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {

  let token;

  // Check header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {

    try {

      // Extract token
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from DB
      const user = await User.findById(decoded.id).select("-password");

      // Attach user to request
      req.user = user;

      next(); // go to controller

    } catch (error) {
      return res.status(401).json({ message: "Not authorized" });
    }

  }

  if (!token) {
    return res.status(401).json({ message: "No token" });
  }
};