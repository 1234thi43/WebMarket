const express = require("express");
const router = express.Router();
const User = require("../models/User");
const ROLES = require("../constants/roles");
const authenticated = require("../middlewares/authenticated");

router.get("/me", authenticated, (req, res) => {
  res.send({ success: true, user: req.user });
});

router.get("/", authenticated, async (req, res) => {
  try {
    if (req.user.role !== ROLES.ADMIN)
      return res.status(403).send({ error: "Access denied" });

    const users = await User.find({}, "-password");
    res.send({ data: users });
  } catch (err) {
    console.error("❌ Get users error:", err);
    res.status(500).send({ error: "Server error" });
  }
});

// === Получаем список ролей ===
router.get("/roles", authenticated, (req, res) => {
  if (req.user.role !== ROLES.ADMIN)
    return res.status(403).send({ error: "Access denied" });

  const roles = [
    { id: ROLES.ADMIN, name: "Администратор" },
    { id: ROLES.SELLER, name: "Продавец" },
    { id: ROLES.USER, name: "Пользователь" },
  ];
  res.send({ data: roles });
});

// === Изменяем роль пользователя ===
router.patch("/:id", authenticated, async (req, res) => {
  try {
    if (req.user.role !== ROLES.ADMIN)
      return res.status(403).send({ error: "Access denied" });

    const { id } = req.params;
    const { role } = req.body;

    if (![ROLES.ADMIN, ROLES.SELLER, ROLES.USER].includes(role)) {
      return res.status(400).send({ error: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select("-password");
    res.send({ success: true, data: user });
  } catch (err) {
    console.error("❌ Update user role error:", err);
    res.status(500).send({ error: "Server error" });
  }
});

router.delete("/:id", authenticated, async (req, res) => {
  try {
    if (req.user.role !== ROLES.ADMIN)
      return res.status(403).send({ error: "Access denied" });

    await User.findByIdAndDelete(req.params.id);
    res.send({ success: true });
  } catch (err) {
    console.error("❌ Delete user error:", err);
    res.status(500).send({ error: "Server error" });
  }
});

module.exports = router;
