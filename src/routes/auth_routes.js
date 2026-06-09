import express from "express";
const router = express.Router();
import * as authController from "../controllers/auth_controller.js";
import verifyToken from "../middlewares/verifyToken.js"; // Importamos las funciones del controlador de autenticación

// Importamos la seguridad
import { registerRules, loginRules } from "../validators/auth_validators.js"; // Reglas de validación para registro y login
import validate from "../middlewares/validate.js";// Tu recolector de errores 

// La ruta ahora tiene escolta antes de llegar al controlador
router.post("/register", registerRules, validate, authController.register);
router.post("/login", loginRules, validate, authController.login);
router.get("/profile", verifyToken, validate, authController.getProfile);

export default router;