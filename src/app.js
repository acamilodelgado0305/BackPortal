import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http"; 
import { uploadFile } from "./controllers/uploadS3Controller.js"; 
import routes from "./routes/index.js"; 
import setupWebSocket from "./sockets/socket.js";

dotenv.config();
const PORT = process.env.PORT || 4005; 
const app = express();
const server = http.createServer(app); 

setupWebSocket(server); // Configura WebSocket

// Middleware y rutas
app.use(cookieParser());
app.use(
  cors({
     origin: ["https://a.app.esturio.com","http://localhost:5173", "http://localhost:3000", "https://landing.app.esturio.com" ],
  })
);
app.use(express.json());
app.use(express.raw({
  type: ["image/*", "audio/*", "video/*", "application/pdf"],
  limit: "50mb",
}));

app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).send("Error interno del servidor");
});
server.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});



app.get("/", (req, res) => {
  res.json({ Hi: "Hello World" });
});
app.use("/api", routes);
app.post("/api/upload", uploadFile);






export default app;
