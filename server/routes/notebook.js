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

router.get('/', authMiddleware, (req, res) => {
  try {
    const userId = req.user.id
    const { type } = req.query
    const data = readData()
    let entries = data.notebookEntries.filter(e => e.user_id === userId)
    if (type) entries = entries.filter(e => e.type === type)
    res.json(entries)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notes' })
  }
})

router.post('/', authMiddleware, (req, res) => {
  try {
    const { type, title, content, topicId } = req.body
    const userId = req.user.id
    const data = readData()
    
    const entry = {
      id: data.nextId.notebookEntries || data.notebookEntries.length + 1,
      user_id: userId,
      type,
      title,
      content,
      topic_id: topicId || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    data.nextId.notebookEntries = entry.id + 1
    data.notebookEntries.push(entry)
    writeData(data)
    
    res.json(entry)
  } catch (err) {
    res.status(500).json({ error: 'Failed to save note' })
  }
})

router.put('/:id', authMiddleware, (req, res) => {
  try {
    const { id } = req.params
    const { title, content } = req.body
    const userId = req.user.id
    const data = readData()
    
    const idx = data.notebookEntries.findIndex(e => e.id === parseInt(id) && e.user_id === userId)
    if (idx < 0) return res.status(404).json({ error: 'Note not found' })
    
    data.notebookEntries[idx].title = title || data.notebookEntries[idx].title
    data.notebookEntries[idx].content = content || data.notebookEntries[idx].content
    data.notebookEntries[idx].updated_at = new Date().toISOString()
    writeData(data)
    
    res.json(data.notebookEntries[idx])
  } catch (err) {
    res.status(500).json({ error: 'Failed to update note' })
  }
})

router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id
    const data = readData()
    
    const idx = data.notebookEntries.findIndex(e => e.id === parseInt(id) && e.user_id === userId)
    if (idx >= 0) {
      data.notebookEntries.splice(idx, 1)
      writeData(data)
    }
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete note' })
  }
})

export default router