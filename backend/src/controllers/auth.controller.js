import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

// Signup
export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    // Validate the provided input fields
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate the password length
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    // Check if a user with the given email already exists
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Generate salt and hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new User instance
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      // Generate a JWT token for the new user
      generateToken(newUser._id, res);
      // Save the new user to the database
      await newUser.save();

      // Return the newly created user in JSON format
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      // Handle case where new user data is invalid
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    // Log any errors and return a 500 status with an "Internal Server Error" message
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Login
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if the user exists
    const user = await User.findOne({ email });

    if (!user) {
      // If the user does not exist, return an error
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if the password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      // If the password is incorrect, return an error
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate a JWT token for the user
    generateToken(user._id, res);

    // Return the logged in user in JSON format
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    // If there is an error, log it and return a 500 error
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Logout
export const logout = (req, res) => {
  try {
    // Clear the JWT cookie
    res.cookie("jwt", "", { maxAge: 0 });

    // Return a 200 status with a "Logged out successfully" message
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    // Log any errors and return a 500 status with an "Internal Server Error" message
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
