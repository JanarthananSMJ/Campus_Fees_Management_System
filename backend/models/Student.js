const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: String,
  dob: Date,
  gender: String,

  department: String,
  course: String,

  rollNumber: { type: String, required: true }, // ✅ keep this

  // ❌ REMOVE enrollmentNumber completely

  address: String,

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);
