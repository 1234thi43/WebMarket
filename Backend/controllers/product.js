import Product from "../models/Product.js";

export const createProduct = async (req, res) => {
  try {
    const { title, description, price, category } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    if (!title || !description || !price || !category) {
      return res
        .status(400)
        .json({ success: false, message: "Все поля обязательны" });
    }

    const product = new Product({
      title,
      description,
      price,
      category,
      image,
      createdBy: req.user.id, 
    });

    await product.save();

    res.status(201).json({ success: true, product });
  } catch (error) {
    console.error("Ошибка при создании товара:", error);
    res.status(500).json({ success: false, message: "Ошибка сервера" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const updateData = {
      title: req.body.title,
      category: req.body.category,
      price: req.body.price,
      description: req.body.description,
    };

    if (req.file) {
      updateData.image = req.file.path;
    }

    const updated = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.send({ success: true, product: updated });
  } catch (err) {
    res.status(400).send({ success: false, error: err.message });
  }
};
