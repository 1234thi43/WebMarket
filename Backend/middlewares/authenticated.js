const { verify } = require("../helpers/token");
const User = require("../models/User");

module.exports = async function (req, res, next) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).send({ error: "No token provided" });
    }

    // Проверяем токен через token.js
    const tokenData = verify(token);

    const user = await User.findById(tokenData.id);
    if (!user) {
      return res.status(401).send({ error: "Authenticated user not found" });
    }

    req.user = user;
    next();
  } catch (e) {
    console.error("Auth error:", e.message);
    res.status(401).send({ error: "Invalid or expired token" });
  }
};
