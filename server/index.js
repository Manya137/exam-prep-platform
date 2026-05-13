import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import cookieParser from 'cookie-parser'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

import authRoutes from './routes/auth.js'
import examRoutes from './routes/exams.js'
import questionRoutes from './routes/questions.js'
import progressRoutes from './routes/progress.js'
import plannerRoutes from './routes/planner.js'
import notebookRoutes from './routes/notebook.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()

app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json({ limit: '10mb' }))
app.use(cookieParser())

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' }
})
app.use('/api/', limiter)

app.use('/api/auth', authRoutes)
app.use('/api/exams', examRoutes)
app.use('/api/questions', questionRoutes)
app.use('/api/progress', progressRoutes)
app.use('/api/planner', plannerRoutes)
app.use('/api/notebook', notebookRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export default app