const bcrypt = require("bcryptjs");
const User = require("../models/user_model");

// 🔑 POST: Registrar un nuevo usuario
const register = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. ¿Ya existe un usuario con ese email en Atlas?
        const userExists = await User.findOne({ email });
        if (userExists) {
            // ⚠️ 409 Conflict: Es el código HTTP exacto para "recurso ya existente"
            return res.status(409).json({ mensaje: "Ese email ya está registrado" });
        }

        // 2. Hashear la contraseña ANTES de guardar (10 saltos de coste/seguridad)
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 3. Guardar el usuario con el hash (la contraseña en claro muere aquí)
        const newUser = await User.create({ 
            email, 
            password: hashedPassword 
        });

        // 4. Responder al cliente SIN devolver jamás el hash de la contraseña
        return res.status(201).json({
            id: newUser._id,
            email: newUser.email,
        });

    } catch (error) {
        console.error("❌ Error en el servidor durante el registro:", error);
        return res.status(500).json({ mensaje: "Error interno en el registro" });
    }
};

// Exportamos la función dentro de un objeto (así mañana añadiremos el login al lado)
module.exports = {
    register
};