// Scoring Status Management for Calibration System

export interface ScoringStatus {
  isCalibrationComplete: boolean
  totalStudentsCompleted: number
  calibrationThreshold: number
  pilotStudentIds: string[]
  calibrationCompletedAt?: Date
}

export interface StudentScoringStatus {
  student_id: string
  isPilotStudent: boolean
  hasScores: boolean
  scoreCalculatedAt?: Date
  waitingForCalibration: boolean
}

/**
 * Check if scoring calibration is complete
 */
export function isCalibrationComplete(totalStudentsCompleted: number): boolean {
  return totalStudentsCompleted >= 20
}

/**
 * Check if a student is part of the pilot group (first 20)
 */
export function isPilotStudent(studentId: string, allStudentIds: string[]): boolean {
  const sortedStudentIds = [...allStudentIds].sort()
  const pilotGroup = sortedStudentIds.slice(0, 20)
  return pilotGroup.includes(studentId)
}

/**
 * Get scoring status for a specific student
 */
export function getStudentScoringStatus(
  studentId: string,
  allCompletedStudentIds: string[],
  calibrationStatus: ScoringStatus
): StudentScoringStatus {
  const isPilot = isPilotStudent(studentId, allCompletedStudentIds)

  return {
    student_id: studentId,
    isPilotStudent: isPilot,
    hasScores: isPilot ? calibrationStatus.isCalibrationComplete : true,
    waitingForCalibration: isPilot && !calibrationStatus.isCalibrationComplete,
    scoreCalculatedAt: isPilot && calibrationStatus.isCalibrationComplete
      ? calibrationStatus.calibrationCompletedAt
      : undefined
  }
}

/**
 * Get system-wide scoring status
 */
export function getSystemScoringStatus(allCompletedStudentIds: string[]): ScoringStatus {
  const totalCompleted = allCompletedStudentIds.length
  const isComplete = isCalibrationComplete(totalCompleted)
  const sortedIds = [...allCompletedStudentIds].sort()

  return {
    isCalibrationComplete: isComplete,
    totalStudentsCompleted: totalCompleted,
    calibrationThreshold: 20,
    pilotStudentIds: sortedIds.slice(0, 20),
    calibrationCompletedAt: isComplete ? new Date() : undefined
  }
}

/**
 * Check if scores should be displayed for a student
 */
export function shouldDisplayScores(
  studentId: string,
  allCompletedStudentIds: string[]
): boolean {
  const systemStatus = getSystemScoringStatus(allCompletedStudentIds)
  const studentStatus = getStudentScoringStatus(studentId, allCompletedStudentIds, systemStatus)

  return studentStatus.hasScores
}

/**
 * Get display message for students waiting for calibration
 */
export function getCalibrationWaitingMessage(
  totalCompleted: number,
  threshold: number = 20
): string {
  const remaining = Math.max(0, threshold - totalCompleted)

  if (remaining === 0) {
    return "Kalibrasi selesai! Skor Anda sedang dihitung..."
  }

  return `Menunggu ${remaining} peserta lagi untuk menyelesaikan kalibrasi sistem penilaian. Skor akan ditampilkan setelah kalibrasi selesai.`
}

/**
 * Get admin calibration summary
 */
export function getCalibrationSummary(allCompletedStudentIds: string[]): {
  status: 'waiting' | 'ready' | 'completed'
  progress: number
  message: string
  canRunCalibration: boolean
} {
  const total = allCompletedStudentIds.length
  const threshold = 20

  if (total < threshold) {
    return {
      status: 'waiting',
      progress: (total / threshold) * 100,
      message: `Menunggu ${threshold - total} peserta lagi untuk memulai kalibrasi`,
      canRunCalibration: false
    }
  }

  // Check if calibration has been run
  const systemStatus = getSystemScoringStatus(allCompletedStudentIds)

  if (systemStatus.isCalibrationComplete && systemStatus.calibrationCompletedAt) {
    return {
      status: 'completed',
      progress: 100,
      message: `Kalibrasi selesai pada ${systemStatus.calibrationCompletedAt.toLocaleString('id-ID')}`,
      canRunCalibration: false
    }
  }

  return {
    status: 'ready',
    progress: 100,
    message: `${total} peserta telah selesai. Siap untuk kalibrasi!`,
    canRunCalibration: true
  }
}