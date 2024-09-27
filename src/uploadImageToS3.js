import { Upload } from "@aws-sdk/lib-storage";
import s3Client from './awsconfig/s3Config.js';

const uploadFileToS3 = async (file) => {
  if (!file || !file.buffer) {
    console.error('Invalid file provided to uploadFileToS3');
    return { success: false, error: 'Invalid file' };
  }

  const contentType = file.mimetype.split('/')[0];
  let folder;

  switch (contentType) {
    case 'image':
      folder = 'images';
      break;
    case 'audio':
      folder = 'audios';
      break;
    case 'video':
      folder = 'videos';
      break;
    case 'application':
      folder = 'documents';
      break;
    default:
      folder = 'others';
  }

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `${folder}/${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype
    // La línea ACL: 'public-read' ha sido removida
  };

  console.log('Attempting to upload file:', file.originalname);

  try {
    const upload = new Upload({
      client: s3Client,
      params: params
    });

    const result = await upload.done();
    console.log('Upload successful. Result:', result);
    return { success: true, url: result.Location };
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    return { success: false, error: error.message };
  }
};

export default uploadFileToS3;