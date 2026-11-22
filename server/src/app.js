import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import config from './config/index.js'
import apiRoutes from './routes/index.js'
import { notFound, errorHandler } from './middleware/error.js'

export function createApp() {
  const app = express()

  app.set('trust proxy', 1)

  app.use(helmet())
  app.use(compression())
  app.use(
    cors({
      origin: (origin, cb) => {
        if (!origin || config.clientUrls.includes(origin)) return cb(null, true)
        cb(new Error(`Origin ${origin} not allowed by CORS`))
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }),
  )
  app.use(express.json({ limit: '1mb' }))
  app.use(express.urlencoded({ extended: true }))
  if (config.env !== 'test') app.use(morgan(config.isProd ? 'combined' : 'dev'))

  if (process.env.NODE_ENV !== 'test') {
    const generalLimiter = rateLimit({
      windowMs: config.rateLimitWindowMs,
      max: config.rateLimitMax,
      standardHeaders: true,
      legacyHeaders: false,
      message: { success: false, message: 'Too many requests. Please try again later.' },
    })
    app.use('/api', generalLimiter)
  }

  app.get('/', (_req, res) => {
    res.json({ success: true, message: 'Employee Management System API', docs: '/api/health' })
  })

  app.use('/api', apiRoutes)

  app.use(notFound)
  app.use(errorHandler)

  return app
}

export default createApp
