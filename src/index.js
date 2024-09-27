import app from "./app.js";
import "./awsconfig/database.js";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  try {
    // Iniciar el servidor
    await app.listen(app.get("port"));
    console.log("Servidor iniciado en el puerto", app.get("port"));
  } catch (error) {
    console.error("Error al iniciar la aplicación:", error);
    process.exit(1);
  }
}

main();
