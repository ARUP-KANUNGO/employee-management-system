import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, UserCheck, UserX, Building2, ArrowRight, Clock } from 'lucide-react'
import { employeeService } from '../services/employeeService.js'
import { useAuth } from '../context/AuthContext.jsx'
import StatCard from '../components/StatCard.jsx'
import Spinner from '../components/Spinner.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { initials, classForStatus, formatDate, titleCase } from '../utils/format.js'
import { STATUS_LABELS } from '../utils/constants.js'

export default function Dashboard() {
  const { isAdmin } = useAuth()
  const [stats, setStats] = useState(null)
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await employeeService.stats()
        if (!active) return
        setStats(res.data.stats)
        setRecent(res.data.recent || [])
      } catch (err) {
        if (active) setError(err.message || 'Failed to load dashboard data')
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [])

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner size="lg" label="Loading dashboard…" />
      </div>
    )
  }

  if (error) {
    return (
      <EmptyState
        title="Could not load dashboard"
        message={error}
      />
    )
  }

  const total = stats?.total ?? 0
  const active = stats?.byStatus?.active ?? 0
  const inactive = (stats?.byStatus?.inactive ?? 0) + (stats?.byStatus?.terminated ?? 0)
  const departments = stats?.byDepartment
    ? Object.entries(stats.byDepartment).sort((a, b) => b[1] - a[1])
    : []
  const maxDept = departments.length ? Math.max(...departments.map((d) => d[1])) : 1

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
        <p className="text-sm text-neutral-500 mt-1">
          {isAdmin ? 'Overview of your organization\'s workforce.' : 'Overview of your organization.'}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Employees" value={total} icon={Users} color="primary" />
        <StatCard label="Active" value={active} icon={UserCheck} color="success" />
        <StatCard label="Inactive / Terminated" value={inactive} icon={UserX} color="error" />
        <StatCard label="Departments" value={departments.length} icon={Building2} color="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department breakdown */}
        <div className="card p-5 lg:col-span-2">
          <h3 className="text-base font-semibold text-neutral-900">Employees by Department</h3>
          <p className="text-sm text-neutral-500 mt-0.5">Distribution across the organization</p>
          <div className="mt-5 space-y-3">
            {departments.length === 0 ? (
              <p className="text-sm text-neutral-400 py-8 text-center">No department data yet.</p>
            ) : (
              departments.map(([dept, count]) => (
                <div key={dept}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium text-neutral-700">{dept}</span>
                    <span className="text-neutral-500">{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-neutral-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary-500 transition-all duration-500"
                      style={{ width: `${(count / maxDept) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Status breakdown */}
        <div className="card p-5">
          <h3 className="text-base font-semibold text-neutral-900">Status Breakdown</h3>
          <div className="mt-5 space-y-3">
            {Object.entries(STATUS_LABELS).map(([key, label]) => {
              const count = stats?.byStatus?.[key] ?? 0
              return (
                <div key={key} className="flex items-center justify-between">
                  <span className={`badge ${classForStatus(key)}`}>{label}</span>
                  <span className="text-sm font-semibold text-neutral-700">{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Recent additions */}
      <div className="card p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-neutral-900">Recent Additions</h3>
            <p className="text-sm text-neutral-500 mt-0.5">Latest employees to join</p>
          </div>
          {isAdmin && (
            <Link to="/employees" className="btn-ghost text-primary-600 hover:bg-primary-50">
              View all <ArrowRight size={16} />
            </Link>
          )}
        </div>
        <div className="mt-4">
          {recent.length === 0 ? (
            <EmptyState title="No employees yet" message="New hires will appear here." />
          ) : (
            <div className="divide-y divide-neutral-100">
              {recent.map((emp) => (
                <div key={emp._id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700">
                      {initials(emp.name)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-800">{emp.name}</p>
                      <p className="text-xs text-neutral-500">{emp.designation} · {emp.department}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`badge ${classForStatus(emp.status)}`}>
                      {STATUS_LABELS[emp.status] || titleCase(emp.status)}
                    </span>
                    <p className="text-xs text-neutral-400 mt-1 flex items-center gap-1 justify-end">
                      <Clock size={11} /> {formatDate(emp.joiningDate)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
