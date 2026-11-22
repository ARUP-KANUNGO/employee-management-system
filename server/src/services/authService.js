import jwt from 'jsonwebtoken'
import config from '../config/index.js'
import User from '../models/User.js'
import { ConflictError, UnauthorizedError, NotFoundError } from '../utils/AppError.js'

export function signToken(user) {
  return jwt.sign({ sub: user._id.toString(), role: user.role }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  })
}

export function publicUser(user) {
  return { _id: user._id, name: user.name, email: user.email, role: user.role, employeeRef: user.employeeRef }
}

export async function registerUser({ name, email, password, role = 'admin' }) {
  const existing = await User.findOne({ email: email.toLowerCase() }).lean()
  if (existing) throw new ConflictError('An account with this email already exists.')
  const user = await User.create({ name, email, password, role })
  return user
}

export async function loginUser({ email, password }) {
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password')
  if (!user) throw new UnauthorizedError('Invalid email or password.')
  const ok = await user.comparePassword(password)
  if (!ok) throw new UnauthorizedError('Invalid email or password.')
  return user
}

export async function getUserById(id) {
  const user = await User.findById(id).lean()
  if (!user) throw new NotFoundError('User not found.')
  return user
}

export default { signToken, publicUser, registerUser, loginUser, getUserById }
