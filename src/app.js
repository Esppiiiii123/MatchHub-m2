import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth_routes.js";
import matchRoutes from "./routes/match_routes.js";
import fieldRoutes from "./routes/field_routes.js";
import bookingRoutes from "./routes/booking_routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Tus rutas antiguas
app.use("/api/auth", authRoutes);
app.use("/api/matches", matchRoutes);

// 🌟 NUEVAS RUTAS CONECTADAS
app.use("/api/fields", fieldRoutes);
app.use("/api/bookings", bookingRoutes);

export default app;