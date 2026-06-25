import mongoose from "mongoose";

const fieldSchema = new mongoose.Schema({
    name: { type: String, required: true },         // Ej: "Pista Central Césped Artificial"
    location: { type: String, required: true },     // Ej: "El Palo, Málaga"
    pricePerHour: { type: Number, required: true }, // Ej: 50
    description: { type: String },
    // 🌟 RELACIÓN: Guardamos el ID del usuario tipo "club" que es dueño de la pista
    club: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    }
}, { timestamps: true });

export default mongoose.model("Field", fieldSchema);