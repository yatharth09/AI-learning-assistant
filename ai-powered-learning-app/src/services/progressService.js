import axiosInstance from '../utils/axiosInstance.js'
import { API_PATHS } from '../utils/apiPaths.jsx'

const getDashboardData = async() => {
    try {
        const response = await axiosInstance.get(API_PATHS.PROGRESS.GET_DASHBOARD)
        return response
        
    } catch (error) {
        throw error.response?.data || {message: "Failed to fetch dashboard statistics"}
    }
}

const progressService = {
    getDashboardData
}

export default progressService