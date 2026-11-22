import { Link } from 'react-router-dom'
import { Eye, Edit2, Trash2, ArrowUp, ArrowDown } from 'lucide-react'
import { initials, classForStatus, formatCurrency, formatDate, titleCase } from '../utils/format.js'
import { STATUS_LABELS } from '../utils/constants.js'

export default function EmployeeTable({
  employees,
  loading,
  canManage,
  sortBy,
  sortOrder,
  onSort,
  onView,
  onEdit,
  onDelete,
}) {
  if (loading) {
    return (
      <div className="card p-12">
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 rounded-lg bg-neutral-100 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (!employees || employees.length === 0) {
    return null
  }

  const SortHeader = ({ field, children }) => (
    <th
      className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider cursor-pointer select-none hover:text-neutral-700"
      onClick={() => onSort(field)}
    >
      <span className="inline-flex items-center gap-1">
        {children}
        {sortBy === field &&
          (sortOrder === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />)}
      </span>
    </th>
  )

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <SortHeader field="employeeId">Emp ID</SortHeader>
              <SortHeader field="name">Name</SortHeader>
              <SortHeader field="department">Department</SortHeader>
              <SortHeader field="designation">Designation</SortHeader>
              <SortHeader field="salary">Salary</SortHeader>
              <SortHeader field="status">Status</SortHeader>
              <SortHeader field="joiningDate">Joined</SortHeader>
              <th className="px-4 py-3 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {employees.map((emp) => (
              <tr key={emp._id} className="hover:bg-neutral-50 transition-colors">
                <td className="px-4 py-3 text-sm font-medium text-neutral-700">
                  {emp.employeeId}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {emp.profileImage ? (
                      <img
                        src={emp.profileImage}
                        alt={emp.name}
                        className="h-9 w-9 rounded-full object-cover"
                        onError={(e) => { e.target.style.display = 'none' }}
                      />
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700">
                        {initials(emp.name)}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-neutral-800">{emp.name}</p>
                      <p className="text-xs text-neutral-500">{emp.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-neutral-600">{emp.department}</td>
                <td className="px-4 py-3 text-sm text-neutral-600">{emp.designation}</td>
                <td className="px-4 py-3 text-sm text-neutral-600">{formatCurrency(emp.salary)}</td>
                <td className="px-4 py-3">
                  <span className={`badge ${classForStatus(emp.status)}`}>
                    {STATUS_LABELS[emp.status] || titleCase(emp.status)}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-neutral-600">{formatDate(emp.joiningDate)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onView(emp)}
                      className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-primary-600 transition-colors"
                      title="View"
                    >
                      <Eye size={16} />
                    </button>
                    {canManage && (
                      <>
                        <button
                          onClick={() => onEdit(emp)}
                          className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-primary-600 transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => onDelete(emp)}
                          className="rounded-md p-1.5 text-neutral-500 hover:bg-error-50 hover:text-error-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
