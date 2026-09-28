const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,

  email: String,
  loginId: { type: String, unique: true, sparse: true },

  password: { type: String, required: true },

  role: {
    type: String,
    enum: ["admin", "teacher", "student"],
    required: true
  },

  // Department a teacher is assigned to (teacher role only)
  department: String
}, { timestamps: true });

// Same email may belong to different role accounts (e.g. one person testing
// both an admin and a teacher login), but not to two accounts of the same role.
userSchema.index(
  { email: 1, role: 1 },
  { unique: true, partialFilterExpression: { email: { $exists: true } } }
);

module.exports = mongoose.model("User", userSchema);
