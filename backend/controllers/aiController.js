import Document from "../models/Document.js";
import Quiz from "../models/Quiz.js";
import Flashcard from "../models/Flashcard.js";
import ChatHistory from '../models/ChatHistory.js';
import * as geminiService from '../utils/geminiService.js'
import { findRelevantChunks } from "../utils/textChunker.js";


export const generateFlashcards = async(req, res, next) => {
    try {
        const {documentId, count} = req.body

        if(!documentId){
            return res.status(404).json({
                error: "Provide document id"
            })
        }

        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
            status: 'ready'
        })
        
        if(!document){
            return res.status(404).json({
                error: "Document not found for the give documentId"
            })
        }

        

        const cards = await geminiService.generateFlashcards(document.extractedText, parseInt(count))

        console.log(cards)
        const flashcardSets = await Flashcard.create({
            userId: req.user._id,
            documentId: document._id,
            cards: cards.map(card => ({
                question: card.question,
                answer: card.answer,
                difficulty: card.difficulty,
                reviewCount: 0,
                isStarred: false

            }))
        })

        res.status(201).json(
            {
                data: flashcardSets
            }
        )


        
    } catch (error) {
        next(error)
    }
}



export const generateQuiz = async(req, res, next) => {
    try {
        const {documentId, count, title} = req.body

        if(!documentId){
            return res.status(404).json({
                error: "Provide document id"
            })
        }

        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
            status: 'ready'
        })
        
        if(!document){
            return res.status(404).json({
                error: "Document not found for the give documentId"
            })
        }

        
        
        const questions = await geminiService.generateQuiz(document.extractedText, parseInt(count))

        
        const quiz = await Quiz.create({
            userId: req.user._id,
            documentId: document._id,
            title: title || `${document.title}-Quiz`,
            questions: questions,
            totalQuestions: questions.length,
            userAnswers: [],
            score: 0
        })

        return res.status(201).json(
            {
                data: quiz
            }
        )
        
    } catch (error) {
        next(error)
    }
}


export const generateSummary = async(req, res, next) => {
    try {

        const {documentId} = req.body

        if(!documentId){
            return res.status(404).json({
                error: "Provide document id"
            })
        }

        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
            status: 'ready'
        })
        
        if(!document){
            return res.status(404).json({
                error: "Document not found for the give documentId"
            })
        }

        

        const summary = await geminiService.generateSummary(document.extractedText)
        

        return res.status(201).json(
            {
                data: {
                    summary: summary,
                    title: document.title,
                    documentId: document._id
                }
            }
        )
        
    } catch (error) {
        next(error)
    }
}


export const chat = async(req, res, next) => {
    try {

        const {documentId, question} = req.body

        if(!documentId){
            return res.status(404).json({
                error: "Provide document id"
            })
        }

        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
            status: 'ready'
        })
        
        if(!document){
            return res.status(404).json({
                error: "Document not found for the give documentId"
            })
        }

        

        const relevantChunks = findRelevantChunks(document.chunks, question, 3)
        const chunkIndices = relevantChunks.map(c => c.chunkIndex)

        let chatHistory = await ChatHistory.findOne({
            userId: req.user._id,
            documentId: document._id
        })

        if(!chatHistory){
            chatHistory = await ChatHistory.create({
                userId: req.user._id,
                documentId: document._id,
                messages: []
            })
        }
        
        const answer = await geminiService.chatWithDocument(question, relevantChunks)
        console.log(answer)

        chatHistory.messages.push(
            {
                role: "user",
                content: question,
                timestamp: new Date(),
                relevantChunks: []
            },{
                role: "assistant",
                content: answer,
                timestamp: new Date(),
                relevantChunks: chunkIndices
            }
        )


        await chatHistory.save()


        return res.status(201).json(
            {
                data:{
                        answer: answer,
                        question: question,
                        chatHistoryId: chatHistory._id,
                        relevantChunks: chunkIndices
                    }
            }
        )
        
    } catch (error) {
        next(error)
    }
}


export const explainConcept = async(req, res, next) => {
    try {
        const {documentId, concept} = req.body

        if(!documentId || !concept){
            return res.status(404).json({
                error: "Provide document id and concept"
            })
        }

        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
            status: 'ready'
        })
        
        if(!document){
            return res.status(404).json({
                error: "Document not found for the give documentId"
            })
        }

        
        const relevantChunks = findRelevantChunks(document.chunks, concept, 3)
        const context = relevantChunks.map(c => c.content).join(`\n\n`)


        const explanation = await geminiService.explainConcept(concept, context)

        res.status(201).json({
            data: {
                concept,
                explanation,
                relevantChunks: relevantChunks.map(c => c.chunkIndex)
            }
        })
        
        

        return res.status(201).json(
            {
                data: {
                    summary: summary,
                    title: document.title,
                    documentId: document._id
                }
            }
        )
    } catch (error) {
        next(error)
    }
}

export const getChatHistory = async(req, res, next) => {
    try {
        const {documentId} = req.body

        if(!documentId){
            return res.status(404).json({
                error: "Provide document id"
            })
        }

        const chatHistory = await ChatHistory.findOne({
            documentId: documentId,
            userId: req.user._id
        }).select('messages')

        if(!chatHistory){
            return res.status(404).json({
                error: "Chat not found"
            })
        }

        res.status(201).json({
            chatHistory: chatHistory.messages
        })
        
        

        return res.status(201).json(
            {
                data: {
                    summary: summary,
                    title: document.title,
                    documentId: document._id
                }
            }
        )
    } catch (error) {
        next(error)
    }
}

