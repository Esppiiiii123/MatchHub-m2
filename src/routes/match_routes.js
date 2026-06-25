import express from "express";
const router = express.Router();
import * as matchController from "../controllers/match_controller.js"; 
import { toggleFavoriteMatch } from "../controllers/auth_controller.js";
// Importamos las reglas de la caja de herramientas y el recolector de errores
import { createMatchRules, updateMatchRules, deleteOrGetMatchRules } from "../validators/matches_validators.js"; 
import validate from "../middlewares/validate.js"; 
import verifyToken from "../middlewares/verifyToken.js"; 

//  RUTAS DE LECTURA (GET)
router.get("/", matchController.getMatches);
// Blindamos el GET por ID para que no acepte formatos corruptos en la URL
router.get("/:id", deleteOrGetMatchRules, validate, matchController.getMatch);

//  TRIPLE MURALLA DE SEGURIDAD (POST, PUT, PATCH, DELETE)
router.post("/", createMatchRules,verifyToken, validate, matchController.createMatch);
router.post("/favorites", verifyToken, toggleFavoriteMatch);
router.put("/:id", updateMatchRules, verifyToken, validate, matchController.updateMatch);

//  Añadimos la ruta PATCH que faltaba para la edición parcial, usando las mismas reglas opcionales del PUT
router.patch("/:id", updateMatchRules, verifyToken, validate, matchController.partialUpdateMatch);

//  Blindamos la ruta de borrado para interceptar IDs inválidos en la acera
router.delete("/:id", deleteOrGetMatchRules, verifyToken, validate, matchController.deleteMatch);

export default router;