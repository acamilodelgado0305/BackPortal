import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http"; 
import { v4 as uuidv4 } from "uuid";

import routes from "./routes/index.js";
import { uploadFile } from "./controllers/uploadS3Controller.js";
import initSocketServer from "./sockets/socketServer.js"; 

dotenv.config();

const app = express();
const server = http.createServer(app); 
const io = initSocketServer(server); 

app.use(cookieParser());
app.use(
  cors({
    origin: [process.env.FRONT_DEV, process.env.FRONT_PROD],
  })
);
app.use(express.json());

app.use(
  express.raw({
    type: ["image/*", "audio/*", "video/*", "application/pdf"],
    limit: "50mb",
  })
);

app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).send("Error interno del servidor");
});

app.get("/", (req, res) => {
  res.json({ Hi: "Hello World" });
});

app.post("/api/upload", uploadFile);
app.use("/api", routes);

const PORT = process.env.PORT;

server.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});

export default app;
