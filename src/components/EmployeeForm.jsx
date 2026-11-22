import { useState } from 'react'
import { DEPARTMENTS, EMPLOYMENT_STATUSES, STATUS_LABELS } from '../utils/constants.js'

const initialForm = {
  employeeId: '',
  name: '',
  email: '',
  phone: '',
  department: DEPARTMENTS[0],
  designation: '',
  salary: '',
  joiningDate: '',
  status: 'active',
  profileImage: '',
}

export default function EmployeeForm({ initial, onSubmit, onCancel, loading, isEdit }) {
  const [form, setForm] = useState(() => ({
    ...initialForm,
    ...initial,
    salary: initial?.salary ?? '',
    joiningDate: initial?.joiningDate
      ? new Date(initial.joiningDate).toISOString().slice(0, 10)
      : '',
  }))
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.employeeId.trim()) e.employeeId = 'Employee ID is required'
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email'
    if (!form.designation.trim()) e.designation = 'Designation is required'
    if (form.salary === '' || form.salary === null) e.salary = 'Salary is required'
    else if (Number(form.salary) < 0) e.salary = 'Salary cannot be negative'
    if (!form.joiningDate) e.joiningDate = 'Joining date is required'
    if (form.phone && !/^[\d\s+\-()]{7,20}$/.test(form.phone)) e.phone = 'Invalid phone'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit({
      ...form,
      salary: Number(form.salary),
      profileImage: form.profileImage.trim() || undefined,
    })
  }

  const field = (name, label, type = 'text', extra) => (
    <div>
      <label className="label" htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={form[name]}
        onChange={handleChange}
        className={`input ${errors[name] ? 'border-error-500 focus:ring-error-500/30' : ''}`}
        disabled={isEdit && name === 'employeeId'}
      />
      {errors[name] && <p className="mt-1 text-xs text-error-600">{errors[name]}</p>}
      {extra}
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {field('employeeId', 'Employee ID')}
        {field('name', 'Full Name')}
        {field('email', 'Email', 'email')}
        {field('phone', 'Phone')}
        {field('designation', 'Designation')}
        {field('salary', 'Salary', 'number')}
        {field('joiningDate', 'Joining Date', 'date')}
        {field('profileImage', 'Profile Image URL (optional)')}
        <div>
          <label className="label" htmlFor="department">Department</label>
          <select
            id="department"
            name="department"
            value={form.department}
            onChange={handleChange}
            className="input"
          >
            {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="status">Employment Status</label>
          <select
            id="status"
            name="status"
            value={form.status}
            onChange={handleChange}
            className="input"
          >
            {EMPLOYMENT_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
        <button type="button" onClick={onCancel} className="btn-secondary" disabled={loading}>
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Saving…' : isEdit ? 'Update Employee' : 'Add Employee'}
        </button>
      </div>
    </form>
  )
}
