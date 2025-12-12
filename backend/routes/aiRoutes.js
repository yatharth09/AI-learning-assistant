import express from 'express'
import protect from '../middleware/auth.js';
import {generateFlashcards, generateQuiz, generateSummary, chat, explainConcept, getChatHistory} from '../controllers/aiController.js'

const router = express.Router();
router.use(protect)

router.get("/chat-history/:documentId", getChatHistory)
router.post("/chat", chat)
router.post("/generateQuiz", generateQuiz)
router.post("/generateSummary", generateSummary)
router.post("/generateFlashcards", generateFlashcards)
router.post("/explainConcept", explainConcept)



export default router;