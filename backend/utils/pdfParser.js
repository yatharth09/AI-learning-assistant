import fs from "fs/promises";

export const extractTextFromPDF = async (filePath) => {
  const { default: pdf } = await import("pdf-parse");

  const buffer = await fs.readFile(filePath);

  if (buffer.length > 5 * 1024 * 1024) {
    throw new Error("PDF too large for serverless parsing");
  }

  const data = await pdf(buffer);

  return {
    text: data.text,
    numPages: data.numpages
  };
};
