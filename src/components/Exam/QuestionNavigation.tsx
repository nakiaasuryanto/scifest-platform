import type { Question } from '../../types/database'

interface QuestionNavigationProps {
  questions: Question[]
  currentQuestion: number
  answers: { [key: string]: number }
  doubtfulQuestions: Set<number>
  subtestIndex: number
  onQuestionSelect: (questionIndex: number) => void
}

const QuestionNavigation = ({
  questions,
  currentQuestion,
  answers,
  doubtfulQuestions,
  subtestIndex,
  onQuestionSelect
}: QuestionNavigationProps) => {
  const getQuestionStatus = (questionIndex: number): string => {
    const questionKey = `${subtestIndex}-${questionIndex}`
    const isAnswered = answers[questionKey] !== undefined
    const isDoubtful = doubtfulQuestions.has(parseInt(questionKey))
    const isCurrent = questionIndex === currentQuestion

    if (isCurrent) return 'current'
    if (isAnswered && !isDoubtful) return 'answered'
    if (isDoubtful) return 'doubtful'
    return 'unanswered'
  }

  return (
    <div className="question-navigation">
      <h3>Navigasi Soal</h3>
      <div className="question-grid">
        {questions.map((_, index) => (
          <button
            key={index}
            className={`question-number ${getQuestionStatus(index)}`}
            onClick={() => onQuestionSelect(index)}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <div className="legend">
        <div className="legend-item">
          <div className="legend-color current"></div>
          <span>Soal Aktif</span>
        </div>
        <div className="legend-item">
          <div className="legend-color answered"></div>
          <span>Sudah Dijawab</span>
        </div>
        <div className="legend-item">
          <div className="legend-color doubtful"></div>
          <span>Ragu-ragu</span>
        </div>
        <div className="legend-item">
          <div className="legend-color unanswered"></div>
          <span>Belum Dijawab</span>
        </div>
      </div>
    </div>
  )
}

export default QuestionNavigation