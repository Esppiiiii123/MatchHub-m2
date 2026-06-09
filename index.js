import "dotenv/config"; // Carga las variables de entorno desde el archivo .env
import app from "./src/app.js"; // Importamos la configuración de Express
import connectDB from "./src/config/db.js"; // Importamos la función para conectar a MongoDB
const PORT = process.env.PORT || 3000;

async function initServer() {
    await connectDB();
        app.listen(PORT, () => {
            console.log(`Servidor funcionando en el puerto ${PORT}`);
        });
}
initServer();