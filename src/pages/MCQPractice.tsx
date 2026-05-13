import { useState, useEffect } from 'react'
import { Clock, CheckCircle2, XCircle, ChevronRight, Timer, Target, RotateCcw } from 'lucide-react'
import { api } from '../api'

const MODES = [
  { id: 'practice', label: 'Practice', icon: Target },
  { id: 'timed', label: 'Timed Test', icon: Timer },
  { id: 'revision', label: 'Revision Quiz', icon: RotateCcw },
]

const OPTION_LETTERS = ['a', 'b', 'c', 'd']

export default function MCQPractice() {
  const [questions, setQuestions] = useState<any[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [mode, setMode] = useState('practice')
  const [timeLeft, setTimeLeft] = useState(300)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [explanation, setExplanation] = useState('')
  const [quizStarted, setQuizStarted] = useState(false)

  const loadQuestions = async () => {
    setLoading(true)
    try {
      const data = await api.questions.getRandom({ examId: 1, count: 10, includeAnswer: true })
      setQuestions(Array.isArray(data) ? data : [])
      setCurrentQuestion(0)
      setSelectedOption(null)
      setShowAnswer(false)
      setScore(0)
      setAnswered([])
      setExplanation('')
      setTimeLeft(300)
      setQuizStarted(true)
    } catch (err) {
      console.error('Failed to load questions:', err)
      setQuestions([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (mode === 'timed' && timeLeft > 0 && !showAnswer && quizStarted) {
      const timer = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            handleFinish()
            return 0
          }
          return t - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [mode, timeLeft, showAnswer, quizStarted])

  const handleStartQuiz = () => {
    loadQuestions()
  }

  const handleSubmit = async () => {
    if (selectedOption === null || !questions[currentQuestion]) return
    
    const q = questions[currentQuestion]
    const optionLetter = OPTION_LETTERS[selectedOption]
    const isCorrect = optionLetter === q._correctOption
    
    setExplanation(q._explanation || '')
    setShowAnswer(true)
    
    if (isCorrect) {
      setScore(s => s + 1)
    }
    setAnswered(a => [...a, currentQuestion])

    try {
      await api.questions.submit(q.id, optionLetter, 60)
    } catch (err) {
      console.error('Failed to save attempt:', err)
    }
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(c => c + 1)
      setSelectedOption(null)
      setShowAnswer(false)
      setExplanation('')
      if (mode === 'timed') setTimeLeft(300)
    } else {
      handleFinish()
    }
  }

  const handleFinish = () => {
    setQuizStarted(false)
  }

  const handleReset = () => {
    setQuizStarted(false)
    setQuestions([])
    setCurrentQuestion(0)
    setSelectedOption(null)
    setShowAnswer(false)
    setScore(0)
    setAnswered([])
    setExplanation('')
  }

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`

  if (!quizStarted) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-text-primary mb-4">MCQ Practice</h1>
          <p className="text-text-secondary mb-8">Test your knowledge with real GATE/CAT questions from previous years</p>
          
          <div className="flex items-center justify-center gap-4 mb-8">
            {MODES.map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`flex flex-col items-center gap-2 p-6 rounded-xl border-2 transition-all ${
                  mode === m.id ? 'border-accent bg-accent-light' : 'border-border hover:border-text-muted'
                }`}
              >
                <m.icon className="w-8 h-8 text-accent" />
                <span className="font-medium text-text-primary">{m.label}</span>
              </button>
            ))}
          </div>

          <button 
            onClick={handleStartQuiz}
            className="px-8 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent-hover text-lg"
          >
            Start Quiz (10 Questions)
          </button>

          <div className="mt-8 text-left max-w-md mx-auto">
            <div className="bg-surface border border-border rounded-xl p-4 space-y-2 text-sm text-text-secondary">
              <div className="font-medium text-text-primary">Rules:</div>
              <div>1 mark for correct answer, -0.33 for wrong</div>
              <div>5 minute timer per question in Timed mode</div>
              <div>Instant feedback with explanations</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full" />
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <h2 className="text-xl font-semibold text-text-primary mb-4">No Questions Available</h2>
        <p className="text-text-secondary mb-6">Please try again or switch to a different exam type.</p>
        <button onClick={handleReset} className="px-6 py-2 bg-accent text-white rounded-lg">Go Back</button>
      </div>
    )
  }

  if (currentQuestion >= questions.length && quizStarted) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <div className="bg-surface border border-border rounded-xl p-8">
          <h2 className="text-2xl font-bold text-text-primary mb-2">Quiz Complete!</h2>
          <div className="text-4xl font-bold text-accent my-6">{score} / {questions.length}</div>
          <p className="text-text-secondary mb-6">
            Accuracy: {Math.round((score / questions.length) * 100)}%
          </p>
          <div className="flex justify-center gap-4">
            <button onClick={loadQuestions} className="px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent-hover">
              Try Again
            </button>
            <button onClick={handleReset} className="px-6 py-3 border border-border rounded-lg font-medium hover:bg-surface-secondary">
              Back to Menu
            </button>
          </div>
        </div>
      </div>
    )
  }

  const q = questions[currentQuestion]
  const correctOptionIndex = OPTION_LETTERS.indexOf(q._correctOption)

  const difficultyColors: Record<string, string> = {
    easy: 'bg-emerald-light text-emerald',
    medium: 'bg-warning-light text-warning',
    hard: 'bg-danger-light text-danger'
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">MCQ Practice</h1>
          <p className="text-text-secondary mt-1">Real GATE questions from previous years</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="px-3 py-1.5 rounded-lg bg-surface-secondary text-text-secondary">{mode} mode</span>
          <button onClick={handleReset} className="px-3 py-1.5 rounded-lg text-text-muted hover:bg-surface-secondary">Exit</button>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 h-1.5 bg-surface-secondary rounded-full overflow-hidden">
          <div className="h-full bg-accent transition-all" style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }} />
        </div>
        <span className="text-sm text-text-muted font-medium">{currentQuestion + 1} / {questions.length}</span>
      </div>

      {mode === 'timed' && (
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg mb-6 ${timeLeft <= 60 ? 'bg-danger-light text-danger' : 'bg-surface-secondary text-text-secondary'}`}>
          <Clock className="w-5 h-5" />
          <span className="font-mono font-medium">{formatTime(timeLeft)}</span>
          {timeLeft <= 60 && <span className="text-sm">remaining</span>}
        </div>
      )}

      <div className="bg-surface border border-border rounded-xl p-8">
        <div className="flex items-center gap-2 mb-6">
          <span className={`px-2 py-1 rounded text-xs font-medium ${difficultyColors[q.difficulty] || 'bg-surface-tertiary text-text-muted'}`}>
            {q.difficulty?.toUpperCase() || 'MEDIUM'}
          </span>
          <span className="px-2 py-1 rounded text-xs bg-surface-tertiary text-text-muted">Topic #{q.topic}</span>
          <span className="px-2 py-1 rounded text-xs bg-accent-light text-accent">{q.marks || 1} mark</span>
        </div>

        <h2 className="text-xl font-medium text-text-primary mb-6">{q.question}</h2>

        <div className="space-y-3">
          {q.options?.map((option: string, i: number) => {
            const isSelected = selectedOption === i
            const isCorrect = i === correctOptionIndex
            const isWrongSelection = showAnswer && isSelected && !isCorrect

            let borderClass = 'border-border hover:border-accent'
            let bgClass = ''
            let icon = null
            let iconBg = ''

            if (showAnswer) {
              if (isCorrect) {
                borderClass = 'border-emerald bg-emerald-light'
                icon = <CheckCircle2 className="w-5 h-5 text-emerald" />
                iconBg = 'bg-emerald text-white'
              } else if (isWrongSelection) {
                borderClass = 'border-danger bg-danger-light'
                icon = <XCircle className="w-5 h-5 text-danger" />
                iconBg = 'bg-danger text-white'
              }
            } else if (isSelected) {
              borderClass = 'border-accent bg-accent-light'
              iconBg = 'bg-accent text-white'
            }

            return (
              <button
                key={i}
                onClick={() => !showAnswer && setSelectedOption(i)}
                disabled={showAnswer}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${borderClass} ${bgClass}`}
              >
                <div className="flex items-center gap-4">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${iconBg}`}>
                    {icon || String.fromCharCode(65 + i)}
                  </span>
                  <span className="flex-1 text-text-primary">{option}</span>
                </div>
              </button>
            )
          })}
        </div>

        {showAnswer && (
          <div className="mt-6 p-4 bg-surface-secondary rounded-xl border border-border">
            <div className="flex items-center gap-2 mb-2">
              {selectedOption === correctOptionIndex ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald" />
                  <span className="font-medium text-emerald">Correct!</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-danger" />
                  <span className="font-medium text-danger">Incorrect</span>
                </>
              )}
            </div>
            {explanation && <p className="text-sm text-text-secondary">{explanation}</p>}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-text-muted">
          Score: <span className="font-medium text-text-primary">{score}</span> / {answered.length}
        </div>
        <div className="flex gap-3">
          {!showAnswer ? (
            <button 
              onClick={handleSubmit} 
              disabled={selectedOption === null} 
              className="px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Answer
            </button>
          ) : (
            <button 
              onClick={handleNext} 
              className="px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent-hover flex items-center gap-2"
            >
              {currentQuestion < questions.length - 1 ? <>Next <ChevronRight className="w-5 h-5" /></> : 'Finish Quiz'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}