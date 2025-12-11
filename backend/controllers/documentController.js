import Document from "../models/Document";
import Flashcard from "../models/Flashcard";
import Quiz from "../models/Quiz";
import { extractTextFromPDF } from "../utils/pdfParser.js";
import { chunkText } from "../utils/textChunker.js";
import fs from 'fs/promises';
import mongoose from "mongoose";




const getDocuments = async (req, res, next) => {

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
                    from: 'quiz',
                    localField: "_id",
                    foreignField: 'documentId',
                    as: 'quiz'
                }
            },
            {
                $addFields:{
                    flashCardCount: {$size: '$flashcardSets'},
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
            count: document.length,
            data: documents
        })

    }catch(error){
        next(error);
    }

}

const processPDF = async (documentId, filePath) => {
    try{
        const {text} = await extractTextFromPDF(filePath);
        const chunks = chunkText(text, 500, 50);

        await Document.findByIdAndUpdate(documentId, { extractedText: text, status: 'processed', chunks: chunks });
        console.log(`Document ${documentId} processed with ${chunks.length} chunks.`);
    }catch(error){
        console.log('Error processing PDF:', error);
        await Document.findByIdAndUpdate(documentId, { status: 'error' });
    }
}


const uploadDocument = async (req, res, next) => {

    try{
        if(!req.file){
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const {title} = req.body

        if(!title){
            await fs.unlink(req.file.path);
            return res.status(400).json({ message: 'Title is required' });
        }

        const baseUrl = `http://localhost:${process.env.PORT || 5000}`;
        const fileUrl = `${baseUrl}/uploads/documents/${req.file.filename}`;

        const document =  await Document.create({
            userId: req.user._id,
            title,
            fileName: req.file.originalname,
            filePath: fileUrl,
            fileSize: req.file.size,
            status: 'processing',
        });

        processPDF(document._id, req.file.path).catch(err => console.error('Error processing PDF:', err));

        res.status(201).json({ message: 'Document uploaded successfully. Processing in progress ...', document });

    }catch(error){
        if(req.file){
            await fs.unlink(req.file.path).catch(err => console.error('Error deleting file:', err));
        }
        next(error);
    }

}


const deleteDocument = async (req, res, next) => {

    try{

    }catch(error){
        next(error);
    }

}


const updateDocument = async (req, res, next) => {

    try{

    }catch(error){
        next(error);
    }

}


const getDocument = async (req, res, next) => {

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

        const flastcardCount = await Flashcard.countDocuments({documentId: document._id, userId: req.user._id});
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