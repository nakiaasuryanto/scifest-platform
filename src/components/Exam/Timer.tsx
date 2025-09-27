import { useEffect } from 'react'

interface TimerProps {
  timeRemaining: number
  onTimeUp: () => void
  setTimeRemaining: (time: number) => void
}

const Timer = ({ timeRemaining, onTimeUp, setTimeRemaining }: TimerProps) => {
  useEffect(() => {
    if (timeRemaining <= 0) {
      onTimeUp()
      return
    }

    const timer = setInterval(() => {
      setTimeRemaining(timeRemaining - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeRemaining, onTimeUp, setTimeRemaining])

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
    }
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getTimerClass = (): string => {
    if (timeRemaining <= 60) return 'timer critical'
    if (timeRemaining <= 300) return 'timer warning'
    return 'timer normal'
  }

  return (
    <div className={getTimerClass()}>
      <span className="timer-label">Waktu Tersisa:</span>
      <span className="timer-display">{formatTime(timeRemaining)}</span>
    </div>
  )
}

export default Timer