import {GoogleGenAI} from '@google/genai';
import dotenv from "dotenv"

dotenv.config()

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY})

if(!process.env.GEMINI_API_KEY){
    console.log("Connection to gemini couldnt be established")
    process.exit(1)
}

/**
 * Generate flashcard from text
 * @param {string} text - document text
 * @param {number} count - number of flashcards to generate
 * @returns {Promise<Array<{question: string, answer: string, difficulty: string}>>}
 */
export async function generateFlashcards(text, count) {
    if (typeof text !== "string" || !text.trim()) throw new Error("text must be a non-empty string")
    if (!Number.isInteger(count) || count <= 0) throw new Error("count must be a positive integer")

    const prompt = `
You are an assistant that extracts learning flashcards from the provided document.
Create exactly ${count} flashcards. Each flashcard must be an object with three keys:
- "question": a concise question derived from the document
- "answer": a short, precise answer to the question
- "difficulty": one of "easy", "medium", or "hard"

Return output as a single valid JSON array (no additional text). Use only information found in the document.
Document:
"""${text.replace(/`/g, "'")}"""
`

    // prepare payload for common SDKs
    const payload = {
        model: "gemini-2.5-flash-lite",
        contents: prompt,
    }


    const rawResponse = await ai.models.generateContent(payload)
    const rawText = rawResponse.text

    

    // attempt to isolate JSON array in the returned text
    const jsonMatch = rawText.match(/\[[\s\S]*\]/)
    if (!jsonMatch) throw new Error("Model did not return a JSON array; got: " + (rawText.slice(0, 500)))

    let parsed
    try {
        parsed = JSON.parse(jsonMatch[0])
    } catch (err) {
        throw new Error("Failed to parse JSON from model output: " + err.message)
    }

    if (!Array.isArray(parsed)) throw new Error("Parsed output is not an array")
    // normalize and validate items
    const normalized = parsed.slice(0, count).map((it, idx) => {
        if (!it || typeof it !== "object") throw new Error(`Item ${idx} is not an object`)
        const question = String(it.question || "").trim()
        const answer = String(it.answer || "").trim()
        const difficulty = String(it.difficulty || "").toLowerCase()
        if (!question || !answer) throw new Error(`Item ${idx} must include question and answer`)
        if (!["easy", "medium", "hard"].includes(difficulty)) {
            // try to infer difficulty or default to medium
            return { question, answer, difficulty: "medium" }
        }
        return { question, answer, difficulty }
    })

    // if model returned fewer than requested, it's still acceptable; ensure length <= count
    return normalized
}

/**
 * Generate quiz section
 * @param {string} text - Document text
 * @param {number} numQuestions - number of question
 * @returns {Promise<Array<{question: string, options: Array<string>, correctAnswer: string, explanation: string, difficulty: string}>>}
 */
export async function generateQuiz(text, numQuestions) {
    if (typeof text !== "string" || !text.trim()) throw new Error("text must be a non-empty string")
    if (!Number.isInteger(numQuestions) || numQuestions <= 0) throw new Error("numQuestions must be a positive integer")

    const prompt = `
You are an assistant that creates multiple-choice quiz questions from the provided document.
Produce exactly ${numQuestions} quiz items. Each item must be an object with the following keys:
- "question": a concise question derived only from the document
- "options": an array of 4 short answer choices (strings)
- "correctAnswer": the exact text of the correct choice (must match one element in options)
- "explanation": a brief explanation (1-2 sentences) justifying the correct answer using text from the document
- "difficulty": one of "easy", "medium", or "hard"

Return the result as a single valid JSON array with no surrounding text. Use only information present in the document.
Document:
"""${text.replace(/`/g, "'")}"""
`

    
    const payload = { model: "gemini-2.5-flash-lite", contents: prompt}
    const raw = await ai.models.generateContent(payload)
    const rawText = raw.text
    

    const arrMatch = rawText.match(/\[[\s\S]*\]/)
    if (!arrMatch) throw new Error("Model did not return a JSON array; got: " + rawText.slice(0, 500))

    let parsed
    try { parsed = JSON.parse(arrMatch[0]) } catch (err) { throw new Error("Failed to parse JSON from model output: " + err.message) }

    if (!Array.isArray(parsed)) throw new Error("Parsed output is not an array")

    const normalizeDifficulty = d => {
        if (!d) return "medium"
        const s = String(d).toLowerCase()
        if (["easy", "medium", "hard"].includes(s)) return s
        if (s.includes("easy")) return "easy"
        if (s.includes("hard")) return "hard"
        return "medium"
    }

    const normalizeString = v => (v === null || v === undefined) ? "" : String(v).trim()

    const normalized = parsed.slice(0, numQuestions).map((it, i) => {
        if (!it || typeof it !== "object") throw new Error(`Item ${i} is not an object`)
        const question = normalizeString(it.question)
        const optionsRaw = it.options || it.choices || it.answers || []
        const options = Array.isArray(optionsRaw) ? optionsRaw.map(o => normalizeString(o)).filter(Boolean) : []
        const correctAnswer = normalizeString(it.correctAnswer || it.answer || it.correct)
        const explanation = normalizeString(it.explanation || it.explain || "")
        const difficulty = normalizeDifficulty(it.difficulty)

        if (!question) throw new Error(`Item ${i} is missing a question`)
        if (!Array.isArray(options) || options.length < 2) throw new Error(`Item ${i} must include at least 2 options`)
        // ensure options are unique and strings
        const uniqOptions = [...new Set(options)]
        if (!uniqOptions.includes(correctAnswer)) {
            // If correctAnswer not provided or mismatched, try to infer by position or default to first option
            const inferred = uniqOptions[0] || ""
            return { question, options: uniqOptions, correctAnswer: inferred, explanation: explanation || "", difficulty }
        }
        return { question, options: uniqOptions, correctAnswer, explanation, difficulty }
    })

    return normalized
}

/**
 * Generate document summary
 * @param {string} text - Document text
 * @returns {Promise<string>}
 */
export async function generateSummary(text) {
    if (typeof text !== "string" || !text.trim()) throw new Error("text must be a non-empty string")

    const prompt = `
You are an assistant that produces a concise plain-text summary of the provided document.
Use only information present in the document. Produce a single paragraph (6-10 sentences) highlighting the key points. Do not include JSON, annotations, or any metadata.
Document:
"""${text.replace(/`/g, "'")}"""
`

    

    const payload = { model: "gemini-2.5-flash-lite", contents: prompt}
    const raw = await ai.models.generateContent(payload)
    const rawText = raw.text
    if (!rawText) throw new Error("Model returned an empty summary")
    return rawText
}

/**
 * Explain a specific concept in a given context
 * @param {string} concept - Concept to explain
 * @param {string} context - Relevant context
 * @returns {Promise<string>}
 */
export async function explainConcept(concept, context) {
    if (typeof concept !== "string" || !concept.trim()) throw new Error("concept must be a non-empty string")
    if (typeof context !== "string" || !context.trim()) throw new Error("context must be a non-empty string")

    const prompt = `
You are an assistant that provides a clear, concise plain-text explanation of a single concept tailored to the provided context.
Explain the concept "${concept.replace(/`/g, "'")}" using only information present in the context. Keep the explanation focused and practical.
Produce a single paragraph (2-4 sentences). Do not include JSON, lists, examples, annotations, or any extraneous text.
Context:
"""${context.replace(/`/g, "'")}"""
`

    const payload = { model: "gemini-2.5-flash-lite", contents: prompt}
    const raw = await ai.models.generateContent(payload)
    const text = raw.text
    if (!text) throw new Error("Model returned an empty explanation")
    return text
}

/**
 * Chat with document context
 * @param {string} question - User question
 * @param {Array<Object|string>} chunks - Relevant document chunks (objects with `.text`/`.content` or plain strings)
 * @returns {Promise<string>}
 */
export async function chatWithDocument(question, chunks) {
    if (typeof question !== "string" || !question.trim()) throw new Error("question must be a non-empty string")
    if (!Array.isArray(chunks) || chunks.length === 0) throw new Error("chunks must be a non-empty array")

    const normalizeChunk = (c, idx) => {
        if (typeof c === "string") return c
        if (c && typeof c === "object") return String(c.text || c.content || c.chunk || c.body || `{"chunkIndex":${idx}}`)
        return String(c)
    }

    const doc = chunks.map((c, i) => `Chunk ${i + 1}:\n${normalizeChunk(c, i)}`).join("\n\n")

    const safeDoc = doc.replace(/`/g, "'")
    const safeQuestion = question.replace(/`/g, "'")

    const prompt = `
You are an assistant that answers a user's question using only the information present in the provided document chunks.
Answer the question concisely and directly. If the answer cannot be determined from the provided chunks, respond: "I don't know based on the provided documents."
When stating facts, cite the chunk number(s) in parentheses after the sentence (e.g., (Chunk 2)). Keep the answer to at most three sentences. Return plain text only (no JSON, lists, or metadata).

Question:
"""${safeQuestion}"""

Document chunks:
"""${safeDoc}"""
`

    const payload = { model: "gemini-2.5-flash-lite", contents: prompt }
    
    const raw = await ai.models.generateContent(payload)
    const text = raw.text
    

    if (!text) throw new Error("Model returned an empty response")
    return text
}
