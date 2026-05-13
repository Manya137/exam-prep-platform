import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'exam-prep-secret-key-change-in-production'

export function authMiddleware(req, res, next) {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1]
  
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' })
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

export function optionalAuth(req, res, next) {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1]
  
  if (token) {
    try {
      req.user = jwt.verify(token, JWT_SECRET)
    } catch (err) {
      // Ignore invalid tokens for optional auth
    }
  }
  next()
}

export { JWT_SECRET }