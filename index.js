require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");
const PORT = process.env.PORT || 3000;

async function initServer() {
    await connectDB();
        app.listen(PORT, () => {
            console.log(`🚀 Servidor funcionando en el puerto ${PORT}`);
        });
}
initServer();