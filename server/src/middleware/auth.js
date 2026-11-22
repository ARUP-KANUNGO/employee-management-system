import jwt from 'jsonwebtoken'
import config from '../config/index.js'
import User from '../models/User.js'
import { UnauthorizedError, ForbiddenError } from '../utils/AppError.js'

export async function authenticate(req, _res, next) {
  try {
    const header = req.headers.authorization || ''
    const [scheme, token] = header.split(' ')
    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedError('Authentication required. Provide a valid Bearer token.')
    }
    let decoded
    try {
      decoded = jwt.verify(token, config.jwtSecret)
    } catch {
      throw new UnauthorizedError('Invalid or expired token.')
    }
    const user = await User.findById(decoded.sub).lean()
    if (!user) throw new UnauthorizedError('User no longer exists.')
    req.user = user
    req.token = token
    next()
  } catch (err) {
    next(err)
  }
}

export function requireAdmin(req, _res, next) {
  if (!req.user) return next(new UnauthorizedError('Authentication required.'))
  if (req.user.role !== 'admin') return next(new ForbiddenError('Admin access required.'))
  next()
}

export function optionalAuth(req, _res, next) {
  const header = req.headers.authorization || ''
  const [scheme, token] = header.split(' ')
  if (scheme === 'Bearer' && token) {
    try {
      const decoded = jwt.verify(token, config.jwtSecret)
      User.findById(decoded.sub).lean().then((u) => { req.user = u; next() }).catch(() => next())
    } catch {
      next()
    }
  } else {
    next()
  }
}

export default { authenticate, requireAdmin, optionalAuth }
