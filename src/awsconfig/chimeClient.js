import { ChimeSDKMeetingsClient } from "@aws-sdk/client-chime-sdk-meetings";
import dotenv from "dotenv";

dotenv.config();

const chimeClient = new ChimeSDKMeetingsClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

console.log("Chime Client configured with region:", process.env.AWS_REGION);
console.log(
  "AWS Access Key ID:",
  process.env.AWS_ACCESS_KEY_ID
    ? "***" + process.env.AWS_ACCESS_KEY_ID.slice(-4)
    : "Not set"
);

export default chimeClient;
