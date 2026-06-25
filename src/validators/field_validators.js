import { body, param } from "express-validator";

export const createFieldRules = [
    body("name")
        .notEmpty().withMessage("El nombre de la pista es obligatorio")
        .isString().withMessage("El nombre debe ser un texto limpio"),
    body("location")
        .notEmpty().withMessage("La ubicación de la pista es obligatoria"),
    body("pricePerHour")
        .notEmpty().withMessage("El precio por hora es obligatorio")
        .isNumeric().withMessage("El precio debe ser un número válido")
];

export const deleteOrGetFieldRules = [
    param("id").isMongoId().withMessage("El ID de la pista no es un formato válido de MongoDB")
];