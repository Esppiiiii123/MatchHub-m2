import { body } from "express-validator";

export const createBookingRules = [
    body("fieldId")
        .notEmpty().withMessage("El ID de la pista es obligatorio")
        .isMongoId().withMessage("El ID de la pista no es válido"),
    body("startTime")
        .notEmpty().withMessage("La fecha y hora de inicio es obligatoria")
        .isISO8601().withMessage("El formato de la fecha de inicio debe ser válido (ISO8601)"),
    body("endTime")
        .notEmpty().withMessage("La fecha y hora de fin es obligatoria")
        .isISO8601().withMessage("El formato de la fecha de fin debe ser válido (ISO8601)")
];