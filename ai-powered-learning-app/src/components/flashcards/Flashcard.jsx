import { useState } from "react"
import { Star, RotateCcw} from 'lucide-react'

const Flashcard = ({flashcard, onToggleStar}) => {
    const [isFlipped, setIsFlipped] = useState(false)

    const handleFlip = () => {
        setIsFlipped(!isFlipped)
    }

  return (
    <div className="" style={{perspective: '1000px'}}>
        <div className={`relative w-full h-full transition-transform duration-500 transform-gpu cursor-pointer`}
            style={{
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
            }}
            onClick={handleFlip}
        >

        </div>
    </div>
  )
}

export default Flashcard