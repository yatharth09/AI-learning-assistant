import Document from "../models/Document.js";
import Flashcard from "../models/Flashcard.js";
import Quiz from "../models/Quiz.js";
import { extractTextSimple } from "../utils/pdfParser.js";
import { chunkText } from "../utils/textChunker.js";
import mongoose from "mongoose";
import { uploadPdfToCloudinary } from "../utils/uploadCloudinary.js";




export const getDocuments = async (req, res, next) => {

    try{
        const documents = await Document.aggregate([
            {
                $match: {userId: new mongoose.Types.ObjectId(req.user._id)}
            },
            {
                $lookup: {
                    from: 'flashcards',
                    localField: "_id",
                    foreignField: 'documentId',
                    as: 'flashcardSets'
                }
            },
            {
                $lookup: {
                    from: 'quizzes',
                    localField: "_id",
                    foreignField: 'documentId',
                    as: 'quiz'
                }
            },
            {
                $addFields:{
                    flashcardCount: {$size: '$flashcardSets'},
                    quizCount: {$size: "$quiz"}
                }
            },
            {
                $project: {
                    extractedText: 0,
                    chunks: 0,
                    flashcardSets: 0,
                    quiz: 0
                }
            },
            {
                $sort: {uploadDate: -1}
            }
        ])

        res.status(200).json({
            success: true,
            count: documents.length,
            data: documents
        })

    }catch(error){
        next(error);
    }

}

const processPDF = async (documentId, fileUrl) => {
  try {

    const text  = await extractTextSimple(fileUrl);
    console.log(text)
    const chunks = chunkText(text, 500, 50);

    await Document.findByIdAndUpdate(documentId, {
      extractedText: text,
      chunks,
      status: "ready",
    });

    console.log(`Document ${documentId} processed`);
  } catch (error) {
    console.error("PDF processing failed:", error);
    await Document.findByIdAndUpdate(documentId, {
      status: "failed",
    });
  }
};


export const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const uploadResult = await uploadPdfToCloudinary(
      req.file.buffer,
      req.file.originalname
    );

    const document = await Document.create({
      userId: req.user._id,
      title: req.body.title,
      fileName: req.file.originalname,
      filePath: uploadResult.secure_url, // ✅ PUBLIC URL
      fileSize: req.file.size,
      status: "processing"
    });

    processPDF(document._id, uploadResult.secure_url).catch(err => console.error('Error processing PDF:', err));

    res.status(201).json({
      message: "Document uploaded successfully",
      data: document
    });
  } catch (error) {
    next(error);
  }
};



export const deleteDocument = async (req, res, next) => {

    try{
        const document = await Document.findOne({
            _id: req.params.id,
            userId: req.user._id
        })

        if(!document){
            res.status(404).json({
                error:"Document not found"
            })
        }

        await fs.unlink(document.filePath).catch((error) => console.log(error))

        await document.deleteOne()

        res.status(200).json({message: "Document deleted successfully"})

    }catch(error){
        next(error);
    }

}



export const getDocument = async (req, res, next) => {

    try{

        const document = await Document.findOne({
            _id: req.params.id,
            userId: req.user._id
        })

        if(!document){
            return res.status(404).json({
                error: "Document not Found"
            })
        }

        const flashcardCount = await Flashcard.countDocuments({documentId: document._id, userId: req.user._id});
        const quizCount = await Quiz.countDocuments({documentId: document._id, userId: req.user._id})

        document.lastAccessed = Date.now();
        await document.save()

        const documentData = document.toObject();
        documentData.flashcardCount = flashcardCount;
        documentData.quizCount = quizCount;

        res.status(200).json({
            data: documentData
        })

    }catch(error){
        next(error);
    }

}