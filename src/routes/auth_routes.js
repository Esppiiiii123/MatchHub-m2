const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth_controller");

// Importamos la seguridad
const { registerRules, loginRules } = require("../validators/auth_validators");
const validate = require("../middlewares/validate"); // Tu recolector de errores 

// 🛡️ La ruta ahora tiene escolta antes de llegar al controlador
router.post("/register", registerRules, validate, authController.register);
router.post("/login", loginRules, validate, authController.login);

module.exports = router;