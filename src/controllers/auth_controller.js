const bcrypt = require("bcryptjs"); // Importamos el triturador de contraseñas
const User = require("../models/user_model"); // Importamos la plantilla del usuario

// 🔑 POST: Registrar un nuevo usuario (/api/auth/register)
const register = async (req, res) => {
    try {
        // 1. Abrimos la caja de la petición y sacamos los inputs
        const { email, password } = req.body;

        // 2. Buscamos en Atlas si ese correo ya lo tiene otra persona
        const userExists = await User.findOne({ email });
        if (userExists) {
            // ⚠️ 409 Conflict: El recurso ya existe, no duplicamos
            return res.status(409).json({ mensaje: "Ese correo electrónico ya está registrado" });
        }

        // 3. Pasamos la contraseña por la batidora (10 vueltas de tuerca de seguridad)
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 4. Creamos el nuevo expediente en Atlas guardando el puré (Hash)
        const newUser = await User.create({ 
            email, 
            password: hashedPassword 
        });

        // 5. Entregamos el recibo de éxito al Frontend SIN la contraseña
        return res.status(201).json({
            id: newUser._id,
            email: newUser.email,
        });

    } catch (error) {
        console.error("❌ Error en el servidor durante el registro:", error);
        return res.status(500).json({ mensaje: "Error interno en el servidor al registrar el usuario" });
    }
};

// 🚪 POST: Iniciar sesión / Login (/api/auth/login)
const login = async (req, res) => {
    try {
        // 1. Sacamos los datos que el usuario ha metido en el formulario de login
        const { email, password } = req.body;

        // 2. Buscamos si existe un usuario con ese email en nuestra base de datos
        const user = await User.findOne({ email });
        if (!user) {
            // 🚨 SEGURIDAD SENIOR: Ponemos un mensaje genérico. 
            // Si dijéramos "El email no existe", un hacker sabría qué correos están registrados.
            return res.status(401).json({ mensaje: "Credenciales incorrectas" });
        }

        // 3. Comparamos la contraseña de la calle con el Hash triturado de Atlas
        // El robot 'bcrypt.compare' hace la magia y nos devuelve un 'true' o 'false'
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            // 🚨 Mismo mensaje exacto y mismo código 401 Unauthorized para despistar a los atacantes
            return res.status(401).json({ mensaje: "Credenciales incorrectas" });
        }

        // 4. Si todo ha ido sobre ruedas, damos luz verde al Login con un 200 OK
        // (Mañana en la Clase 29, aquí es donde fabricaremos y enviaremos el Token JWT)
        return res.status(200).json({
            mensaje: "Login correcto",
            user: {
                id: user._id,
                email: user.email
            }
        });

    } catch (error) {
        console.error("❌ Error en el servidor durante el login:", error);
        return res.status(500).json({ mensaje: "Error interno en el servidor al iniciar sesión" });
    }
};

// Exportamos las dos funciones juntas en un objeto para que las lean las rutas
module.exports = {
    register,
    login
};