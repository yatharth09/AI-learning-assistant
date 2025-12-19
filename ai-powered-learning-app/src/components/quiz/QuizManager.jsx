import React, {useState, useEffect} from 'react'
import {Plus, Trash2} from 'lucide-react'
import toast from 'react-hot-toast'
import quizService from '../../services/quizService.js'
import aiService from '../../services/aiService.js'
import Button from '../common/Button.jsx'
import Modal from '../common/Modal.jsx'
import QuizCard from './QuizCard.jsx'
import EmptyState from '../common/EmptyState.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

const QuizManager = ({documentId}) => {

    const [quizs, setQuizs] = useState([])
    const {handleNotification} = useAuth()
    const [loading, setLoading] = useState(true)
    const [generating, setGenerating] = useState(false)
    const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false)
    const [numQuestions, setNumQuestions] = useState(5)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [selectedQuiz, setSelectedQuiz] = useState(null)

    const fetchQuiz = async() => {
        setLoading(true)
        try {
            const data = await quizService.getQuizForDocument(documentId)
            setQuizs(data.data)
        } catch (error) {
            toast.error("Failed to fetch quiz")
            handleNotification("Failed to fetch quiz")
            console.error(error)
        }finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        if(documentId) fetchQuiz()
        
    }, [documentId])

    const handleGenerateQuiz = async(e) => {
        e.preventDefault()
        setGenerating(true)
        try {
            await aiService.generateQuiz(documentId, numQuestions, "Quiz")
            toast.success('Quiz generated successfully!')
            handleNotification('Quiz generated successfully!')
            setIsGenerateModalOpen(false)
            fetchQuiz()
        } catch (error) {
            toast.error(error.message || "Failed to generate quiz")
            handleNotification(error.message || "Failed to generate quiz")
        } finally{
            setGenerating(false)
        }
    }

    const handleDeleteRequest = (quiz) => {
        setSelectedQuiz(quiz)
        setIsDeleteModalOpen(true)
    }

    const handleConfirmDelete = async () => {
        if(!selectedQuiz) return;
        setDeleting(true)
        try {
            await quizService.deleteQuiz(selectedQuiz._id)
            toast.success(`${selectedQuiz.title || 'Quiz'} deleted.`)
            handleNotification(`${selectedQuiz.title || 'Quiz'} deleted.`)
            setIsDeleteModalOpen(false)
            setSelectedQuiz(null)
            setQuizs(quizs.filter(q => q._id !== selectedQuiz._id))
        } catch (error) {
            toast.error(error.message || 'Failed to delete quiz')
            handleNotification(error.message || 'Failed to delete quiz')
        }finally{
            setDeleting(false)
        }
    }

    const renderQuizContent = () => {
        if(loading){
            return <>Loading...</>
        }

        if (quizs.length === 0){
            return(
                <EmptyState
                    title="No Quiz yet"
                    description="Generate a quiz from your document to test your knowledge"
                    />
            )
        }

        return (
            <div>
                {quizs.map((quiz) => (
                    <QuizCard key={quiz._id} quiz={quiz} onDelete={handleDeleteRequest} />
                ))}
            </div>
        )

    }

  return (
    <div className='bg-white border botder-neutral-200 rounded-lg p-6'>
        <div className='flex justify-end gap-2 mb-4'>
            <Button onClick={() => setIsGenerateModalOpen(true)} className ='' >
                <Plus size={16} />
                Generate Quiz
            </Button>
        </div>

        {renderQuizContent()}

        <Modal isOpen={isGenerateModalOpen}
            onClose={() => setIsGenerateModalOpen(false)}
            title="Generate new  quiz" >
                <div className='space-y-4'>
                    <div>
                        <label className='block text-xs font-medium text-neutral-700 mb-1.5'>Number of Questions</label>
                        <input type="number" value={numQuestions} onChange={(e) => setNumQuestions(Math.max(1, parseInt(e.target.value) || 1))}
                        min={1} required className='w-full h-9 px-3 border border-neutral-200 rounded-lg bg-white text-sm text-neutral-900 placeholder-neutral-400 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#00d492] focus:border-transparent' />
                    </div>
                    <div className='flex justify-end gap-2 pt-2'>
                        <Button type='button' variant='secondary' onClick={() => setIsGenerateModalOpen(false)} disabled={generating}>
                            Cancel
                        </Button>
                        <Button onClick={handleGenerateQuiz} disabled={generating}>
                            {generating? "Generating...": "Generate"}
                        </Button>
                    </div>
                </div>

        </Modal>


        <Modal isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            title="Delete selected quiz" >
                <div className='space-y-4'>
                    <p className='text-sm text-neutral-600'>
                        Are you sure you want to delete the quiz: <span className='font-semibold text-neutral-900'>{selectedQuiz?.title || "This quiz"}</span>? This action cannot be reversed.
                    </p>
                    <div className='flex justify-end gap-2 pt-2'>
                        <Button type='button' variant='secondary' onClick={() => setIsDeleteModalOpen(false)} disabled={deleting}>
                            Cancel
                        </Button>
                        <Button className='bg-red-500 hover:bg-red-600 active:bg-red-700 focus:ring-red-500 ' disabled={deleting} onClick={handleConfirmDelete}>
                            {deleting? "Deleting...": "Delete"}
                        </Button>
                    </div>
                </div>

        </Modal>
    </div>
  )
}

export default QuizManager