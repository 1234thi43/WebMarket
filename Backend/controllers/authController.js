const { register, login } = require("./user");
const mapUser = require("../helpers/mapUser");

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const { user, token } = await register(name, email, password);

    // res
    // .cookie("token", token, {
    //   httpOnly: true,
    //   secure: false,
    //   sameSite: "lax",
    //   maxAge: 30 * 24 * 60 * 60 * 1000,
    // })
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      })

      .send({ success: true, user: mapUser(user) });
  } catch (err) {
    console.error("❌ Registration error:", err.message);
    res.status(400).send({ success: false, error: err.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await login(email, password);

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      })
      .send({ success: true, user: mapUser(user) });
  } catch (err) {
    console.error("❌ Login error:", err.message);
    res.status(400).send({ success: false, error: err.message });
  }
};
