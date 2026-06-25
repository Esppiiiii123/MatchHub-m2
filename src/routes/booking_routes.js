import express from "express";
import { createBooking, getMyBookings } from "../controllers/booking_controller.js";
// Importamos tus herramientas de control de entrada
import { createBookingRules } from "../validators/bookings_validators.js";
import validate from "../middlewares/validate.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

// Doble blindaje para crear una reserva
router.post("/", createBookingRules, verifyToken, validate, createBooking);

router.get("/my-bookings", verifyToken, getMyBookings);

export default router;