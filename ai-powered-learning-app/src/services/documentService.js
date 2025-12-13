import axiosInstance from "../utils/axiosInstance.js";
import { API_PATHS } from "../utils/apiPaths";


const deleteDocuments = async(id) => {
    try {
        const response = await axiosInstance.delete(API_PATHS.DOCUMENTS.DELETE_DOCUMENTS(id))
        
        return response
        
    } catch (error) {
        throw error.response?.data || {Message: "Something went wrong while connecting with the server"}
    }
}

const getDocuments = async() => {
    try {
        const response = await axiosInstance.get(API_PATHS.DOCUMENTS.GET_DOCUMENTS)

        return response.data
        
    } catch (error) {
        throw error.response?.data || {Message: "Something went wrong while connecting with the server"}
    }
}

const getDocumentsById = async(documentId) => {
    try {
        const response = await axiosInstance.get(API_PATHS.DOCUMENTS.GET_DOCUMENTS_BY_ID(documentId))
        
        return response;
    } catch (error) {
        throw error.response?.data || {Message: "Something went wrong while connecting with the server"}
    }
}

const uploadDocument = async(formData) => {
    try {
        const response = await axiosInstance.post(API_PATHS.DOCUMENTS.UPLOAD, formData,{
            headers: {
                'Content-Type': 'multipart/form-data',
            },

        })

        return response
        
    } catch (error) {
        throw error.response?.data || {Message: "Something went wrong while connecting with the server"}
    }
}



const documentService = {
    getDocuments,
    getDocumentsById,
    uploadDocument,
    deleteDocuments,
}

export default documentService;