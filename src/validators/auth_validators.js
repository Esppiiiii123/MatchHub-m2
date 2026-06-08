const { body } = require("express-validator");

const registerRules = [
    body("email")
        .isEmail().withMessage("El formato del correo electrónico no es válido")
        .normalizeEmail(), // 🧼 Limpia espacios, quita puntos raros y unifica a minúsculas
        
    body("password")
        .isLength({ min: 6 }).withMessage("La contraseña debe tener un mínimo de 6 caracteres")
];

module.exports = {
    registerRules
};