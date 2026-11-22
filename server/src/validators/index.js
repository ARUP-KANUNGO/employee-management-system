import { body } from 'express-validator'

export const registerValidator = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters'),
  body('email').trim().isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['admin', 'employee']).withMessage('Role must be admin or employee'),
]

export const loginValidator = [
  body('email').trim().isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
]

export const employeeCreateValidator = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters'),
  body('email').trim().isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('employeeId').optional().trim().isLength({ min: 1, max: 20 }).withMessage('Employee ID must be 1–20 characters'),
  body('phone').optional().trim().matches(/^[\d\s+\-()]{0,20}$/).withMessage('Invalid phone number'),
  body('department').trim().isIn([
    'Engineering','Product','Design','Marketing','Sales',
    'Human Resources','Finance','Operations','Customer Support',
  ]).withMessage('Invalid department'),
  body('designation').trim().isLength({ min: 1, max: 100 }).withMessage('Designation is required'),
  body('salary').isFloat({ min: 0 }).withMessage('Salary must be a non-negative number'),
  body('joiningDate').isISO8601().withMessage('Joining date must be a valid date'),
  body('status').optional().isIn(['active','inactive','on-leave','terminated']).withMessage('Invalid status'),
  body('profileImage').optional().trim().isURL().withMessage('Profile image must be a valid URL'),
]

export const employeeUpdateValidator = [
  body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters'),
  body('email').optional().trim().isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('phone').optional().trim().matches(/^[\d\s+\-()]{0,20}$/).withMessage('Invalid phone number'),
  body('department').optional().trim().isIn([
    'Engineering','Product','Design','Marketing','Sales',
    'Human Resources','Finance','Operations','Customer Support',
  ]).withMessage('Invalid department'),
  body('designation').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Designation is required'),
  body('salary').optional().isFloat({ min: 0 }).withMessage('Salary must be a non-negative number'),
  body('joiningDate').optional().isISO8601().withMessage('Joining date must be a valid date'),
  body('status').optional().isIn(['active','inactive','on-leave','terminated']).withMessage('Invalid status'),
  body('profileImage').optional().trim().isURL().withMessage('Profile image must be a valid URL'),
]

export const profileUpdateValidator = [
  body('phone').optional().trim().matches(/^[\d\s+\-()]{0,20}$/).withMessage('Invalid phone number'),
  body('profileImage').optional().trim().isURL().withMessage('Profile image must be a valid URL'),
]

export default { registerValidator, loginValidator, employeeCreateValidator, employeeUpdateValidator, profileUpdateValidator }
