export const BASE_URL = "http://localhost:5000"

export const API_PATHS = {
    AUTH: {
        REGISTER: "api/auth/register" ,
        LOGIN: "api/auth/login",
        GET_PROFILE: "api/auth/profile",
        UPDATE_PROFILE: "api/auth/profile",
        CHANGE_PASSWORD: "api/auth/change-password",
    },
    DOCUMENTS: {
        UPLOAD: "/api/documents/upload",
        GET_DOCUMENTS: "/api/documents",
        GET_DOCUMENTS_BY_ID:(id) => `/api/documents/${id}` ,
        DELETE_DOCUMENTS:(id) => `/api/documents/${id}`,
    },
    AI: {
        GENERATE_FLASHCARDS: "/api/ai/generate-flashcards",
        GENERATE_QUIZ: "/api/ai/generate-quiz",
        GENERATE_SUMMARY: "/api/ai/generate-summary",
        CHAT: "/api/ai/chat",
        EXPLAIN_CONCEPT: "/api/ai/explain-concept",
        GET_CHAT_HISTORY:(documentId) =>  `/api/ai/chat-history/${documentId}`,
    },
    FLASHCARDS: {
        GET_ALL_FLASHCARD_SETS: "/api/flashcards",
        GET_FLASHCARDS_FOR_DOCS: (documentId)=> `/api/flashcards/${documentId}`,
        REVIEW_FLASHCARD:(cardId) => `/api/flashcards/${cardId}/review`,
        TOGGLE_STAR:(cardId) => `/api/flashcards/${cardId}/star`,
        DELETE_FLASHCARD_SET:(id) =>  `/api/flashcards/${id}`,

    },
    QUIZ: {
        GET_QUIZ_FOR_DOC: (documentId) => `/api/quizz/${documentId}`,
        GET_QUIZ_BY_ID: (id) => `/api/quizz/quiz/${id}`,
        SUBMIT_QUIZ:(id) => `/api/quizz/${id}/submit`,
        GET_QUIZ_RESULTS:(id) => `/api/quizz/${id}/results`,
        DLETE_QUIZ:(id) => `/api/quizz/${id}`,

    },
    PROGRESS: {
        GET_DASHBOARD: "/api/progress/dashboard",
    }
}