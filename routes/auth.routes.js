const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validator = require("express-joi-validation").createValidator({});

const authController = require("../controllers/auth/auth.controllers");
const auth = require("../middlewares/auth");

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(12).required(),
  password: Joi.string().min(6).required(),
  mail: Joi.string().email().required(),
});

const loginSchema = Joi.object({
  password: Joi.string().min(6).required(),
  mail: Joi.string().email().required(),
});

router.post(
  "/register",
  validator.body(registerSchema),
  authController.controllers.postRegister
);

router.post(
  "/login",
  validator.body(loginSchema),
  authController.controllers.postLogin
);

// test route to verify if our middleware is working properly
router.get("/test", auth, (req, res) => {
  res.send({ message: "Request valid." });
});

module.exports = router;
