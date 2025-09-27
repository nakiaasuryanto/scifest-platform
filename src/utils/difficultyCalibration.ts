// Difficulty Calibration System
// Uses first 20 students' responses to calculate question difficulties

export interface StudentResponse {
  student_id: string
  question_id: number
  subtest_id: number
  is_correct: boolean
  ability_estimate?: number
}

export interface CalibratedDifficulty {
  question_id: number
  subtest_id: number
  difficulty: number
  discrimination: number
  sample_size: number
  p_value: number // proportion correct
}

/**
 * Calculate question difficulty from pilot data (first 20 students)
 * Uses Classical Test Theory and then converts to IRT parameters
 */
export function calibrateQuestionDifficulties(
  pilotResponses: StudentResponse[]
): CalibratedDifficulty[] {
  // Group responses by question
  const questionGroups = new Map<string, StudentResponse[]>()

  pilotResponses.forEach(response => {
    const key = `${response.subtest_id}_${response.question_id}`
    if (!questionGroups.has(key)) {
      questionGroups.set(key, [])
    }
    questionGroups.get(key)!.push(response)
  })

  const calibratedDifficulties: CalibratedDifficulty[] = []

  questionGroups.forEach((responses, key) => {
    const [subtestId, questionId] = key.split('_').map(Number)

    // Calculate proportion correct (p-value)
    const correctResponses = responses.filter(r => r.is_correct).length
    const totalResponses = responses.length
    const pValue = correctResponses / totalResponses

    // Convert p-value to IRT difficulty using logistic transformation
    // difficulty = -ln(p/(1-p)) where p is proportion correct
    // Adjust for edge cases (0% or 100% correct)
    const adjustedP = Math.max(0.05, Math.min(0.95, pValue))
    const difficulty = -Math.log(adjustedP / (1 - adjustedP))

    // Estimate discrimination based on variance of responses
    // Higher variance = better discrimination
    const variance = pValue * (1 - pValue)
    const discrimination = Math.max(0.5, Math.min(2.0, variance * 4 + 0.8))

    calibratedDifficulties.push({
      question_id: questionId,
      subtest_id: subtestId,
      difficulty,
      discrimination,
      sample_size: totalResponses,
      p_value: pValue
    })
  })

  return calibratedDifficulties
}

/**
 * Check if we have enough pilot data for calibration
 */
export function hasSufficientPilotData(responses: StudentResponse[]): boolean {
  const uniqueStudents = new Set(responses.map(r => r.student_id))
  return uniqueStudents.size >= 20
}

/**
 * Get student IDs of first 20 students (pilot group)
 */
export function getPilotStudentIds(allStudentIds: string[]): string[] {
  return allStudentIds.slice(0, 20)
}

/**
 * Update IRT scoring to use calibrated difficulties
 */
export function updateIRTWithCalibratedDifficulties(
  calibratedDifficulties: CalibratedDifficulty[]
): Record<number, Array<{question_id: number, difficulty: number, discrimination: number}>> {
  const subtestDifficulties: Record<number, Array<{question_id: number, difficulty: number, discrimination: number}>> = {}

  calibratedDifficulties.forEach(item => {
    if (!subtestDifficulties[item.subtest_id]) {
      subtestDifficulties[item.subtest_id] = []
    }

    subtestDifficulties[item.subtest_id].push({
      question_id: item.question_id,
      difficulty: item.difficulty,
      discrimination: item.discrimination
    })
  })

  return subtestDifficulties
}

/**
 * Generate calibration report for admin review
 */
export function generateCalibrationReport(
  calibratedDifficulties: CalibratedDifficulty[]
): {
  totalQuestions: number
  averageDifficulty: number
  difficultyRange: { min: number, max: number }
  questionsNeedingReview: CalibratedDifficulty[]
  subtestSummary: Record<number, {
    questionCount: number
    avgDifficulty: number
    avgDiscrimination: number
  }>
} {
  const totalQuestions = calibratedDifficulties.length
  const difficulties = calibratedDifficulties.map(q => q.difficulty)
  const averageDifficulty = difficulties.reduce((sum, d) => sum + d, 0) / difficulties.length

  const difficultyRange = {
    min: Math.min(...difficulties),
    max: Math.max(...difficulties)
  }

  // Questions needing review (too easy <5% wrong or too hard >95% wrong)
  const questionsNeedingReview = calibratedDifficulties.filter(
    q => q.p_value < 0.05 || q.p_value > 0.95
  )

  // Subtest summary
  const subtestSummary: Record<number, any> = {}
  calibratedDifficulties.forEach(q => {
    if (!subtestSummary[q.subtest_id]) {
      subtestSummary[q.subtest_id] = {
        difficulties: [],
        discriminations: []
      }
    }
    subtestSummary[q.subtest_id].difficulties.push(q.difficulty)
    subtestSummary[q.subtest_id].discriminations.push(q.discrimination)
  })

  Object.keys(subtestSummary).forEach(subtestId => {
    const subtestIdNumber = parseInt(subtestId)
    const data = subtestSummary[subtestIdNumber]
    subtestSummary[subtestIdNumber] = {
      questionCount: data.difficulties.length,
      avgDifficulty: data.difficulties.reduce((sum: number, d: number) => sum + d, 0) / data.difficulties.length,
      avgDiscrimination: data.discriminations.reduce((sum: number, d: number) => sum + d, 0) / data.discriminations.length
    }
  })

  return {
    totalQuestions,
    averageDifficulty,
    difficultyRange,
    questionsNeedingReview,
    subtestSummary
  }
}