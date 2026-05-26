const express = require('express');
const app = express();
const port = 3000;

// 3. Array de tu entidad principal en memoria (Al menos 3-5 partidos de fútbol)
const partidos = [
    { id: 1, campo: "Polideportivo Carranque", precio: 5, jugadores: 12, estado: "abierto" },
    { id: 2, campo: "Campo El Romeral", precio: 4.5, jugadores: 14, estado: "completo" },
    { id: 3, campo: "Malagueta F7", precio: 6, jugadores: 8, estado: "abierto" },
    { id: 4, campo: "Los Guindos", precio: 5.5, jugadores: 10, estado: "abierto" }
];

// 2. Ruta GET /api/health para verificar que el servidor está vivo
app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});

// 4. GET /api/matches — devuelve el array completo
app.get("/api/matches", (req, res) => {
    res.json(partidos);
});

// 5. GET /api/matches/:id — devuelve uno por id, con 404 si no existe
app.get("/api/matches/:id", (req, res) => {
  const idBuscar = Number(req.params.id); // Convertimos el string de la URL a número
    const partidoEncontrado = partidos.find((partido) => partido.id === idBuscar);

  // Si no existe, return temprano con el status 404 que pide el profesor
    if (!partidoEncontrado) {
    return res.status(404).json({ error: "Partido no encontrado" });
    }

    res.json(partidoEncontrado);
});

app.listen(port, () => {
    console.log(`Servidor funcionado en el puerto ${port}`);
});