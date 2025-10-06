import type { Question } from '../types/database'

export interface RandomizedQuestion extends Omit<Question, 'correct_answer'> {
  randomized_options: string[]
  correct_answer_index: number // New index after randomization
  original_order: number[] // Track original positions for debugging
}

/**
 * Creates a deterministic random seed based on student ID and question ID
 * This ensures each student gets the same randomization every time they see the question
 */
function createSeed(studentId: string, questionId: number): number {
  let hash = 0
  const str = `${studentId}-${questionId}`

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }

  return Math.abs(hash)
}

/**
 * Simple seeded random number generator
 */
class SeededRandom {
  private seed: number

  constructor(seed: number) {
    this.seed = seed
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280
    return this.seed / 233280
  }

  shuffle<T>(array: T[]): T[] {
    const shuffled = [...array]

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }

    return shuffled
  }
}

/**
 * Randomizes question options for a specific student
 * Returns the question with shuffled options and updated correct answer index
 */
export function randomizeQuestionOptions(
  question: Question,
  studentId: string
): RandomizedQuestion {
  // Create deterministic seed for this student + question combination
  const seed = createSeed(studentId, question.id)
  const random = new SeededRandom(seed)

  // Create array of option objects with their original indices
  const optionObjects = question.options.map((text, index) => ({
    text,
    originalIndex: index
  }))

  // Shuffle the options
  const shuffledOptions = random.shuffle(optionObjects)

  // Extract just the text for display
  const randomized_options = shuffledOptions.map(opt => opt.text)

  // Find where the correct answer ended up
  const correct_answer_index = shuffledOptions.findIndex(opt =>
    opt.text === question.correct_answer_text
  )

  // Track original order for debugging
  const original_order = shuffledOptions.map(opt => opt.originalIndex)

  return {
    ...question,
    randomized_options,
    correct_answer_index,
    original_order
  }
}

/**
 * Validates if a student's answer is correct using the randomized question
 */
export function validateRandomizedAnswer(
  randomizedQuestion: RandomizedQuestion,
  selectedAnswerIndex: number
): boolean {
  return selectedAnswerIndex === randomizedQuestion.correct_answer_index
}

/**
 * Gets the original answer index from a randomized selection
 * Useful for storing results in the original format
 */
export function getOriginalAnswerIndex(
  randomizedQuestion: RandomizedQuestion,
  selectedAnswerIndex: number
): number {
  return randomizedQuestion.original_order[selectedAnswerIndex]
}