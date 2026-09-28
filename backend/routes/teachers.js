const express = require("express");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

// ======================================
// ADD TEACHER (ADMIN ONLY)
// ======================================
router.post("/", auth(["admin"]), async (req, res) => {
  try {
    const { name, email, password, department } = req.body;

    if (!name || !email || !password || !department) {
      return res.status(400).json({ message: "Missing required teacher fields" });
    }

    if (await User.findOne({ email, role: "teacher" })) {
      return res.status(400).json({ message: "Teacher email already exists" });
    }

    const teacher = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      role: "teacher",
      department,
    });

    res.json({
      message: "Teacher added successfully",
      teacher: {
        _id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        department: teacher.department,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to add teacher", error: err.message });
  }
});

// ======================================
// GET ALL TEACHERS (ADMIN ONLY)
// ======================================
router.get("/", auth(["admin"]), async (req, res) => {
  try {
    const teachers = await User.find({ role: "teacher" })
      .select("name email department createdAt")
      .sort({ department: 1, name: 1 });
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
