const express = require("express");

const {
  registerUser,
  loginUser,
  loginAdmin,
} = require("../controllers/authController");

const router = express.Router();


// User Register
router.post("/register", registerUser);


// User Login
router.post("/login", loginUser);


// Admin Login
router.post("/admin-login", loginAdmin);


module.exports = router;