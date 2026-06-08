const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth_controller");

// Importamos la seguridad
const { registerRules } = require("../validators/auth_validators");
const validate = require("../middlewares/validate"); // Tu recolector de errores del Día 27

// 🛡️ La ruta ahora tiene escolta antes de llegar al controlador
router.post("/register", registerRules, validate, authController.register);

module.exports = router;