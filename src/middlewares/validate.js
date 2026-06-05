const { validationResult } = require("express-validator");

const validate = (req, res, next) => {
    // 1. Recolectamos los resultados del escáner de las reglas
    const errors = validationResult(req);
    
    // 2. Si la libreta de errores NO está vacía, cortamos el paso de golpe
    if (!errors.isEmpty()) {
        return res.status(422).json({
            // Pulimos el output: devolvemos solo el nombre del campo y nuestro mensaje customizado
            errores: errors.array().map((e) => ({
                campo: e.path,    // Nombre del campo que ha fallado (ej: "field" o "price")
                mensaje: e.msg,   // Mensaje de error personalizado que configuramos en las reglas
            })),
        });
    }
    
    // 3. Si no hay errores, ¡luz verde hacia el controlador!
    next();
};

module.exports = validate;