import { Router } from 'express'
import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { authMiddleware, optionalAuth } from '../middleware/auth.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const DATA_PATH = join(__dirname, '../db/data.json')

function readData() {
  return JSON.parse(readFileSync(DATA_PATH, 'utf-8'))
}

function writeData(data) {
  writeFileSync(DATA_PATH, JSON.stringify(data, null, 2))
}

const router = Router()

router.get('/', optionalAuth, (req, res) => {
  try {
    const { examId, subjectId, topicId, difficulty, limit = 20 } = req.query
    const data = readData()
    
    let questions = [...data.questions]
    
    if (examId) questions = questions.filter(q => q.exam_id === parseInt(examId))
    if (difficulty) questions = questions.filter(q => q.difficulty === difficulty)
    
    if (topicId) {
      const topic = data.topics.find(t => t.id === parseInt(topicId))
      if (topic) {
        const unitTopics = data.topics.filter(t => t.unit_id === topic.unit_id).map(t => t.id)
        questions = questions.filter(q => unitTopics.includes(q.topic_id))
      }
    }
    
    questions = questions.slice(0, parseInt(limit))
    
    const formatted = questions.map(q => {
      const topic = data.topics.find(t => t.id === q.topic_id)
      const unit = data.units.find(u => u.id === topic?.unit_id)
      const subject = data.subjects.find(s => s.id === unit?.subject_id)
      
      return {
        id: q.id,
        exam: q.exam_id === 1 ? 'GATE' : 'CAT',
        year: q.year,
        subject: subject?.name || 'Unknown',
        topic: topic?.name || 'Unknown',
        difficulty: q.difficulty,
        question: q.question,
        options: [q.option_a, q.option_b, q.option_c, q.option_d],
        marks: q.marks
      }
    })
    
    res.json(formatted)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch questions' })
  }
})

router.get('/random', optionalAuth, (req, res) => {
  try {
    const { examId, subjectId, count = 10, includeAnswer } = req.query
    const data = readData()
    
    let questions = [...data.questions]
    
    if (examId) questions = questions.filter(q => q.exam_id === parseInt(examId))
    
    questions = questions.sort(() => Math.random() - 0.5).slice(0, parseInt(count))
    
    const formatted = questions.map(q => {
      const base = {
        id: q.id,
        exam: q.exam_id === 1 ? 'GATE' : 'CAT',
        year: q.year,
        topic: q.topic_id,
        difficulty: q.difficulty,
        question: q.question,
        options: [q.option_a, q.option_b, q.option_c, q.option_d],
        marks: q.marks
      }
      if (includeAnswer === 'true') {
        base._correctOption = q.correct_option
        base._explanation = q.explanation
      }
      return base
    })
    
    res.json(formatted)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch questions' })
  }
})

router.post('/submit', authMiddleware, (req, res) => {
  try {
    const { questionId, selectedOption, timeTaken } = req.body
    const userId = req.user.id
    const data = readData()
    
    const question = data.questions.find(q => q.id === questionId)
    if (!question) {
      return res.status(404).json({ error: 'Question not found' })
    }
    
    const isCorrect = selectedOption === question.correct_option
    
    const attempt = {
      id: data.mcqAttempts.length + 1,
      user_id: userId,
      question_id: questionId,
      selected_option: selectedOption,
      is_correct: isCorrect ? 1 : 0,
      time_taken: timeTaken || 0,
      attempted_at: new Date().toISOString()
    }
    data.mcqAttempts.push(attempt)
    writeData(data)
    
    res.json({
      correct: isCorrect,
      correctOption: question.correct_option,
      explanation: question.explanation
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to submit answer' })
  }
})

router.get('/stats', authMiddleware, (req, res) => {
  try {
    const userId = req.user.id
    const data = readData()
    
    const userAttempts = data.mcqAttempts.filter(a => a.user_id === userId)
    const total = userAttempts.length
    const correct = userAttempts.filter(a => a.is_correct).length
    
    res.json({
      total,
      correct,
      accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
      byTopic: [],
      byDifficulty: []
    })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats' })
  }
})

export default router