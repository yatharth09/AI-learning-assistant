import axiosInstance from "../utils/axiosInstance.js";
import { API_PATHS } from "../utils/apiPaths";


const getQuizForDocument = async(documentId) => {
    try {
        const response = await axiosInstance.get(API_PATHS.QUIZ.GET_QUIZ_FOR_DOC(documentId))
        
        return response.data
        
    } catch (error) {
        throw error.response?.data || {Message: "Something went wrong while connecting with the server"}
    }
}

const getQuizById = async(quizId) => {
    try {
        const response = await axiosInstance.get(API_PATHS.QUIZ.GET_QUIZ_BY_ID(quizId))

        return response.data
        
    } catch (error) {
        throw error.response?.data || {Message: "Something went wrong while connecting with the server"}
    }
}

const submitQuiz = async(quizId, answers) => {
    try {
        const response = await axiosInstance.post(API_PATHS.QUIZ.SUBMIT_QUIZ(quizId), {answers})
        
        return response;
    } catch (error) {
        throw error.response?.data || {Message: "Something went wrong while connecting with the server"}
    }
}

const getQuizResults = async(quizId) => {
    try {
        const response = await axiosInstance.post(API_PATHS.QUIZ.GET_QUIZ_RESULTS(quizId))

        return response.data
        
    } catch (error) {
        throw error.response?.data || {Message: "Something went wrong while connecting with the server"}
    }
}

const deleteQuiz = async(quizId) => {
    try {
        const response = await axiosInstance.delete(API_PATHS.QUIZ.DLETE_QUIZ(quizId))

        return response
        
    } catch (error) {
        throw error.response?.data || {Message: "Something went wrong while connecting with the server"}
    }
}




const quizService = {
    getQuizById,
    getQuizForDocument,
    getQuizResults,
    deleteQuiz,
    submitQuiz
}

export default quizService;