import { Router } from 'express'
import authRoutes from './authRoutes.js'
import employeeRoutes from './employeeRoutes.js'

const router = Router()

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'API is running', timestamp: new Date().toISOString() })
})

router.use('/auth', authRoutes)
router.use('/employees', employeeRoutes)

export default router
