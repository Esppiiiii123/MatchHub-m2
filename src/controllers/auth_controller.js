import bcrypt from "bcryptjs";// Importamos el triturador de contraseñas
import User from "../models/user_model.js";// Importamos la plantilla del usuario

// 🔑 POST: Registrar un nuevo usuario (/api/auth/register)
export const register = async (req, res) => {
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
export const login = async (req, res) => {
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

        // 🔑 2. NUEVO: Contraseña correcta -> ¡Fabricamos la pulsera!
        // Metemos el ID en el payload y hacemos que caduque en 1 hora ("1h")
        const token = jwt.sign(
            { id: user._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: "1h" }
        );

        // 3. Devolvemos el token al cliente
        return res.status(200).json({
            mensaje: "Login correcto",
            token // 👈 El cliente (Thunder/Postman/React) se guardará esto
        });

    } catch (error) {
        console.error("❌ Error en el servidor durante el login:", error);
        return res.status(500).json({ mensaje: "Error interno en el servidor al iniciar sesión" });
    }
};
export const quienSoy = (req, res) => {
    try {
        // 1. Extraer la cabecera Authorization
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ mensaje: "No se ha proporcionado ningún token" });
        }

        // 2. Separar la palabra "Bearer" del token real
        // "Bearer xxxxx.yyyyy.zzzzz" -> ["Bearer", "xxxxx.yyyyy.zzzzz"]
        const token = authHeader.split(" ")[1];

        // 3. Verificar el token con el SECRETO del .env
        // Si ha sido manipulado o ha caducado, saltará automáticamente al catch
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 4. Si la firma es válida, recuperamos el ID del payload
        return res.status(200).json({
            mensaje: "Token verificado con éxito",
            userId: decoded.id //  Aquí está el dueño de la pulsera
        });

    } catch (error) {
        return res.status(401).json({ mensaje: "Token inválido o expirado" });
    }
};
