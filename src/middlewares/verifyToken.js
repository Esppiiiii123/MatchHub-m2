import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // 1. Filtro de seguridad: ¿Viene la cabecera y tiene el formato correcto?
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "No hay token o el formato es incorrecto" });
        }

        // 2. Extraer el token del "Bearer <token>"
        const token = authHeader.split(" ")[1];

        // 3. Verificar el token con el secreto del .env
        const datosDecodificados = jwt.verify(token, process.env.JWT_SECRET);

        // 4. ENRIQUECER EL REQ: Dejamos los datos listos para el controlador
        req.usuario = datosDecodificados; // Contiene el { id: user._id } que firmamos

        // 5. ¡Luz verde! Pasamos al controlador
        next();

    } catch (error) {
        // 5. Control de errores específico para el usuario
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Tu sesión ha caducado, vuelve a iniciar sesión" });
        }
        return res.status(401).json({ error: "Token inválido" });
    }
};

export default verifyToken;