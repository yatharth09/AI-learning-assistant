import axiosInstance from "../utils/axiosInstance.js";
import { API_PATHS } from "../utils/apiPaths";


const getAllFlashcardSets = async() => {
    try {
        const response = await axiosInstance.get(API_PATHS.FLASHCARDS.GET_ALL_FLASHCARD_SETS)
        
        return response.data
        
    } catch (error) {
        throw error.response?.data || {Message: "Something went wrong while connecting with the server"}
    }
}

const getFlashcardsForDocument = async(documentId) => {
    try {
        const response = await axiosInstance.get(API_PATHS.FLASHCARDS.GET_FLASHCARDS_FOR_DOCS(documentId))

        return response.data
        
    } catch (error) {
        throw error.response?.data || {Message: "Something went wrong while connecting with the server"}
    }
}

const reviewFlashcard = async(cardId, cardIndex) => {
    try {
        const response = await axiosInstance.post(API_PATHS.FLASHCARDS.REVIEW_FLASHCARD(cardId), {cardIndex})
        
        return response;
    } catch (error) {
        throw error.response?.data || {Message: "Something went wrong while connecting with the server"}
    }
}

const toggleStar = async(cardId) => {
    try {
        const response = await axiosInstance.post(API_PATHS.FLASHCARDS.TOGGLE_STAR(cardId))

        return response.data
        
    } catch (error) {
        throw error.response?.data || {Message: "Something went wrong while connecting with the server"}
    }
}

const deleteFlashcardSet = async(id) => {
    try {
        const response = await axiosInstance.delete(API_PATHS.FLASHCARDS.DELETE_FLASHCARD_SET(id))

        return response
        
    } catch (error) {
        throw error.response?.data || {Message: "Something went wrong while connecting with the server"}
    }
}



const flashcardService = {
    getAllFlashcardSets,
    getFlashcardsForDocument,
    toggleStar,
    deleteFlashcardSet,
    reviewFlashcard
}

export default flashcardService;