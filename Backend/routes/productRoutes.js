const express = require("express");
const router = express.Router();
const multer = require("multer");
const Product = require("../models/Product");

// === Хранилище для изображений ===
const upload = multer({ dest: "uploads/" });

// === Создание товара ===
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, description, price, category, userId } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const product = await Product.create({
      title,
      description,
      price,
      category,
      image,
      userId,
      isActive: true,
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    console.error("Ошибка при создании товара:", error);
    res.status(500).json({ success: false, message: "Ошибка сервера" });
  }
});

// === Получить товары конкретного пользователя ===
router.get("/user/:userId", async (req, res) => {
  try {
    const products = await Product.find({ userId: req.params.userId });
    res.json({ success: true, products });
  } catch (error) {
    console.error("Ошибка при получении товаров:", error);
    res.status(500).json({ success: false });
  }
});

// === Получить все товары (для главной страницы) ===
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ success: true, products });
  } catch (error) {
    console.error("Ошибка при получении всех товаров:", error);
    res.status(500).json({ success: false });
  }
});

// === Получить товар по ID ===
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Товар не найден" });
    }
    res.json({ success: true, product });
  } catch (error) {
    console.error("Ошибка при получении товара:", error);
    res.status(500).json({ success: false, message: "Ошибка сервера" });
  }
});

// === Удалить товар ===
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error("Ошибка при удалении товара:", error);
    res.status(500).json({ success: false });
  }
});

// === Редактировать товар ===
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { title, description, price, category } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : req.body.image;

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { title, description, price, category, image },
      { new: true }
    );

    res.json({ success: true, product: updated });
  } catch (error) {
    console.error("Ошибка при обновлении товара:", error);
    res.status(500).json({ success: false });
  }
});

// === Изменить активность товара ===
router.patch("/:id/toggle", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Товар не найден" });

    product.isActive = !product.isActive;
    await product.save();

    res.json({ success: true, product });
  } catch (error) {
    console.error("Ошибка при переключении активности товара:", error);
    res.status(500).json({ success: false });
  }
});

module.exports = router;
