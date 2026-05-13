import { Router } from 'express'
import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { authMiddleware } from '../middleware/auth.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const DATA_PATH = join(__dirname, '../db/data.json')

function readData() { return JSON.parse(readFileSync(DATA_PATH, 'utf-8')) }
function writeData(data) { writeFileSync(DATA_PATH, JSON.stringify(data, null, 2)) }

const router = Router()

router.post('/calculate', authMiddleware, (req, res) => {
  try {
    const { examDate, hoursPerDay, subjectsLeft, backlogTopics } = req.body
    const userId = req.user.id
    const data = readData()
    
    const daysUntil = Math.ceil((new Date(examDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    const weeks = Math.ceil(daysUntil / 7)
    const effectiveHours = Math.max(hoursPerDay - 1, hoursPerDay * 0.7)
    const readiness = Math.min(95, Math.max(20, Math.round(40 + (effectiveHours * 6) - (backlogTopics * 1.2))))
    
    const plan = {
      id: data.studyPlans.length + 1,
      user_id: userId,
      exam_date: examDate,
      hours_per_day: hoursPerDay,
      subjects_left: subjectsLeft,
      backlog_topics: backlogTopics,
      daily_theory: Math.round(effectiveHours * 0.5 * 10) / 10,
      daily_practice: Math.round(effectiveHours * 0.35 * 10) / 10,
      daily_revision: Math.round(effectiveHours * 0.15 * 10) / 10,
      readiness_score: readiness,
      created_at: new Date().toISOString()
    }
    
    data.studyPlans.push(plan)
    writeData(data)
    
    res.json({
      dailyHours: Math.round(effectiveHours * 10) / 10,
      monthlyQuota: Math.round(hoursPerDay * 30),
      weeksNeeded: Math.max(weeks, 1),
      daysRemaining: daysUntil,
      backlogSize: backlogTopics,
      readinessScore: readiness,
      subjectsPerWeek: Math.ceil(subjectsLeft / Math.max(weeks, 1)),
      dailyBreakdown: {
        theory: Math.round(effectiveHours * 0.5 * 10) / 10,
        practice: Math.round(effectiveHours * 0.35 * 10) / 10,
        revision: Math.round(effectiveHours * 0.15 * 10) / 10
      }
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to calculate plan' })
  }
})

router.get('/current', authMiddleware, (req, res) => {
  try {
    const userId = req.user.id
    const data = readData()
    const plans = data.studyPlans.filter(p => p.user_id === userId)
    res.json(plans[plans.length - 1] || null)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch plan' })
  }
})

export default router