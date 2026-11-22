import employeeService from '../services/employeeService.js'
import { sendSuccess } from '../utils/response.js'

export async function list(req, res, next) {
  try {
    const { employees, pagination } = await employeeService.listEmployees(req.query)
    sendSuccess(res, employees, { pagination })
  } catch (err) { next(err) }
}

export async function getOne(req, res, next) {
  try {
    const emp = await employeeService.getEmployeeById(req.params.id)
    employeeService.assertCanAccessEmployee(req, emp)
    sendSuccess(res, { employee: emp })
  } catch (err) { next(err) }
}

export async function create(req, res, next) {
  try {
    const emp = await employeeService.createEmployee(req.body)
    sendSuccess(res, { employee: emp }, null, 201)
  } catch (err) { next(err) }
}

export async function update(req, res, next) {
  try {
    const existing = await employeeService.getEmployeeById(req.params.id)
    employeeService.assertCanAccessEmployee(req, existing)
    const emp = await employeeService.updateEmployee(req.params.id, req.body)
    sendSuccess(res, { employee: emp })
  } catch (err) { next(err) }
}

export async function remove(req, res, next) {
  try {
    const emp = await employeeService.deleteEmployee(req.params.id)
    sendSuccess(res, { employee: emp, message: 'Employee deleted successfully.' })
  } catch (err) { next(err) }
}

export async function stats(_req, res, next) {
  try {
    const s = await employeeService.getStats()
    sendSuccess(res, { stats: s })
  } catch (err) { next(err) }
}

export async function myProfile(req, res, next) {
  try {
    const emp = await employeeService.getMyProfile(req.user._id)
    sendSuccess(res, { employee: emp })
  } catch (err) { next(err) }
}

export async function updateMyProfile(req, res, next) {
  try {
    const emp = await employeeService.updateMyProfile(req.user._id, req.body)
    sendSuccess(res, { employee: emp })
  } catch (err) { next(err) }
}

export default { list, getOne, create, update, remove, stats, myProfile, updateMyProfile }
