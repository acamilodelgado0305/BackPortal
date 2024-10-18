import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";

import routes from "./routes/index.js"
import uploadFileToS3 from "./uploadImageToS3.js";

dotenv.config();

const app = express();

app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://a.app.esturio.com"],
  })
);
app.use(express.json());

app.use(
  express.raw({
    type: ["image/*", "audio/*", "video/*", "application/pdf"],
    limit: "50mb", // Aumentamos el límite para manejar archivos más grandes
  })
);

app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  // Puedes enviar una respuesta de error al cliente o realizar otras acciones aquí
  res.status(500).send("Error interno del servidor");
});

app.get("/", (req, res) => {
  res.json({ Hi: "Hello World" });
});

app.post("/api/upload", async (req, res) => {
  if (!req.body || req.body.length === 0) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const contentType = req.headers["content-type"];
  let fileExtension;

  switch (contentType.split("/")[0]) {
    case "image":
    case "audio":
    case "video":
      fileExtension = contentType.split("/")[1];
      break;
    case "application":
      fileExtension = "pdf";
      break;
    default:
      return res.status(400).json({ error: "Unsupported file type" });
  }

  const fileName = `${uuidv4()}.${fileExtension}`;

  const file = {
    buffer: req.body,
    originalname: fileName,
    mimetype: contentType,
  };

  try {
    const result = await uploadFileToS3(file);
    if (result.success) {
      res.json({ url: result.url });
    } else {
      res.status(500).json({ error: result.error });
    }
  } catch (error) {
    console.error("Error during file upload:", error);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
});

app.use("/api", routes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});

export default app;
