const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth_controller");

// Declaramos el endpoint de registro directo
router.post("/register", authController.register);

module.exports = router;