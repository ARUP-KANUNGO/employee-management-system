import { Router } from 'express'
import { authenticate, requireAdmin } from '../middleware/auth.js'
import handleValidationErrors from '../middleware/validate.js'
import {
  employeeCreateValidator,
  employeeUpdateValidator,
  profileUpdateValidator,
} from '../validators/index.js'
import employeeController from '../controllers/employeeController.js'

const router = Router()

// All employee routes require authentication
router.use(authenticate)

// Dashboard stats (any authenticated user)
router.get('/stats/summary', employeeController.stats)

// Employee self-profile (any authenticated user)
router.get('/me/profile', employeeController.myProfile)
router.put('/me/profile', profileUpdateValidator, handleValidationErrors, employeeController.updateMyProfile)

// CRUD - admin only for create/delete; update allowed if own record (asserted in controller)
router.get('/', employeeController.list)
router.get('/:id', employeeController.getOne)
router.post('/', requireAdmin, employeeCreateValidator, handleValidationErrors, employeeController.create)
router.put('/:id', employeeUpdateValidator, handleValidationErrors, employeeController.update)
router.delete('/:id', requireAdmin, employeeController.remove)

export default router
