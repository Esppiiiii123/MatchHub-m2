const { body, param } = require("express-validator");

// 1. 🛡️ Reglas estrictas para cuando se crea un partido nuevo (POST)
const createMatchRules = [
    body("field")
        .notEmpty().withMessage("El nombre del campo de juego es obligatorio")
        .trim(),
        
    body("price")
        .notEmpty().withMessage("El precio del partido es obligatorio")
        .isFloat({ min: 0 }).withMessage("El precio debe ser un número positivo"),
        
    body("date")
        .notEmpty().withMessage("La fecha y hora del partido son obligatorias")
        .isISO8601().withMessage("El formato de la fecha debe ser una fecha y hora válidas (ISO 8601)"),
];

// 2. 🛡️ Reglas flexibles para cuando se actualiza o edita un partido (PUT / PATCH)
const updateMatchRules = [
    // Interceptamos IDs corruptos en la URL antes de que lleguen a Mongoose
    param("id")
        .isMongoId().withMessage("El formato del ID del partido no es válido"),

    // Los campos del body van con .optional() por si es una edición parcial (PATCH)
    body("field")
        .optional()
        .notEmpty().withMessage("El nombre del campo no puede quedarse vacío")
        .trim(),
        
    body("price")
        .optional()
        .isFloat({ min: 0 }).withMessage("El precio debe ser un número positivo"),
        
    body("date")
        .optional()
        .isISO8601().withMessage("Formato de fecha y hora inválido"),

    body("status")
        .optional()
        .isIn(["open", "full", "cancelled"]).withMessage("El estado debe ser únicamente: open, full o cancelled")
];

// 3. 🛡️ Regla rápida para peticiones que solo envían ID en la URL (GET por ID y DELETE)
const deleteOrGetMatchRules = [
    param("id")
        .isMongoId().withMessage("El formato del ID del partido no es válido")
];

module.exports = {
    createMatchRules,
    updateMatchRules,
    deleteOrGetMatchRules
};