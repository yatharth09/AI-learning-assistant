import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id) => {
    return jwt.sign( {id}, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
}

export const register = async (req, res, next) => {
    try {
        
    } catch (error) {
        
    }
}


export const login = async (req, res, next) => {
    try {
        
    } catch (error) {
        
    }
}


export const getProfile = async (req, res, next) => {
    try {
        
    } catch (error) {
        
    }
}


export const updateProfile = async (req, res, next) => {
    try {
        
    } catch (error) {
        
    }
}

export const changePassword = async (req, res, next) => {
    try {
        
    } catch (error) {
        
    }
}