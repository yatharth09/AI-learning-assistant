import dotenv from "dotenv";
dotenv.config();
import { google } from "googleapis";
import streamifier from "streamifier";


console.log("EMAIL:", process.env.GOOGLE_CLIENT_EMAIL);
console.log("KEY PRESENT:", Boolean(process.env.GOOGLE_PRIVATE_KEY));


const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/drive"],
});

const drive = google.drive({ version: "v3", auth });

export const uploadToGoogleDrive = async (buffer, fileName) => {
  // Upload file
  const fileResponse = await drive.files.create({
    requestBody: {
      name: fileName,
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID]
    },
    media: {
      mimeType: "application/pdf",
      body: streamifier.createReadStream(buffer)
    }
  });

  const fileId = fileResponse.data.id;

  // Make file public
  await drive.permissions.create({
    fileId,
    requestBody: {
      role: "reader",
      type: "anyone"
    }
  });

  // Direct download link
  return `https://drive.google.com/uc?id=${fileId}&export=download`;
};
