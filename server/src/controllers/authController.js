import authService from '../services/authService.js'
import { sendSuccess } from '../utils/response.js'

export async function register(req, res, next) {
  try {
    const { name, email, password, role } = req.body
    const user = await authService.registerUser({ name, email, password, role })
    const token = authService.signToken(user)
    sendSuccess(res, { user: authService.publicUser(user), token }, null, 201)
  } catch (err) { next(err) }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body
    const user = await authService.loginUser({ email, password })
    const token = authService.signToken(user)
    sendSuccess(res, { user: authService.publicUser(user), token })
  } catch (err) { next(err) }
}

export async function me(req, res, next) {
  try {
    const user = await authService.getUserById(req.user._id)
    sendSuccess(res, { user: authService.publicUser(user) })
  } catch (err) { next(err) }
}

export default { register, login, me }
