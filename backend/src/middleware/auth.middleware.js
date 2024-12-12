import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

/**
 * Middleware to protect routes by verifying JWT tokens.
 * It checks the presence and validity of JWT tokens in cookies.
 * If valid, it attaches the user object to the request object.
 * Otherwise, it returns an appropriate error response.
 */
export const protectRoute = async (req, res, next) => {
  try {
    // Retrieve the JWT token from request cookies
    const token = req.cookies.jwt;

    // Check if token is not present
    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No Token Provided" });
    }

    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the token is invalid
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    // Find user by ID from the decoded token, excluding the password field
    const user = await User.findById(decoded.userId).select("-password");

    // Check if user is not found
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Attach the user to the request object
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Log the error and send a 500 Internal Server Error response
    console.log("Error in protectRoute middleware: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
