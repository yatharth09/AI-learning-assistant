import Flashcard from "../models/Flashcard.js"


export const getFlashcards = async (req, res, next) => {
    try {
        const flashcards = await Flashcard.find({
            userId: req.user._id,
            documentId: req.params.documentId 
        }).populate('documentId', 'title filename').sort({createAt: -1})

        return res.status(200).json({
            count: flashcards.length,
            data: flashcards
        })
    } catch (error) {
        next(error)    
    }
}

export const getAllFlashcardSets = async (req, res, next) => {
    try {
        const flashcardSets = await Flashcard.find({userId: req.user._id}).populate('documentId', 'title').sort({createdAt: -1})

        return res.status(200).json({
            count: flashcardSets.length,
            data: flashcardSets
        })
    } catch (error) {
        next(error)    
    }
}

export const reviewFlashcard = async(req, res, next) => {
    try {
        const flashcardSet = await Flashcard.findOne({"cards._id": req.params.cardId, userId: req.user._id})
        console.log(flashcardSet)

        if(!flashcardSet){
            return res.status(404).json({
                message: "Flashcard set not found"
            })
        }

        // const cardIndex = flashcardSet.cards.findIndex(card => card._id.toString() === req.params.cardId)
        
        const cardIndex = req.body.cardIndex

        if(cardIndex === -1){
            return res.status(404).json({
                message: "Card not found in card set"
            })
        }

        flashcardSet.cards[cardIndex].lastReviewed = new Date()
        flashcardSet.cards[cardIndex].reviewCount += 1

        await flashcardSet.save();

        return res.status(200).json({
            message: "Flash Card review count updated successfully",
            data: flashcardSet
        })

        
    } catch (error) {
        next(error)    
    }
}

export const toggleStarFlashcard = async(req, res, next) => {
    try {
        const flashcardSet = await Flashcard.findOne({
            "cards._id": req.params.cardId,
            userId: req.user._id
        })

        if(!flashcardSet){
            return res.status(404).json({
                message: "Flash card/Flash set not found"
            })
        }

        const cardIndex = flashcardSet.cards.findIndex(card => card._id.toString() === req.params.cardId)

        if(cardIndex === -1){
            return res.status(404).json({
                message: "Card not found in card set"
            })
        }

        flashcardSet.cards[cardIndex].isStarred = !flashcardSet.cards[cardIndex].isStarred

        await flashcardSet.save();

        return res.status(200).json({
            message: "Flash Card star toggle updated successfully",
            data: flashcardSet
        })

        
        
    } catch (error) {
        next(error)    
    }
}

export const deleteFlashcardSet = async(req, res, next) => {
    try {
        const flashcardSet = await Flashcard.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if(!flashcardSet){
            return res.status(404).json({
                message: "Flash card/Flash set not found"
            })
        }

        await flashcardSet.deleteOne()

        return res.status(200).json({
            messsage: "Flashcard deleted successfully"
        })

        
    } catch (error) {
        next(error)    
    }
}

