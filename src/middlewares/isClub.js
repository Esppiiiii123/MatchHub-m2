const isClub = (req, res, next) => {
    // verifyToken ya guardó los datos del usuario logueado en req.usuario
    if (req.usuario && req.usuario.role === "club") {
        next(); // Tiene permiso, adelante
    } else {
        return res.status(403).json({ 
            error: "Acceso denegado. Solo los centros deportivos (Clubs) pueden realizar esta acción." 
        });
    }
};

export default isClub;