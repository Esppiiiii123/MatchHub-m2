const express = require("express");
const fs = require("node:fs").promises;
const path = require("node:path");
const cors = require("cors");

const app = express();
const port = 3000;

// Arreglado: Usamos RUTA en todo el archivo de forma coherente
const RUTA = path.join(__dirname, "partidos.json");

app.use(cors());
app.use(express.json());

// --- FUNCIONES DE PERSISTENCIA (MÓDULO FS) ---

async function cargarPartidos() {
    try {
        // Corregido: RUTA_DATOS cambiada por RUTA
        const contenido = await fs.readFile(RUTA, "utf-8");
        return JSON.parse(contenido);
        
    } catch (error) {
        if (error.code === "ENOENT") {
            console.log("⚠️ El archivo no existe. Creando uno nuevo vacío...");   
            await fs.writeFile(RUTA, "[]", "utf-8");
            return []; 
        }
        throw error;
    }
}

async function guardarPartidos(partidos) {
    await fs.writeFile(RUTA, JSON.stringify(partidos, null, 2), "utf-8");
}

// --- MIDDLEWARE LOGGER ---
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// --- RUTAS DE LA API ---

// GET todos
app.get("/api/matches", async (req, res) => {
    try {
        const partidos = await cargarPartidos();
        res.json(partidos);
        
    } catch (error) {
        console.error("Error al leer los partidos:", error);
        res.status(500).json({ error: "Error interno del servidor al leer los datos" });
    }
});

// GET uno por ID
app.get("/api/matches/:id", async (req, res) => {
    try {
        const partidos = await cargarPartidos();
        const id = Number(req.params.id);
        const partido = partidos.find(p => p.id === id);
        if (!partido) return res.status(404).json({ error: "Partido no encontrado" });
        res.json(partido);
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// POST crear
app.post("/api/matches", async (req, res) => {
    try {
        const partidos = await cargarPartidos();
        const { campo, precio, jugadores } = req.body;
        
        if (!campo || !precio) {
            return res.status(400).json({ error: "Faltan campos obligatorios (campo o precio)" });
        }
        
        // Generación de ID basada en el archivo real
        const nuevoId = partidos.length > 0 ? Math.max(...partidos.map(p => p.id)) + 1 : 1;

        const nuevo = { 
            id: nuevoId, 
            campo, 
            precio, 
            jugadores: jugadores || 0, 
            estado: "disponible" 
        };
        
        partidos.push(nuevo);
        // Corregido: Le pasamos 'partidos' a la función de guardar
        await guardarPartidos(partidos); 
        
        res.status(201).json(nuevo);
    } catch (error) {
        res.status(500).json({ error: "Error interno al guardar" });
    }
});

// PUT actualizar completo
app.put("/api/matches/:id", async (req, res) => {
    try {
        const idBuscar = Number(req.params.id);
        const partidos = await cargarPartidos(); 

        const indiceEncontrado = partidos.findIndex((partido) => partido.id === idBuscar);

        if (indiceEncontrado === -1) {
            return res.status(404).json({ error: "Partido no encontrado para reemplazar" });
        }

        const { campo, precio, jugadores, estado } = req.body;
        if (!campo || precio === undefined || jugadores === undefined || !estado) {
            return res.status(400).json({ error: "Faltan campos obligatorios para el reemplazo completo (PUT)" });
        }

        const partidoActualizado = { id: idBuscar, campo, precio, jugadores, estado };
        partidos[indiceEncontrado] = partidoActualizado;

        await guardarPartidos(partidos);
        res.json(partidoActualizado);
    } catch (error) {
        res.status(500).json({ error: "Error interno al actualizar" });
    }
});

// PATCH actualización parcial
app.patch("/api/matches/:id", async (req, res) => {
    try {
        const idBuscar = Number(req.params.id);
        const partidos = await cargarPartidos(); // Leemos del archivo
        
        const partidoEncontrado = partidos.find((partido) => partido.id === idBuscar);

        if (!partidoEncontrado) {
            return res.status(404).json({ error: "Partido no encontrado para editar" });
        }

        const { campo, precio, jugadores, estado } = req.body;

        if (campo !== undefined) partidoEncontrado.campo = campo;
        if (precio !== undefined) partidoEncontrado.precio = precio;
        if (jugadores !== undefined) partidoEncontrado.jugadores = jugadores;
        if (estado !== undefined) partidoEncontrado.estado = estado;

        await guardarPartidos(partidos); // Guardamos los cambios parciales
        res.json(partidoEncontrado);
    } catch (error) {
        res.status(500).json({ error: "Error interno al editar" });
    }
});

// DELETE borrar
app.delete("/api/matches/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const partidos = await cargarPartidos(); // Leemos del archivo
        
        const indice = partidos.findIndex(p => p.id === id);
        if (indice === -1){
            return res.status(404).json({error: "Partido no encontrado"});
        }
        
        const [partidoBorrado] = partidos.splice(indice, 1);
        // Corregido: Le pasamos 'partidos' a la función de guardar
        await guardarPartidos(partidos); 
        
        // Devolvemos el 200 con el objeto borrado (Opción A de la clase)
        res.json({ mensaje: "Partido eliminado correctamente", partidoBorrado });
    } catch (error) {
        res.status(500).json({ error: "Error interno al borrar" });
    }
});

app.listen(port, () => {
    console.log(`Servidor funcionando en el puerto ${port}`);
});