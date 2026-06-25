import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // 🌟 NUEVO: Control de roles para saber si es jugador o un polideportivo
    role: { 
        type: String, 
        enum: ["player", "club"], 
        default: "player" 
    },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Field" }]
}, { timestamps: true });

export default mongoose.model("User", userSchema);