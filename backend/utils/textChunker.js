/**
 * GitHub Copilot
 *
 * Utility to split text into word-based chunks and to find relevant chunks by keyword matching.
 *
 * File: /c:/Users/whiteE/Desktop/AI-Powered Learning App/backend/utils/textChunker.js
 */

/**
 * Split text into chunks for better AI processing
 * @param {string} text - Full text to chunk
 * @param {number} chunkSize - Target size per chunk (in words)
 * @param {number} overlap - Number of words to overlap between chunks
 * @returns {Array<{content: string, chunkIndex:number, pageNumber:number}>}
 */
export function chunkText(text, chunkSize = 100, overlap = 25) {
    if (!text || typeof text !== 'string') return [];
    chunkSize = Math.max(1, Math.floor(chunkSize));
    overlap = Math.max(0, Math.floor(overlap));
    if (overlap >= chunkSize) overlap = Math.max(0, chunkSize - 1);

    // split into words (keeps punctuation attached to words)
    const words = text.trim().split(/\s+/);
    const step = Math.max(1, chunkSize - overlap);
    const chunks = [];

    for (let start = 0, idx = 0; start < words.length; start += step, idx++) {
        const slice = words.slice(start, start + chunkSize);
        const content = slice.join(' ').trim();
        const pageNumber = Math.floor(start / chunkSize) + 1; // approximate page by chunkSize words
        chunks.push({
            content,
            chunkIndex: idx,
            pageNumber,
        });
        if (start + chunkSize >= words.length) break;
    }

    return chunks;
}

/**
 * Find relevant chunks based on keyword matching
 * @param {Array<Object>} chunks - Array of chunks {content, chunkIndex, pageNumber}
 * @param {string} query - search query
 * @param {number} maxChunks - max chunks to return
 * @returns {Array<Object>}
 */
export function findRelevantChunks(chunks = [], query = '', maxChunks = 10) {
    if (!Array.isArray(chunks) || chunks.length === 0) return [];
    if (!query || typeof query !== 'string') return chunks.slice(0, Math.max(0, maxChunks));

    const terms = query
        .toLowerCase()
        .split(/\s+/)
        .map(t => t.trim())
        .filter(Boolean);

    if (terms.length === 0) return chunks.slice(0, Math.max(0, maxChunks));

    // escape helper for regex
    const escapeRegex = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // score each chunk by term occurrence count (case-insensitive, word-boundary)
    const scored = chunks.map(c => {
        const text = (c.content || '').toLowerCase();
        let score = 0;
        for (const term of terms) {
            const re = new RegExp(`\\b${escapeRegex(term)}\\b`, 'g');
            const matches = text.match(re);
            score += matches ? matches.length : 0;
        }
        return { chunk: c, score };
    });

    // sort by score desc, keep order for ties, return top results with score>0; if none match, return top chunks
    scored.sort((a, b) => b.score - a.score);

    const top = scored.filter(s => s.score > 0).slice(0, maxChunks).map(s => s.chunk);
    if (top.length > 0) return top;

    return scored.slice(0, Math.max(0, maxChunks)).map(s => s.chunk);
}

