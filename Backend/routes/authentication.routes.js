const express = require("express");
const {
  registerUser,
  loginUser,
} = require("../controllers/Auth.controller.js");

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

module.exports = router;
