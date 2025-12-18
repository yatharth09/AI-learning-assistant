import express from "express"
import protect from "../middleware/auth.js"
import {getQuiz, getQuizById, submitQuiz, getQuizResults, deleteQuiz} from '../controllers/quizController.js'


const router = express.Router()

router.use(protect)

router.get('/:documentId', getQuiz);
router.get('/quiz/:id', getQuizById);
router.post('/:id/submit', submitQuiz );
router.post('/:id/result', getQuizResults);
router.delete('/:id', deleteQuiz);

export default router