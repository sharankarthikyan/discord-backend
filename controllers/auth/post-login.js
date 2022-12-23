const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Mongoose model
const User = require("../../models/user.model");

const postLogin = async (req, res) => {
  try {
    const { mail, password } = req.body;

    const user = await User.findOne({
      mail: mail.toLowerCase(),
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Send token
      const token = jwt.sign(
        {
          userId: user._id,
          mail,
        },
        process.env.TOKEN_KEY,
        { expiresIn: "24h" }
      );

      return res.status(200).json({
        userDetails: {
          mail: user.mail,
          token: token,
          username: user.username,
          _id: user._id,
        },
      });
    }

    return res
      .status(400)
      .send({ message: "Invalid credentials. Please try again." });
  } catch (err) {
    return res
      .status(500)
      .send({ message: "Something went wrong. Please try again.", error: err });
  }
};

module.exports = postLogin;
