import { v4 as uuidv4 } from "uuid";
import uploadFileToS3 from "../uploadFileToS3.js";
import { getFileExtension, createFileObject } from "../helpers/uploadS3File.helpers.js"


export const uploadFile = async (req, res) => {
  if (!req.body || req.body.length === 0) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const contentType = req.headers["content-type"];
  const fileExtension = getFileExtension(contentType);

  if (!fileExtension) {
    return res.status(400).json({ error: "Unsupported file type" });
  }

  const fileName = `${uuidv4()}.${fileExtension}`;
  const file = createFileObject(req.body, fileName, contentType);

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
};
