import express from 'express';
import { getDocuments, uploadDocument,  deleteDocument, getDocument} from '../controllers/documentController.js';
import protect from '../middleware/auth.js';
import upload from '../config/multer.js';

const router = express.Router();
router.use(protect);

router.get('/', getDocuments);
router.post('/upload', upload.single('file'), uploadDocument);
router.delete('/:id', deleteDocument);
router.get('/:id', getDocument);

export default router;