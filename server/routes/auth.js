import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js"; // Assuming User model is also an ES module
import bcrypt from "bcryptjs"; // Import bcryptjs

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.create({ email, password });
    res.status(201).json({ message: "User registered" });
  } catch (error) {
    if (
      error.code === 11000 &&
      error.keyPattern &&
      error.keyPattern.email === 1
    ) {
      // Check for duplicate key error on email field specifically
      return res
        .status(400)
        .json({ error: "An account with this email address already exists." });
    }
    // For other errors, return the original error message (for now)
    res.status(400).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.json({ token });
});

export default router;
