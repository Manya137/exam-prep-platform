import { Router } from 'express'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { authMiddleware, optionalAuth } from '../middleware/auth.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const DATA_PATH = join(__dirname, '../db/data.json')

function readData() {
  return JSON.parse(readFileSync(DATA_PATH, 'utf-8'))
}

const router = Router()

router.get('/', optionalAuth, (req, res) => {
  try {
    const data = readData()
    res.json(data.exams)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch exams' })
  }
})

router.get('/:examId/branches', optionalAuth, (req, res) => {
  try {
    const data = readData()
    const branches = data.branches.filter(b => b.exam_id === parseInt(req.params.examId))
    res.json(branches)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch branches' })
  }
})

router.get('/:examId/:branchId/subjects', optionalAuth, (req, res) => {
  try {
    const data = readData()
    const subjects = data.subjects.filter(s => s.branch_id === parseInt(req.params.branchId))
    res.json(subjects)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch subjects' })
  }
})

router.get('/:examId/:branchId/:subjectId/syllabus', optionalAuth, (req, res) => {
  try {
    const data = readData()
    const subjectId = parseInt(req.params.subjectId)
    
    const units = data.units.filter(u => u.subject_id === subjectId).sort((a, b) => a.order_index - b.order_index)
    
    const syllabus = units.map(unit => {
      const topics = data.topics.filter(t => t.unit_id === unit.id).sort((a, b) => a.order_index - b.order_index)
      return { ...unit, topics }
    })
    
    res.json({ units: syllabus })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch syllabus' })
  }
})

export default router