import * as matchModel from "../models/match_model.js"; // Importamos las funciones del modelo de partidos

//  GET: Listar todos los partidos
export const getMatches = async (req, res) => {
    try {
        const matches = await matchModel.getAll();
        return res.status(200).json(matches);
    } catch (error) {
        console.error("❌ Error al leer los partidos en Atlas:", error);
        return res.status(500).json({ error: "Error interno del servidor al recuperar los partidos" });
    }
};

//  GET: Buscar un partido por su ID único de Mongo
export const getMatch = async (req, res) => {
    try {
        const id = req.params.id; // 🚨 CAMBIO MONGO: Ya no se usa Number()
        const match = await matchModel.getById(id);
        
        if (!match) {
            return res.status(404).json({ error: "Partido no encontrado" });
        }
        return res.status(200).json(match);
    } catch (error) {
        console.error("❌ Error al buscar partido:", error);
        return res.status(500).json({ error: "Error interno al procesar la búsqueda" });
    }
};

//  POST: Crear un partido nuevo
export const createMatch = async (req, res) => {
    // 🛡️ CAMBIO VALIDATOR: ¡Borrados los 'if' policiales de comprobación manual!
    // Extraemos los campos directamente en inglés unificado
    const { field, price, date, players } = req.body;
    
    try {
        // Desaparece el cálculo manual de IDs correlativos. Mongo se encarga.
        const newMatch = await matchModel.create({ field, price, date, players });
        return res.status(201).json(newMatch);
    } catch (error) {
        console.error("❌ Error al crear partido:", error);
        return res.status(500).json({ error: "Error interno del servidor al guardar el partido" });
    }
};

//  PUT: Actualizar completo
export const updateMatch = async (req, res) => {
    try {
        const id = req.params.id; // 🚨 CAMBIO MONGO: ID como String
        
        // Pasamos el req.body completo. Las reglas de validación previas garantizan que vengan todos los campos obligatorios
        const updatedMatch = await matchModel.update(id, req.body);

        if (!updatedMatch) {
            return res.status(404).json({ error: "Partido no encontrado para reemplazar" });
        }
        return res.status(200).json(updatedMatch);
    } catch (error) {
        console.error("❌ Error en reemplazo PUT:", error);
        return res.status(500).json({ error: "Error interno al actualizar completamente el partido" });
    }
};

//  PATCH: Actualización parcial de campos sueltos
export const partialUpdateMatch = async (req, res) => {
    try {
        const id = req.params.id; // 🚨 CAMBIO MONGO: ID como String
        
        // Mongoose actualiza solo las propiedades que viajen dentro del req.body de forma nativa
        const patchedMatch = await matchModel.update(id, req.body);

        if (!patchedMatch) {
            return res.status(404).json({ error: "Partido no encontrado para editar" });
        }
        return res.status(200).json(patchedMatch);
    } catch (error) {
        console.error("❌ Error en actualización PATCH:", error);
        return res.status(500).json({ error: "Error interno al editar el partido" });
    }
};

// 🗑️ DELETE: Eliminar partido de la base de datos
export const deleteMatch = async (req, res) => {
    try {
        const id = req.params.id; // 🚨 CAMBIO MONGO: ID como String
        const deletedMatch = await matchModel.deleteMatch(id);
        
        if (!deletedMatch) {
            return res.status(404).json({ error: "Partido no encontrado para eliminar" });
        }
        
        return res.status(200).json({ 
            mensaje: "Partido eliminado correctamente de la base de datos", 
            matchBorrado: deletedMatch 
        });
    } catch (error) {
        console.error("❌ Error al borrar partido:", error);
        return res.status(500).json({ error: "Error interno del servidor al intentar borrar" });
    }
};