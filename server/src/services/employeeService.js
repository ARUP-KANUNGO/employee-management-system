import Employee from '../models/Employee.js'
import { generateEmployeeId } from '../utils/employeeId.js'
import { ConflictError, NotFoundError, ForbiddenError } from '../utils/AppError.js'

const ALLOWED_SORT = ['name','email','employeeId','department','designation','salary','status','joiningDate','createdAt']

export async function listEmployees({ search, department, status, page = 1, limit = 8, sortBy = 'createdAt', sortOrder = 'desc' }) {
  const filter = {}
  if (department) filter.department = department
  if (status) filter.status = status
  if (search) {
    const rx = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
    filter.$or = [{ name: rx }, { email: rx }, { employeeId: rx }]
  }
  const sortField = ALLOWED_SORT.includes(sortBy) ? sortBy : 'createdAt'
  const sortDir = sortOrder === 'asc' ? 1 : -1
  const pageNum = Math.max(1, parseInt(page, 10))
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)))
  const skip = (pageNum - 1) * limitNum

  const [employees, totalItems] = await Promise.all([
    Employee.find(filter).sort({ [sortField]: sortDir }).skip(skip).limit(limitNum).lean(),
    Employee.countDocuments(filter),
  ])
  const totalPages = Math.ceil(totalItems / limitNum) || 1
  return {
    employees,
    pagination: { currentPage: pageNum, totalPages, totalItems, limit: limitNum, hasMore: pageNum < totalPages },
  }
}

export async function getEmployeeById(id) {
  const emp = await Employee.findById(id).lean()
  if (!emp) throw new NotFoundError('Employee not found.')
  return emp
}

export async function createEmployee(data) {
  const existingEmail = await Employee.findOne({ email: data.email.toLowerCase() }).lean()
  if (existingEmail) throw new ConflictError('An employee with this email already exists.')
  let employeeId = data.employeeId
  if (!employeeId) {
    employeeId = await generateEmployeeId(Employee)
  } else {
    const existingId = await Employee.findOne({ employeeId }).lean()
    if (existingId) throw new ConflictError('Employee ID already exists.')
  }
  const emp = await Employee.create({ ...data, email: data.email.toLowerCase(), employeeId })
  return emp
}

export async function updateEmployee(id, data) {
  if (data.email) {
    const dup = await Employee.findOne({ email: data.email.toLowerCase(), _id: { $ne: id } }).lean()
    if (dup) throw new ConflictError('Another employee already uses this email.')
  }
  if (data.employeeId) {
    const dup = await Employee.findOne({ employeeId: data.employeeId, _id: { $ne: id } }).lean()
    if (dup) throw new ConflictError('Another employee already uses this Employee ID.')
  }
  const updated = await Employee.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean()
  if (!updated) throw new NotFoundError('Employee not found.')
  return updated
}

export async function deleteEmployee(id) {
  const result = await Employee.findByIdAndDelete(id)
  if (!result) throw new NotFoundError('Employee not found.')
  return result
}

export async function getStats() {
  const [total, byStatusAgg, byDeptAgg, recent] = await Promise.all([
    Employee.countDocuments(),
    Employee.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Employee.aggregate([{ $group: { _id: '$department', count: { $sum: 1 } } }]),
    Employee.find().sort({ createdAt: -1 }).limit(5).lean(),
  ])
  const byStatus = {}
  byStatusAgg.forEach((s) => { byStatus[s._id] = s.count })
  const byDepartment = {}
  byDeptAgg.forEach((d) => { byDepartment[d._id] = d.count })
  return { total, byStatus, byDepartment, recent }
}

export async function getMyProfile(userId) {
  const emp = await Employee.findOne({ linkedUser: userId }).lean()
  if (!emp) throw new NotFoundError('No employee profile is linked to your account.')
  return emp
}

export async function updateMyProfile(userId, data) {
  const emp = await Employee.findOneAndUpdate({ linkedUser: userId }, data, { new: true, runValidators: true }).lean()
  if (!emp) throw new NotFoundError('No employee profile is linked to your account.')
  return emp
}

export function assertCanAccessEmployee(req, employee) {
  if (req.user.role === 'admin') return
  if (employee.linkedUser && employee.linkedUser.toString() === req.user._id.toString()) return
  throw new ForbiddenError('You do not have permission to access this employee record.')
}

export default { listEmployees, getEmployeeById, createEmployee, updateEmployee, deleteEmployee, getStats, getMyProfile, updateMyProfile, assertCanAccessEmployee }
