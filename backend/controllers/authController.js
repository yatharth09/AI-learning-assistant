import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id) => {
    return jwt.sign( {id}, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
}

export const register = async (req, res, next) => {
    try {
        const {username , email, password} =  req.body;
        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).json({ message: 'User already exists' });
        }
        const user = await User.create({
            username,
            email,
            password
        });


        const token = generateToken(user._id)
        if(user){
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
                token,
                createdAt: user.createdAt,
            });
        } else {
            return res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        next(error);
    }
}


export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if(user && (await user.matchPassword(password))){
            const token = generateToken(user._id)
            res.status(200).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
                token,
                createdAt: user.createdAt,
            })
        } else {
            return  res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        next(error)
    }
}


export const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if(user){
            res.status(200).json(user);
        } else {
            return res.status(404).json({ message: 'User not found' });
        }
        
    } catch (error) {
        next(error)
    }
}


export const updateProfile = async (req, res, next) => {
    try {
        const {username, email, profileImage} = req.body;
        const user = await User.findById(req.user._id);
        if(user){
            user.username = username || user.username;
            user.email = email || user.email;
            user.profileImage = profileImage || user.profileImage;
        }

        await user.save();
        res.status(200).json(user);
        
    } catch (error) {
        next(error)
    }
}

export const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id);
        if(user && (await user.matchPassword(currentPassword))){
            user.password = newPassword;
            await user.save();
            res.status(200).json({ message: 'Password updated successfully' });
        } else {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }
    } catch (error) {
        next(error)
    }
}