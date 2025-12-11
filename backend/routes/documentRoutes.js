import express from 'express';
import { body } from 'express-validator';
import { getDocuments, uploadDocument, updateDocument, deleteDocument, getDocument} from '../controllers/documentController.js';
import protect from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

const registerValidation = [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

const loginValidaiton = [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required')
];

router.get('/', getDocuments);
router.post('/upload', upload.single('file'), uploadDocument);
router.put('/:id', updateDocument);
router.delete('/:id', deleteDocument);
router.get('/:id', getDocument);

export default router;