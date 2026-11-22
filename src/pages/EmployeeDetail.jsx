import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Edit2, Mail, Phone, Building2, Briefcase, DollarSign, Calendar, BadgeCheck, IdCard } from 'lucide-react'
import { employeeService } from '../services/employeeService.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import EmployeeForm from '../components/EmployeeForm.jsx'
import Modal from '../components/Modal.jsx'
import Spinner from '../components/Spinner.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { initials, classForStatus, formatCurrency, formatDate, titleCase } from '../utils/format.js'
import { STATUS_LABELS } from '../utils/constants.js'

export default function EmployeeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAdmin } = useAuth()
  const toast = useToast()
  const [employee, setEmployee] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editOpen, setEditOpen] = useState(false)
  const [editLoading, setEditLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await employeeService.get(id)
      setEmployee(res.data.employee)
    } catch (err) {
      setError(err.message || 'Failed to load employee')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [id])

  const handleEditSubmit = async (payload) => {
    setEditLoading(true)
    try {
      const res = await employeeService.update(id, payload)
      setEmployee(res.data.employee)
      toast.success('Employee updated successfully')
      setEditOpen(false)
    } catch (err) {
      toast.error(err.message || 'Update failed')
    } finally {
      setEditLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error || !employee) {
    return (
      <div className="space-y-4">
        <Link to="/employees" className="btn-ghost"><ArrowLeft size={16} /> Back to list</Link>
        <EmptyState title="Employee not found" message={error || 'The employee you are looking for does not exist.'} />
      </div>
    )
  }

  const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3 py-3 border-b border-neutral-100 last:border-0">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500">
        <Icon size={16} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-neutral-500">{label}</p>
        <p className="text-sm font-medium text-neutral-800 break-words">{value || '—'}</p>
      </div>
    </div>
  )

  return (
    <div className="space-y-6 animate-fade-in">
      <Link to="/employees" className="btn-ghost"><ArrowLeft size={16} /> Back to employees</Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile card */}
        <div className="card p-6 text-center">
          {employee.profileImage ? (
            <img
              src={employee.profileImage}
              alt={employee.name}
              className="h-24 w-24 mx-auto rounded-full object-cover ring-4 ring-primary-50"
              onError={(e) => { e.target.style.display = 'none' }}
            />
          ) : (
            <div className="h-24 w-24 mx-auto rounded-full bg-primary-100 flex items-center justify-center text-2xl font-bold text-primary-700 ring-4 ring-primary-50">
              {initials(employee.name)}
            </div>
          )}
          <h2 className="mt-4 text-xl font-bold text-neutral-900">{employee.name}</h2>
          <p className="text-sm text-neutral-500">{employee.designation}</p>
          <div className="mt-3 flex items-center justify-center gap-2 flex-wrap">
            <span className={`badge ${classForStatus(employee.status)}`}>
              {STATUS_LABELS[employee.status] || titleCase(employee.status)}
            </span>
            <span className="badge bg-primary-50 text-primary-700">{employee.department}</span>
          </div>
          {isAdmin && (
            <button onClick={() => setEditOpen(true)} className="btn-secondary w-full mt-5">
              <Edit2 size={16} /> Edit Employee
            </button>
          )}
        </div>

        {/* Details */}
        <div className="card p-6 lg:col-span-2">
          <h3 className="text-base font-semibold text-neutral-900 mb-2">Employee Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
            <InfoRow icon={IdCard} label="Employee ID" value={employee.employeeId} />
            <InfoRow icon={Mail} label="Email" value={employee.email} />
            <InfoRow icon={Phone} label="Phone" value={employee.phone} />
            <InfoRow icon={Building2} label="Department" value={employee.department} />
            <InfoRow icon={Briefcase} label="Designation" value={employee.designation} />
            <InfoRow icon={DollarSign} label="Salary" value={formatCurrency(employee.salary)} />
            <InfoRow icon={Calendar} label="Joining Date" value={formatDate(employee.joiningDate)} />
            <InfoRow icon={BadgeCheck} label="Employment Status" value={STATUS_LABELS[employee.status] || titleCase(employee.status)} />
          </div>
          <div className="mt-4 pt-4 border-t border-neutral-100 text-xs text-neutral-400">
            Created {formatDate(employee.createdAt)} · Last updated {formatDate(employee.updatedAt)}
          </div>
        </div>
      </div>

      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit Employee"
        maxWidth="max-w-2xl"
      >
        <EmployeeForm
          initial={employee}
          isEdit
          onSubmit={handleEditSubmit}
          onCancel={() => setEditOpen(false)}
          loading={editLoading}
        />
      </Modal>
    </div>
  )
}
