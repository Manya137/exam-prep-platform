import { useState, useEffect } from 'react'
import { Clock, CheckCircle2, XCircle, ChevronRight, Timer, Target, RotateCcw } from 'lucide-react'
import { api } from '../api'

const MODES = [
  { id: 'practice', label: 'Practice', icon: Target },
  { id: 'timed', label: 'Timed Test', icon: Timer },
  { id: 'revision', label: 'Revision Quiz', icon: RotateCcw },
]

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

  useEffect(() => {
    loadQuestions()
  }, [mode])

  useEffect(() => {
    if (mode === 'timed' && timeLeft > 0 && !showAnswer && questions.length > 0) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000)
      return () => clearInterval(timer)
    }
  }, [mode, timeLeft, showAnswer, questions])

  const loadQuestions = async () => {
    setLoading(true)
    try {
      const data = await api.questions.getRandom({ examId: 1, count: 10 })
      setQuestions(data || [])
    } catch (err) {
      console.error('Failed to load questions:', err)
      setQuestions([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (selectedOption === null || !questions[currentQuestion]) return
    
    const q = questions[currentQuestion]
    const optionLetter = String.fromCharCode(97 + selectedOption)
    
    try {
      const result = await api.questions.submit(q.id, optionLetter, 60)
      setExplanation(result.explanation || '')
      setShowAnswer(true)
      
      if (result.correct) {
        setScore(s => s + 1)
      }
      setAnswered(a => [...a, currentQuestion])
    } catch (err) {
      setShowAnswer(true)
      setAnswered(a => [...a, currentQuestion])
    }
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(c => c + 1)
      setSelectedOption(null)
      setShowAnswer(false)
      setExplanation('')
      if (mode === 'timed') setTimeLeft(300)
    }
  }

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`

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
        <p className="text-text-secondary">Please try again later or switch to a different exam type.</p>
      </div>
    )
  }

  const q = questions[currentQuestion]
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
        <div className="flex bg-surface-secondary rounded-lg p-1">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                mode === m.id ? 'bg-surface shadow-sm text-text-primary' : 'text-text-muted hover:text-text-primary'
              }`}
            >
              <m.icon className="w-4 h-4" />
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 h-1 bg-surface-secondary rounded-full overflow-hidden">
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
          <span className="px-2 py-1 rounded text-xs bg-surface-tertiary text-text-muted">{q.topic || 'General'}</span>
          <span className="px-2 py-1 rounded text-xs bg-accent-light text-accent">{q.marks || 1} mark</span>
        </div>

        <h2 className="text-xl font-medium text-text-primary mb-6">{q.question}</h2>

        <div className="space-y-3">
          {q.options?.map((option: string, i: number) => {
            const isSelected = selectedOption === i
            const isCorrect = i === q.options?.indexOf(q.options[q.options.length - 1] > q.options[0] ? q.options.findIndex((o: string) => o === q.options[0]) : 0)
            const showCorrect = showAnswer && option === q.options[q.options.findIndex((o: string) => o === q.options[0])]
            const showWrong = showAnswer && isSelected && !showCorrect

            return (
              <button
                key={i}
                onClick={() => !showAnswer && setSelectedOption(i)}
                disabled={showAnswer}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  showCorrect ? 'border-emerald bg-emerald-light' :
                  showWrong ? 'border-danger bg-danger-light' :
                  isSelected ? 'border-accent bg-accent-light' :
                  'border-border hover:border-text-muted'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    showCorrect ? 'bg-emerald text-white' :
                    showWrong ? 'bg-danger text-white' :
                    isSelected ? 'bg-accent text-white' :
                    'bg-surface-secondary text-text-secondary'
                  }`}>
                    {showCorrect ? <CheckCircle2 className="w-5 h-5" /> :
                     showWrong ? <XCircle className="w-5 h-5" /> :
                     String.fromCharCode(65 + i)}
                  </span>
                  <span className="flex-1 text-text-primary">{option}</span>
                </div>
              </button>
            )
          })}
        </div>

        {showAnswer && explanation && (
          <div className="mt-6 p-4 bg-surface-secondary rounded-xl border border-border">
            <div className="flex items-center gap-2 mb-2">
              {selectedOption === q.options?.indexOf(q.options[0]) ? (
                <><CheckCircle2 className="w-5 h-5 text-emerald" /><span className="font-medium text-emerald">Correct!</span></>
              ) : (
                <><XCircle className="w-5 h-5 text-danger" /><span className="font-medium text-danger">Incorrect</span></>
              )}
            </div>
            <p className="text-sm text-text-secondary">{explanation}</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-text-muted">Score: <span className="font-medium text-text-primary">{score}</span> / {answered.length}</div>
        <div className="flex gap-3">
          {!showAnswer ? (
            <button onClick={handleSubmit} disabled={selectedOption === null} className="px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent-hover disabled:opacity-50">
              Submit Answer
            </button>
          ) : (
            <button onClick={handleNext} className="px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent-hover flex items-center gap-2">
              {currentQuestion < questions.length - 1 ? <>Next <ChevronRight className="w-5 h-5" /></> : 'Finish Practice'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}