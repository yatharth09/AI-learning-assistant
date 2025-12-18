import cloudinary from "../config/cloudinary.js";

export const uploadPdfToCloudinary = (buffer, fileName) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",
        folder: "documents",
        public_id: fileName.replace(".pdf", ""),
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    ).end(buffer);
  });
};