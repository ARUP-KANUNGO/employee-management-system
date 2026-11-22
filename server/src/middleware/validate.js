import { validationResult } from 'express-validator'
import { ValidationError } from '../utils/AppError.js'

export function handleValidationErrors(req, _res, next) {
  const errors = validationResult(req)
  if (errors.isEmpty()) return next()
  const details = errors.array().map((e) => ({ field: e.path, message: e.msg }))
  next(new ValidationError('Validation failed', details))
}

export default handleValidationErrors
