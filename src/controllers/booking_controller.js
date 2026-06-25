import Booking from "../models/booking_model.js";

export const createBooking = async (req, res) => {
    try {
        const { fieldId, startTime, endTime } = req.body;

        // Algoritmo matemático para comprobar que la pista no esté ocupada en ese rango
        const overlappingBooking = await Booking.findOne({
            field: fieldId,
            status: "confirmed",
            $or: [
                { startTime: { $lt: new Date(endTime) }, endTime: { $gt: new Date(startTime) } }
            ]
        });

        if (overlappingBooking) {
            return res.status(400).json({ 
                error: "La pista ya está reservada en el horario solicitado. Elige otra hora." 
            });
        }

        const newBooking = new Booking({
            user: req.usuario.id, // El jugador logueado
            field: fieldId,
            startTime: new Date(startTime),
            endTime: new Date(endTime)
        });

        const savedBooking = await newBooking.save();
        return res.status(201).json(savedBooking);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error interno al procesar la reserva" });
    }
};

export const getMyBookings = async (req, res) => {
    try {
        // Devuelve las reservas del usuario que hace la petición
        const bookings = await Booking.find({ user: req.usuario.id }).populate("field");
        return res.status(200).json(bookings);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error al obtener tu historial de reservas" });
    }
};