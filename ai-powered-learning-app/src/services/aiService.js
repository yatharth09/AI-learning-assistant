import axiosInstance from "../utils/axiosInstance.js";
import { API_PATHS } from "../utils/apiPaths";


const generateFlashcards = async(documentId, count) => {
    try {
        const response = await axiosInstance.post(API_PATHS.AI.GENERATE_FLASHCARDS,{
            documentId,
            count
        })
        
        return response.data
        
    } catch (error) {
        throw error.response?.data || {Message: "Something went wrong while connecting with the server"}
    }
}

const generateQuiz = async(documentId, count,title) => {
    try {
        const response = await axiosInstance.post(API_PATHS.AI.GENERATE_QUIZ,{
            documentId,
            count
        })

        return response.data
        
    } catch (error) {
        throw error.response?.data || {Message: "Something went wrong while connecting with the server"}
    }
}

const generateSummary = async(documentId) => {
    try {
        const response = await axiosInstance.post(API_PATHS.AI.GENERATE_SUMMARY, {documentId})
        
        return response;
    } catch (error) {
        throw error.response?.data || {Message: "Something went wrong while connecting with the server"}
    }
}

const chat = async(documentId, message) => {
    try {
        const response = await axiosInstance.post(API_PATHS.AI.CHAT,{
            documentId,
            question: message
        })

        return response.data
        
    } catch (error) {
        throw error.response?.data || {Message: "Something went wrong while connecting with the server"}
    }
}

const explainConcept = async(documentId, concept) => {
    try {
        const response = await axiosInstance.post(API_PATHS.AI.EXPLAIN_CONCEPT,{
            documentId,
            concept
        })

        return response
        
    } catch (error) {
        throw error.response?.data || {Message: "Something went wrong while connecting with the server"}
    }
}


const getChatHistory = async(documentId) => {
    try {
        const response = await axiosInstance.get(API_PATHS.AI.GET_CHAT_HISTORY(documentId))

        return response
        
    } catch (error) {
        throw error.response?.data || {Message: "Something went wrong while connecting with the server"}
    }
}

const aiService = {
    explainConcept,
    getChatHistory,
    generateFlashcards,
    generateQuiz,
    generateSummary,
    chat
}

export default aiService;