import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "El email es obligatorio"],
        unique: true, // Crea un índice único en Atlas para evitar correos duplicados
        lowercase: true, // Fuerza a que se guarde siempre en minúsculas
        trim: true
    },
    password: {
        type: String,
        required: [true, "La contraseña es obligatoria"]
    }
}, { 
    timestamps: true // Nos da 'createdAt' y 'updatedAt' gratis
});

// Creamos el modelo intermediario
const User = mongoose.model("User", userSchema);

export default User;