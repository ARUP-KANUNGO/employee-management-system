import { AppError } from '../utils/AppError.js'
import { sendError } from '../utils/response.js'

export function notFound(req, _res, next) {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404))
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  const status = err.statusCode || 500
  const message = err.isOperational ? err.message : 'Internal server error'
  if (status >= 500) console.error('[ERROR]', err)
  const details = err.details || undefined
  sendError(res, message, status, details)
}

export default { notFound, errorHandler }
