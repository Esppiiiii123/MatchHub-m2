const express = require("express");
const cors = require("cors");
const matchRoutes = require("./routes/match_routes");
const authRoutes = require("./routes/auth_routes");

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Logger de consola
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// 🩺 MEJORA SENIOR: Endpoint rápido de Health Check externo
app.get("/api/health", (req, res) => {
    return res.status(200).json({ status: "ok", message: "MatchHub API is alive and kicking" });
});

app.use("/api/matches", matchRoutes);
app.use("/api/auth", authRoutes);

module.exports = app;