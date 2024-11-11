export const getFileExtension = (contentType) => {
    switch (contentType.split("/")[0]) {
      case "image":
      case "audio":
      case "video":
        return contentType.split("/")[1];
      case "application":
        return "pdf";
      default:
        return null; 
    }
  };
  
  export const createFileObject = (buffer, fileName, contentType) => ({
    buffer,
    originalname: fileName,
    mimetype: contentType,
  });