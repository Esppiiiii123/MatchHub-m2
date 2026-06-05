const express = require("express");
const router = express.Router();
const matchController = require("../controllers/match_controller");

// Importamos las reglas de la caja de herramientas y el recolector de errores
const { createMatchRules, updateMatchRules, deleteOrGetMatchRules } = require("../validators/matches_validators");
const validate = require("../middlewares/validate");

// ⚽ RUTAS DE LECTURA (GET)
router.get("/", matchController.getMatches);
// Blindamos el GET por ID para que no acepte formatos corruptos en la URL
router.get("/:id", deleteOrGetMatchRules, validate, matchController.getMatch);

// 🛡️ TRIPLE MURALLA DE SEGURIDAD (POST, PUT, PATCH, DELETE)
router.post("/", createMatchRules, validate, matchController.createMatch);
router.put("/:id", updateMatchRules, validate, matchController.updateMatch);

// 🩹 Añadimos la ruta PATCH que faltaba para la edición parcial, usando las mismas reglas opcionales del PUT
router.patch("/:id", updateMatchRules, validate, matchController.partialUpdateMatch);

// Blindamos la ruta de borrado para interceptar IDs inválidos en la acera
router.delete("/:id", deleteOrGetMatchRules, validate, matchController.deleteMatch);

module.exports = router;