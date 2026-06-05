const mongoose = require("mongoose");

// 1. El molde del partido (The Schema) - Versión Profesional Protegida
const matchSchema = new mongoose.Schema({
    field: {
        type: String,
        required: [true, "El nombre del campo es obligatorio"],
        trim: true
    },
    price: {
        type: Number,
        required: [true, "El precio es obligatorio"],
        min: [0, "El precio del partido no puede ser un número negativo"] 
    },
    date: {
        type: Date, // 📅 Permite ordenaciones cronológicas y filtros avanzados de tiempo
        required: [true, "La fecha y hora del partido son obligatorias"]
    },
    players: {
        type: [String], // Array de nombres de jugadores o IDs
        default: []     
    },
    status: {
        type: String,
        enum: {
            values: ["open", "full", "cancelled"],
            message: "{VALUE} no es un estado válido para un partido"
        },
        default: "open" // ⚽ Todo partido nace abierto a que se apunte gente
    }
}, {
    timestamps: true // Nos regala 'createdAt' y 'updatedAt' de forma nativa
});

// 2. Creamos el Modelo
const Match = mongoose.model("Match", matchSchema);

// =======================================================
// 3. Funciones del CRUD (Misma abstracción limpia, interfaz en inglés)
// =======================================================

async function getAll() {
    return await Match.find(); 
}

async function getById(id) {
    return await Match.findById(id); 
}

async function create(matchData) {
    return await Match.create(matchData); 
}

async function update(id, matchData) {
    return await Match.findByIdAndUpdate(id, matchData, {
        new: true,          // Devuelve el documento ya modificado
        runValidators: true // Obliga a cumplir las reglas del Schema al editar
    });
}

async function deleteMatch(id) {
    return await Match.findByIdAndDelete(id); 
}

// 4. Exportamos manteniendo los nuevos nombres corporativos
module.exports = {
    getAll,
    getById,
    create,
    update,
    deleteMatch
};