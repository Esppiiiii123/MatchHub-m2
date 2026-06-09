import express from "express";
const router = express.Router();
import * as matchController from "../controllers/match_controller.js"; // Importamos las funciones del controlador de partidos

// Importamos las reglas de la caja de herramientas y el recolector de errores
import { createMatchRules, updateMatchRules, deleteOrGetMatchRules } from "../validators/matches_validators.js"; // Reglas de validación para partidos
import validate from "../middlewares/validate.js"; // Tu recolector de errores

//  RUTAS DE LECTURA (GET)
router.get("/", matchController.getMatches);
// Blindamos el GET por ID para que no acepte formatos corruptos en la URL
router.get("/:id", deleteOrGetMatchRules, validate, matchController.getMatch);

//  TRIPLE MURALLA DE SEGURIDAD (POST, PUT, PATCH, DELETE)
router.post("/", createMatchRules, validate, matchController.createMatch);
router.put("/:id", updateMatchRules, validate, matchController.updateMatch);

//  Añadimos la ruta PATCH que faltaba para la edición parcial, usando las mismas reglas opcionales del PUT
router.patch("/:id", updateMatchRules, validate, matchController.partialUpdateMatch);

//  Blindamos la ruta de borrado para interceptar IDs inválidos en la acera
router.delete("/:id", deleteOrGetMatchRules, validate, matchController.deleteMatch);

export default router;