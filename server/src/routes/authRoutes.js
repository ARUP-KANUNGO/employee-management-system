import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { authenticate } from '../middleware/auth.js'
import handleValidationErrors from '../middleware/validate.js'
import { registerValidator, loginValidator } from '../validators/index.js'
import authController from '../controllers/authController.js'
import config from '../config/index.js'

const router = Router()

const authLimiter = process.env.NODE_ENV === 'test'
  ? (_req, _res, next) => next()
  : rateLimit({
      windowMs: config.rateLimitWindowMs,
      max: config.authRateLimitMax,
      message: { success: false, message: 'Too many attempts. Please try again later.' },
      standardHeaders: true,
      legacyHeaders: false,
    })

router.post('/register', authLimiter, registerValidator, handleValidationErrors, authController.register)
router.post('/login', authLimiter, loginValidator, handleValidationErrors, authController.login)
router.get('/me', authenticate, authController.me)

export default router
