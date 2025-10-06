import type { Question } from '../../types/database'
import type { RandomizedQuestion } from '../../utils/optionRandomizer'

interface QuestionDisplayProps {
  question: Question | RandomizedQuestion
  selectedAnswer?: number
  onAnswerSelect: (optionIndex: number) => void
}

const QuestionDisplay = ({ question, selectedAnswer, onAnswerSelect }: QuestionDisplayProps) => {
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Disable common copy shortcuts
    if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'a' || e.key === 's' || e.key === 'p')) {
      e.preventDefault()
    }
    // Disable F12 (DevTools)
    if (e.key === 'F12') {
      e.preventDefault()
    }
  }

  // Determine which options to display (randomized or original)
  const isRandomized = 'randomized_options' in question
  const optionsToDisplay = isRandomized
    ? (question as RandomizedQuestion).randomized_options
    : question.options

  return (
    <div
      className="question-display copy-protected"
      onContextMenu={handleContextMenu}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="question-text">
        <h3>Soal {question.id}</h3>
        <p>{question.question_text}</p>

        {/* Display image if available */}
        {question.image_url && (
          <div className="question-image">
            <img
              src={question.image_url}
              alt="Question illustration"
              onContextMenu={handleContextMenu}
              draggable={false}
            />
          </div>
        )}
      </div>

      <div className="answer-options">
        {optionsToDisplay.map((option, index) => (
          <div
            key={index}
            className={`option ${selectedAnswer === index ? 'selected' : ''}`}
            onClick={() => onAnswerSelect(index)}
          >
            <div className="option-letter">
              {String.fromCharCode(65 + index)}
            </div>
            <div className="option-text copy-protected">
              {option}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default QuestionDisplay