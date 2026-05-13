import { Router } from 'express'
import { body, validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import db, { hashPassword, verifyPassword } from '../db/index.js'
import { authMiddleware, JWT_SECRET } from '../middleware/auth.js'

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

router.post('/register',
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().isLength({ min: 2 }),
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }
      
      const { email, password, name } = req.body
      const data = readData()
      
      if (data.users.find(u => u.email === email)) {
        return res.status(400).json({ error: 'Email already registered' })
      }
      
      const id = data.nextId.users
      data.nextId.users = id + 1
      data.users.push({ id, email, password: hashPassword(password), name, role: 'student', created_at: new Date().toISOString() })
      writeData(data)
      
      const token = jwt.sign({ id, email, role: 'student' }, JWT_SECRET, { expiresIn: '7d' })
      
      res.json({ user: { id, email, name, role: 'student' }, token })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Registration failed' })
    }
  }
)

router.post('/login',
  body('email').isEmail().normalizeEmail(),
  body('password').exists(),
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }
      
      const { email, password } = req.body
      const data = readData()
      
      const user = data.users.find(u => u.email === email)
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' })
      }
      
      if (!verifyPassword(password, user.password)) {
        return res.status(401).json({ error: 'Invalid email or password' })
      }
      
      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' })
      
      res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role }, token })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Login failed' })
    }
  }
)

router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' })
})

router.get('/me', authMiddleware, (req, res) => {
  const data = readData()
  const user = data.users.find(u => u.id === req.user.id)
  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }
  res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role, created_at: user.created_at } })
})

export default router