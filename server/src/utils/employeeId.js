/**
 * Generate the next sequential employee ID, e.g. EMP-0001.
 * Looks up the highest existing numeric suffix and increments it.
 * @param {import('mongoose').Model} EmployeeModel
 * @returns {Promise<string>}
 */
export async function generateEmployeeId(EmployeeModel) {
  const last = await EmployeeModel.findOne({}, { employeeId: 1 })
    .sort({ employeeId: -1 })
    .lean()
    .exec()

  let next = 1
  if (last && typeof last.employeeId === 'string') {
    const match = last.employeeId.match(/(\d+)$/)
    if (match) next = parseInt(match[1], 10) + 1
  }
  return `EMP-${String(next).padStart(4, '0')}`
}
