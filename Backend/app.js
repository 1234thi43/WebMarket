
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const port = process.env.PORT || 5000;

// === Middleware ===
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// === Статические файлы (картинки товаров) ===
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// === Подключаем маршруты ===
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);

// === Проверка API ===
app.get("/", (req, res) => res.send("✅ WebMarket API running"));

// === Подключение к MongoDB ===
mongoose
  .connect(process.env.DB_CONNECTION_STRING, { dbName: "WebMarket" })
  .then(() =>
    app.listen(port, () => console.log(`🚀 Server running on port ${port}`))
  )
  .catch((err) => console.error("❌ DB Error:", err));
