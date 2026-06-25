import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Quién reserva
    field: { type: mongoose.Schema.Types.ObjectId, ref: "Field", required: true }, // Qué pista reserva
    startTime: { type: Date, required: true }, // Fecha y hora de inicio
    endTime: { type: Date, required: true },   // Fecha y hora de fin
    status: { 
        type: String, 
        enum: ["pending", "confirmed", "cancelled"], 
        default: "confirmed" 
    }
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);