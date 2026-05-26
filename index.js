const express = require('express');
const app = express();
const port = 3000;


app.use(express.json());

// . El middleware de Logger tiene que ser una función con (req, res, next)
app.use((req, res, next) => {
    // Imprime la fecha, el método (GET, POST...) y la URL en tiempo real
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next(); 
});

// . Array de tu entidad principal en memoria (Al menos 3-5 partidos de fútbol)
const partidos = [
    { id: 1, campo: "Polideportivo Carranque", precio: 5, jugadores: 12, estado: "disponible" },
    { id: 2, campo: "Campo El Romeral", precio: 4.5, jugadores: 14, estado: "completo" },
    { id: 3, campo: "Nuevo San Ignacio", precio: 6, jugadores: 8, estado: "disponible" },
    { id: 4, campo: "Los Guindos", precio: 5.5, jugadores: 10, estado: "disponible" }
];

// . Ruta GET /api/health para verificar que el servidor está vivo
app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});

// . GET /api/matches — devuelve el array completo
app.get("/api/matches", (req, res) => {
    res.json(partidos);
});

// . POST /api/matches — crea un nuevo partido
app.post("/api/matches", (req, res) => {
    // Sacamos directamente los datos limpios de dentro de req.body
    const { campo, precio, jugadores } = req.body;
    // Control de seguridad: ahora comprobamos las variables directas
    if (!campo || !precio) {
        return res.status(400).json({ error: "Faltan campos obligatorios (campo o precio)" });
    }

    // Creamos el objeto del partido uniendo lo que nos ha llegado con lo automático
    const nuevoPartido = {
        id: partidos.length + 1,
        campo,   // Esto es lo mismo que campo: campo
        precio,  // Esto es lo mismo que precio: precio
        jugadores,
        estado: "disponible"
    };
    // Lo metemos al array global
    partidos.push(nuevoPartido);

    // Respondemos con el 201 de éxito
    res.status(201).json(nuevoPartido);
});

// . GET /api/matches/:id — devuelve uno por id, con 404 si no existe
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