const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: String,
  price: Number,
  description: String,
  image: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  quantity: { type: Number, default: 1 },
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model("Product", productSchema);
