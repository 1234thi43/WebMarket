const mongoose = require("mongoose");
const ROLES = require("../constants/roles");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: Number, default: ROLES.USER },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
