import Quiz from '../models/Quiz.js'


export const getQuiz = async(req, res, next) => {
    try {
        const quiz = await Quiz.find({
            userId: req.user._id,
            documentId: req.params.documentId
        }).populate('documentId', 'title fileName').sort({createdAt: -1})

        console.log(quiz)

        res.status(200).json({
            count: quiz.length,
            data: quiz
        })


        
    } catch (error) {
        next(error)
    }
}


export const getQuizById = async(req, res, next) => {
    try {
        const quiz = await Quiz.find({
            userId: req.user._id,
            _id: req.params.id
        })

        if(!quiz){
            return res.status(404).json({
                error: "Quiz not found"
            })
        }

        res.status(200).json({
            data: quiz
        })
        
    } catch (error) {
        next(error)
    }
}


export const submitQuiz = async(req, res, next) => {
    try {

        
        const {answers} = req.body
        
        

        if(!Array.isArray(answers)){
            return res.status(400).json({
                success: false,
                error: "Provide answers array"
            })
        }

        const quiz = await Quiz.findOne({
            _id: req.params.id,
            userId: req.user._id
        })

        

        if(!quiz){
            return res.status(404).json({
                error: "quiz not found"
            })
        }

        if(quiz.completedAt){
            return res.status(400).json({
                message: "Quiz already submitted"
            })
        }

        let totalCorrect = 0
        const userAnswers = []
       
        answers.forEach(answer => {
            const {questionIndex, selectedAnswer} = answer

            if(quiz.questions && questionIndex < quiz.questions.length){
                const question = quiz.questions[questionIndex]
                const isCorrect = selectedAnswer == question.correctAnswer

                if(isCorrect){
                    totalCorrect+= 1
                }

                userAnswers.push({
                    questionIndex,
                    selectedAnswer,
                    isCorrect,
                    createdAt: new Date()
                })
            }
                
        })

        const score = Math.floor((totalCorrect/quiz.questions.length) * 100)

                quiz.userAnswers = userAnswers
                quiz.score = score
                quiz.completedAt = new Date()



                await quiz.save();

                return res.status(200).json({
                    data: quiz
                })
        
    } catch (error) {
        next(error)
    }
}


export const getQuizResults = async(req, res, next) => {
    try {
        const quiz = await Quiz.findOne({
            _id: req.params.id,
            userId: req.user._id
        }).populate('documentId', 'title')

        if(!quiz){
            return res.status(404).json({
                error: "Quiz not found"
            })
        }

        // if(quiz.completedAt){
        //     return res.status(400).json({
        //         message: "Quiz already submitted"
        //     })
        // }

        const detailedResult = quiz.questions.map((question, index) => {
            const userAnswer = quiz.userAnswers.find(a => a.questionIndex === index)
            
            return {
                questionIndex: index,
                question: question.question,
                options: question.options,
                correctAnswer: question.correctAnswer,
                selectedAnswer: userAnswer?.selectedAnswer || null,
                isCorrect: userAnswer?.isCorrect || null,
                explanation: question.explanation
            }
        })

        res.status(200).json({
            quiz,
            detailedResult
        })
        
    } catch (error) {
        next(error)
    }
}


export const deleteQuiz = async(req, res, next) => {
    try {
        const quiz = await Quiz.findOne({
            _id: req.params.id,
            userId: req.user._id
        })

        if(!quiz){
            return res.status(404).json({
                error: "Quiz not found"
            })
        }

        await quiz.deleteOne()

        res.status(200).json({
            message: "Quiz deleted"
        })


    } catch (error) {
        next(error)
    }
}