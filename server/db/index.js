import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createHash } from 'crypto'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const DATA_PATH = join(__dirname, 'data.json')

export function hashPassword(password) {
  return createHash('sha256').update(password + 'exam-prep-salt').digest('hex')
}

export function verifyPassword(password, hash) {
  return hashPassword(password) === hash
}

export function readData() {
  try {
    return JSON.parse(readFileSync(DATA_PATH, 'utf-8'))
  } catch {
    return { users: [], exams: [], branches: [], subjects: [], units: [], topics: [], questions: [], userProgress: [], studyPlans: [], notebookEntries: [], mcqAttempts: [], nextId: { users: 1, exams: 1, branches: 1, subjects: 1, units: 1, topics: 1, questions: 1, studyPlans: 1, notebookEntries: 1 } }
  }
}

export function writeData(data) {
  writeFileSync(DATA_PATH, JSON.stringify(data, null, 2))
}

export function getNextId(table) {
  const data = readData()
  const id = data.nextId[table] || 1
  data.nextId[table] = id + 1
  writeData(data)
  return id
}

export const db = {
  prepare: (sql) => ({
    get: (...params) => {
      const data = readData()
      if (sql.includes('SELECT * FROM users WHERE email')) {
        return data.users.find(u => u.email === params[0]) || null
      }
      if (sql.includes('SELECT * FROM users WHERE id')) {
        return data.users.find(u => u.id === params[0]) || null
      }
      return null
    },
    all: (...params) => {
      const data = readData()
      if (sql.includes('FROM questions')) {
        let q = [...data.questions]
        if (params[0]) q = q.filter(x => x.exam_id === params[0])
        return q
      }
      if (sql.includes('FROM exams')) return data.exams
      if (sql.includes('FROM branches')) return data.branches.filter(b => b.exam_id === params[0])
      if (sql.includes('FROM subjects')) return data.subjects.filter(s => s.branch_id === params[0])
      if (sql.includes('FROM units')) return data.units.filter(u => u.subject_id === params[0]).sort((a, b) => a.order_index - b.order_index)
      if (sql.includes('FROM topics')) {
        if (sql.includes('WHERE unit_id')) return data.topics.filter(t => t.unit_id === params[0]).sort((a, b) => a.order_index - b.order_index)
        return data.topics
      }
      if (sql.includes('FROM userProgress')) return data.userProgress.filter(p => p.user_id === params[0])
      if (sql.includes('FROM notebookEntries')) return data.notebookEntries.filter(e => e.user_id === params[0])
      return []
    },
    run: (...params) => {
      const data = readData()
      if (sql.includes('INSERT INTO users')) {
        const id = data.nextId.users
        data.nextId.users = id + 1
        data.users.push(...params)
        writeData(data)
        return { lastInsertRowid: id }
      }
      if (sql.includes('INSERT INTO mcqAttempts')) {
        data.mcqAttempts.push(...params)
        writeData(data)
        return { lastInsertRowid: data.mcqAttempts.length }
      }
      if (sql.includes('INSERT INTO userProgress')) {
        data.userProgress.push(...params)
        writeData(data)
        return { lastInsertRowid: data.userProgress.length }
      }
      if (sql.includes('INSERT INTO studyPlans')) {
        data.studyPlans.push(...params)
        writeData(data)
        return { lastInsertRowid: data.studyPlans.length }
      }
      if (sql.includes('INSERT INTO notebookEntries')) {
        data.notebookEntries.push(...params)
        writeData(data)
        return { lastInsertRowid: data.notebookEntries.length }
      }
      return { lastInsertRowid: 0 }
    }
  })
}

export default db