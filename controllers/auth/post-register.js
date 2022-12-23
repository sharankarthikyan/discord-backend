const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Mongoose model
const User = require("../../models/user.model");

const postRegister = async (req, res) => {
  try {
    const { mail, username, password } = req.body;

    // check if the user is already registered
    const userExists = await User.exists({ mail });

    if (userExists) {
      return res.status(409).send({ message: "E-mail is already registered" });
    }

    // encrypt the password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // create user document and save in database
    const user = await User.create({
      mail: mail.toLowerCase(),
      username,
      password: encryptedPassword,
    });

    // create JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        mail,
      },
      process.env.TOKEN_KEY,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      userDetails: {
        mail: user.mail,
        username,
        token: token,
        _id: user._id,
      },
    });
  } catch (err) {
    return res
      .status(500)
      .send({ message: "Error occurred: Please try again." });
  }
};

module.exports = postRegister;
