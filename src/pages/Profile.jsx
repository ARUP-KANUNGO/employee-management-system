import { useEffect, useState } from 'react'
import { UserCircle, Mail, Phone, Building2, Briefcase, DollarSign, Calendar, IdCard, Save } from 'lucide-react'
import { employeeService } from '../services/employeeService.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import Spinner from '../components/Spinner.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { initials, classForStatus, formatCurrency, formatDate, titleCase } from '../utils/format.js'
import { STATUS_LABELS, DEPARTMENTS, EMPLOYMENT_STATUSES } from '../utils/constants.js'

// Fields an employee is permitted to self-edit
const EMPLOYEE_EDITABLE = ['phone', 'profileImage']

export default function Profile() {
  const { user, isAdmin, updateUser } = useAuth()
  const toast = useToast()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await employeeService.getMyProfile()
      setProfile(res.data.employee)
      setForm({
        phone: res.data.employee?.phone || '',
        profileImage: res.data.employee?.profileImage || '',
      })
    } catch (err) {
      setError(err.message || 'Could not load your profile')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await employeeService.updateMyProfile({
        phone: form.phone,
        profileImage: form.profileImage.trim() || undefined,
      })
      setProfile(res.data.employee)
      setEditing(false)
      toast.success('Profile updated')
    } catch (err) {
      toast.error(err.message || 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error || !profile) {
    return (
      <EmptyState
        title="No employee profile linked"
        message={error || 'Your account is not linked to an employee record. An admin must create an employee and link it to your account.'}
      />
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
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">My Profile</h1>
        <p className="text-sm text-neutral-500 mt-1">
          {isAdmin ? 'Your linked employee record.' : 'View your profile and update your permitted details.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-6 text-center">
          {profile.profileImage ? (
            <img src={profile.profileImage} alt={profile.name} className="h-24 w-24 mx-auto rounded-full object-cover ring-4 ring-primary-50" onError={(e) => { e.target.style.display = 'none' }} />
          ) : (
            <div className="h-24 w-24 mx-auto rounded-full bg-primary-100 flex items-center justify-center text-2xl font-bold text-primary-700 ring-4 ring-primary-50">
              {initials(profile.name)}
            </div>
          )}
          <h2 className="mt-4 text-xl font-bold text-neutral-900">{profile.name}</h2>
          <p className="text-sm text-neutral-500">{profile.designation}</p>
          <div className="mt-3 flex items-center justify-center gap-2 flex-wrap">
            <span className={`badge ${classForStatus(profile.status)}`}>
              {STATUS_LABELS[profile.status] || titleCase(profile.status)}
            </span>
            <span className="badge bg-primary-50 text-primary-700">{profile.department}</span>
          </div>
          {!isAdmin && (
            <button onClick={() => setEditing((e) => !e)} className="btn-secondary w-full mt-5">
              {editing ? 'Cancel' : 'Edit my details'}
            </button>
          )}
        </div>

        <div className="card p-6 lg:col-span-2">
          <h3 className="text-base font-semibold text-neutral-900 mb-2">Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
            <InfoRow icon={IdCard} label="Employee ID" value={profile.employeeId} />
            <InfoRow icon={Mail} label="Email" value={profile.email} />
            <div className="flex items-start gap-3 py-3 border-b border-neutral-100">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500">
                <Phone size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-neutral-500">Phone</p>
                {editing && !isAdmin ? (
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    className="input mt-0.5"
                    placeholder="Phone number"
                  />
                ) : (
                  <p className="text-sm font-medium text-neutral-800">{profile.phone || '—'}</p>
                )}
              </div>
            </div>
            <InfoRow icon={Building2} label="Department" value={profile.department} />
            <InfoRow icon={Briefcase} label="Designation" value={profile.designation} />
            <InfoRow icon={DollarSign} label="Salary" value={isAdmin ? formatCurrency(profile.salary) : '—'} />
            <InfoRow icon={Calendar} label="Joining Date" value={formatDate(profile.joiningDate)} />
            <InfoRow icon={UserCircle} label="Employment Status" value={STATUS_LABELS[profile.status] || titleCase(profile.status)} />

            <div className="flex items-start gap-3 py-3 border-b border-neutral-100 sm:col-span-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500">
                <UserCircle size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-neutral-500">Profile Image URL</p>
                {editing && !isAdmin ? (
                  <input
                    name="profileImage"
                    value={form.profileImage}
                    onChange={(e) => setForm((f) => ({ ...f, profileImage: e.target.value }))}
                    className="input mt-0.5"
                    placeholder="https://…"
                  />
                ) : (
                  <p className="text-sm font-medium text-neutral-800 break-all">{profile.profileImage || '—'}</p>
                )}
              </div>
            </div>
          </div>

          {editing && !isAdmin && (
            <div className="mt-4 flex justify-end">
              <button onClick={handleSave} className="btn-primary" disabled={saving}>
                <Save size={16} /> {saving ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          )}

          {!isAdmin && (
            <p className="mt-4 text-xs text-neutral-400">
              You can update your phone number and profile image. Contact an admin to change other details.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
