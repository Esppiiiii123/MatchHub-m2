import express from "express";
import { createField, getFields } from "../controllers/field_controller.js";
// Importamos tus herramientas de control de entrada
import { createFieldRules } from "../validators/fields_validators.js";
import validate from "../middlewares/validate.js";
import verifyToken from "../middlewares/verifyToken.js";
import isClub from "../middlewares/isClub.js";

const router = express.Router();

router.get("/", getFields);

// Aplicamos la misma estructura de seguridad que en tus partidos
router.post("/", createFieldRules, verifyToken, isClub, validate, createField);

export default router;