// IRT (Item Response Theory) Scoring System
// This implements a simplified IRT model for scoring

export interface QuestionDifficulty {
  question_id: number
  difficulty: number // -3 to 3 (easier to harder)
  discrimination: number // 0.5 to 2 (how well it discriminates)
}

export interface IRTResponse {
  question_id: number
  is_correct: boolean
  difficulty: number
  discrimination: number
}

// Question difficulties storage - can be updated from calibration
let QUESTION_DIFFICULTIES: Record<number, QuestionDifficulty[]> = {}

// Default question difficulties for each subtest (used before calibration)
// These would normally be calibrated from historical data
export const DEFAULT_QUESTION_DIFFICULTIES: Record<number, QuestionDifficulty[]> = {
  1: [ // Penalaran Umum - 30 questions
    ...Array.from({ length: 30 }, (_, i) => ({
      question_id: i + 1,
      difficulty: Math.random() * 4 - 2, // Random between -2 and 2
      discrimination: 0.8 + Math.random() * 0.8 // Random between 0.8 and 1.6
    }))
  ],
  2: [ // Pengetahuan dan Pemahaman Umum - 20 questions
    ...Array.from({ length: 20 }, (_, i) => ({
      question_id: i + 1,
      difficulty: Math.random() * 3 - 1.5,
      discrimination: 0.9 + Math.random() * 0.6
    }))
  ],
  3: [ // Pemahaman Bacaan dan Menulis - 20 questions
    ...Array.from({ length: 20 }, (_, i) => ({
      question_id: i + 1,
      difficulty: Math.random() * 3 - 1.5,
      discrimination: 0.7 + Math.random() * 0.8
    }))
  ],
  4: [ // Pengetahuan Kuantitatif - 20 questions
    ...Array.from({ length: 20 }, (_, i) => ({
      question_id: i + 1,
      difficulty: Math.random() * 4 - 2,
      discrimination: 0.8 + Math.random() * 0.7
    }))
  ],
  5: [ // Literasi Bahasa Indonesia - 20 questions
    ...Array.from({ length: 20 }, (_, i) => ({
      question_id: i + 1,
      difficulty: Math.random() * 3 - 1.5,
      discrimination: 0.9 + Math.random() * 0.6
    }))
  ],
  6: [ // Literasi Bahasa Inggris - 20 questions
    ...Array.from({ length: 20 }, (_, i) => ({
      question_id: i + 1,
      difficulty: Math.random() * 4 - 2,
      discrimination: 0.8 + Math.random() * 0.7
    }))
  ],
  7: [ // Penalaran Matematika - 20 questions
    ...Array.from({ length: 20 }, (_, i) => ({
      question_id: i + 1,
      difficulty: Math.random() * 4 - 2,
      discrimination: 0.8 + Math.random() * 0.8
    }))
  ]
}

// Initialize with defaults
QUESTION_DIFFICULTIES = { ...DEFAULT_QUESTION_DIFFICULTIES }

/**
 * Update question difficulties from calibration data
 */
export function updateQuestionDifficulties(
  calibratedDifficulties: Record<number, Array<{question_id: number, difficulty: number, discrimination: number}>>
): void {
  Object.keys(calibratedDifficulties).forEach(subtestId => {
    const subtestIdNum = parseInt(subtestId)
    QUESTION_DIFFICULTIES[subtestIdNum] = calibratedDifficulties[subtestIdNum].map(item => ({
      question_id: item.question_id,
      difficulty: item.difficulty,
      discrimination: item.discrimination
    }))
  })
}

/**
 * Get current question difficulties (calibrated or default)
 */
export function getQuestionDifficulties(): Record<number, QuestionDifficulty[]> {
  return QUESTION_DIFFICULTIES
}

/**
 * Calculate probability of correct response using 2PL IRT model
 * P(θ) = 1 / (1 + exp(-a(θ - b)))
 * where θ = ability, a = discrimination, b = difficulty
 */
function probabilityCorrect(ability: number, difficulty: number, discrimination: number): number {
  const exponent = -discrimination * (ability - difficulty)
  return 1 / (1 + Math.exp(exponent))
}


/**
 * Estimate ability using maximum likelihood estimation
 * Uses Newton-Raphson method for optimization
 */
function estimateAbility(responses: IRTResponse[]): number {
  let ability = 0 // Starting estimate
  const maxIterations = 50
  const tolerance = 0.001

  for (let iter = 0; iter < maxIterations; iter++) {
    let firstDerivative = 0
    let secondDerivative = 0

    for (const response of responses) {
      const prob = probabilityCorrect(ability, response.difficulty, response.discrimination)
      const q = 1 - prob

      if (response.is_correct) {
        firstDerivative += response.discrimination * q
        secondDerivative -= response.discrimination * response.discrimination * prob * q
      } else {
        firstDerivative -= response.discrimination * prob
        secondDerivative -= response.discrimination * response.discrimination * prob * q
      }
    }

    if (Math.abs(firstDerivative) < tolerance) {
      break
    }

    const step = firstDerivative / secondDerivative
    ability -= step

    // Constrain ability to reasonable range
    ability = Math.max(-4, Math.min(4, ability))
  }

  return ability
}

/**
 * Convert ability estimate to scaled score (200-800 scale, similar to SAT)
 */
function abilityToScaledScore(ability: number): number {
  // Transform ability (-4 to 4) to scaled score (200 to 800)
  // Mean ability of 0 corresponds to scaled score of 500
  const scaledScore = 500 + (ability * 75) // 75 points per logit
  return Math.round(Math.max(200, Math.min(800, scaledScore)))
}

/**
 * Calculate IRT-based score for a subtest
 */
export function calculateIRTScore(
  subtestId: number,
  responses: { question_id: number; is_correct: boolean }[]
): {
  irtScore: number
  ability: number
  standardError: number
  percentile: number
} {
  const questionDifficulties = QUESTION_DIFFICULTIES[subtestId] || []

  // Map responses to IRT format
  const irtResponses: IRTResponse[] = responses.map(response => {
    const questionDiff = questionDifficulties.find(q => q.question_id === response.question_id)
    return {
      question_id: response.question_id,
      is_correct: response.is_correct,
      difficulty: questionDiff?.difficulty || 0,
      discrimination: questionDiff?.discrimination || 1
    }
  })

  if (irtResponses.length === 0) {
    return { irtScore: 200, ability: -4, standardError: 1, percentile: 1 }
  }

  // Estimate ability
  const ability = estimateAbility(irtResponses)

  // Calculate standard error (simplified)
  const information = irtResponses.reduce((sum, response) => {
    const prob = probabilityCorrect(ability, response.difficulty, response.discrimination)
    return sum + (response.discrimination * response.discrimination * prob * (1 - prob))
  }, 0)

  const standardError = information > 0 ? 1 / Math.sqrt(information) : 1

  // Convert to scaled score
  const irtScore = abilityToScaledScore(ability)

  // Calculate approximate percentile based on normal distribution
  // Assuming mean ability = 0, SD = 1
  const percentile = Math.round(normalCDF(ability) * 100)

  return {
    irtScore,
    ability,
    standardError,
    percentile: Math.max(1, Math.min(99, percentile))
  }
}

/**
 * Calculate overall IRT score across all subtests
 * Target total score of 1000 points
 */
export function calculateOverallIRTScore(subtestScores: { subtestId: number; irtScore: number }[]): {
  totalScore: number
  averageScore: number
  percentile: number
} {
  if (subtestScores.length === 0) {
    return { totalScore: 200, averageScore: 200, percentile: 1 }
  }

  // Weight each subtest equally for total score
  const averageScore = subtestScores.reduce((sum, score) => sum + score.irtScore, 0) / subtestScores.length

  // Scale to achieve target total of 1000 for perfect performance
  // Average score of 500 per subtest = total of 3500 for 7 subtests
  // We want to scale this to 1000 total
  const scalingFactor = 1000 / (7 * 500) // = 1000/3500 ≈ 0.286
  const totalScore = Math.round(averageScore * subtestScores.length * scalingFactor)

  // Calculate percentile based on average ability
  const averageAbility = (averageScore - 500) / 75 // Convert back to ability scale
  const percentile = Math.round(normalCDF(averageAbility) * 100)

  return {
    totalScore: Math.max(50, Math.min(1000, totalScore)),
    averageScore: Math.round(averageScore),
    percentile: Math.max(1, Math.min(99, percentile))
  }
}

/**
 * Normal cumulative distribution function approximation
 */
function normalCDF(x: number): number {
  const a1 =  0.254829592
  const a2 = -0.284496736
  const a3 =  1.421413741
  const a4 = -1.453152027
  const a5 =  1.061405429
  const p  =  0.3275911

  const sign = x < 0 ? -1 : 1
  x = Math.abs(x) / Math.sqrt(2.0)

  const t = 1.0 / (1.0 + p * x)
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x)

  return 0.5 * (1.0 + sign * y)
}