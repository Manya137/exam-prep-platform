import { Router } from 'express'
import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { authMiddleware } from '../middleware/auth.js'

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

router.get('/', authMiddleware, (req, res) => {
  try {
    const userId = req.user.id
    const data = readData()
    
    const progress = data.userProgress.filter(p => p.user_id === userId)
    
    const summary = {
      totalTopics: progress.length,
      completedTopics: progress.filter(p => p.completed).length,
      averageProgress: progress.length > 0 ? Math.round(progress.reduce((a, p) => a + p.progress, 0) / progress.length) : 0,
      totalTimeSpent: progress.reduce((a, p) => a + (p.time_spent || 0), 0)
    }
    
    res.json({ progress, summary })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch progress' })
  }
})

router.post('/update', authMiddleware, (req, res) => {
  try {
    const { topicId, progress, completed } = req.body
    const userId = req.user.id
    const data = readData()
    
    const existingIdx = data.userProgress.findIndex(p => p.user_id === userId && p.topic_id === topicId)
    
    if (existingIdx >= 0) {
      data.userProgress[existingIdx].progress = Math.max(data.userProgress[existingIdx].progress, progress || 0)
      data.userProgress[existingIdx].completed = completed ? 1 : 0
    } else {
      data.userProgress.push({
        id: data.userProgress.length + 1,
        user_id: userId,
        topic_id: topicId,
        progress: progress || 0,
        completed: completed ? 1 : 0,
        time_spent: 0
      })
    }
    
    writeData(data)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'Failed to update progress' })
  }
})

router.post('/topic-completed', authMiddleware, (req, res) => {
  try {
    const { topicId, timeSpent } = req.body
    const userId = req.user.id
    const data = readData()
    
    const existingIdx = data.userProgress.findIndex(p => p.user_id === userId && p.topic_id === topicId)
    
    if (existingIdx >= 0) {
      data.userProgress[existingIdx].progress = 100
      data.userProgress[existingIdx].completed = 1
      data.userProgress[existingIdx].time_spent = (data.userProgress[existingIdx].time_spent || 0) + (timeSpent || 0)
    } else {
      data.userProgress.push({
        id: data.userProgress.length + 1,
        user_id: userId,
        topic_id: topicId,
        progress: 100,
        completed: 1,
        time_spent: timeSpent || 0
      })
    }
    
    writeData(data)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark topic completed' })
  }
})

export default router