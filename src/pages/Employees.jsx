import { useEffect, useState, useCallback } from 'react'
import { Plus, Search, Filter, X } from 'lucide-react'
import { employeeService } from '../services/employeeService.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import EmployeeTable from '../components/EmployeeTable.jsx'
import EmployeeForm from '../components/EmployeeForm.jsx'
import Modal from '../components/Modal.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import Pagination from '../components/Pagination.jsx'
import EmptyState from '../components/EmptyState.jsx'
import Spinner from '../components/Spinner.jsx'
import { DEPARTMENTS, EMPLOYMENT_STATUSES, STATUS_LABELS } from '../utils/constants.js'

export default function Employees() {
  const { isAdmin } = useAuth()
  const toast = useToast()
  const canManage = isAdmin

  const [data, setData] = useState({ employees: [], pagination: null })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [department, setDepartment] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [limit] = useState(8)
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [formLoading, setFormLoading] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 350)
    return () => clearTimeout(t)
  }, [search])

  const fetchEmployees = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await employeeService.list({
        search: debouncedSearch,
        department,
        status,
        page,
        limit,
        sortBy,
        sortOrder,
      })
      setData({ employees: res.data.employees, pagination: res.data.pagination })
    } catch (err) {
      setError(err.message || 'Failed to load employees')
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch, department, status, page, limit, sortBy, sortOrder])

  useEffect(() => {
    fetchEmployees()
  }, [fetchEmployees])

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
    setPage(1)
  }

  const handleAdd = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const handleEdit = (emp) => {
    setEditing(emp)
    setFormOpen(true)
  }

  const handleFormSubmit = async (payload) => {
    setFormLoading(true)
    try {
      if (editing) {
        const res = await employeeService.update(editing._id, payload)
        toast.success(`Updated ${res.data.employee.name}`)
      } else {
        const res = await employeeService.create(payload)
        toast.success(`Added ${res.data.employee.name}`)
      }
      setFormOpen(false)
      setEditing(null)
      fetchEmployees()
    } catch (err) {
      toast.error(err.message || 'Save failed')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    try {
      await employeeService.remove(deleteTarget._id)
      toast.success(`Deleted ${deleteTarget.name}`)
      setDeleteTarget(null)
      fetchEmployees()
    } catch (err) {
      toast.error(err.message || 'Delete failed')
    } finally {
      setDeleteLoading(false)
    }
  }

  const clearFilters = () => {
    setSearch('')
    setDepartment('')
    setStatus('')
    setPage(1)
  }

  const hasFilters = debouncedSearch || department || status

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Employees</h1>
          <p className="text-sm text-neutral-500 mt-1">
            {canManage ? 'Manage your organization\'s employee records.' : 'Browse the employee directory.'}
          </p>
        </div>
        {canManage && (
          <button onClick={handleAdd} className="btn-primary">
            <Plus size={18} /> Add Employee
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or employee ID…"
              className="input pl-10"
            />
          </div>
          <div className="relative">
            <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
            <select
              value={department}
              onChange={(e) => { setDepartment(e.target.value); setPage(1) }}
              className="input pl-10 sm:w-44"
            >
              <option value="">All Departments</option>
              {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1) }}
            className="input sm:w-40"
          >
            <option value="">All Statuses</option>
            {EMPLOYMENT_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
          </select>
          {hasFilters && (
            <button onClick={clearFilters} className="btn-secondary">
              <X size={16} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      {error ? (
        <EmptyState title="Something went wrong" message={error} />
      ) : loading && !data.employees.length ? (
        <div className="card p-12 flex justify-center">
          <Spinner size="lg" label="Loading employees…" />
        </div>
      ) : data.employees.length === 0 ? (
        <EmptyState
          title={hasFilters ? 'No employees match your filters' : 'No employees yet'}
          message={hasFilters ? 'Try adjusting your search or filters.' : canManage ? 'Click "Add Employee" to create your first record.' : 'There are no employee records to display.'}
          action={canManage && !hasFilters && (
            <button onClick={handleAdd} className="btn-primary"><Plus size={18} /> Add Employee</button>
          )}
        />
      ) : (
        <>
          <EmployeeTable
            employees={data.employees}
            loading={loading}
            canManage={canManage}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
            onView={(emp) => { window.location.href = `/employees/${emp._id}` }}
            onEdit={handleEdit}
            onDelete={setDeleteTarget}
          />
          {data.pagination && (
            <div className="flex items-center justify-between flex-wrap gap-3">
              <p className="text-sm text-neutral-500">
                Showing {data.pagination.currentPage * data.pagination.limit - data.pagination.limit + 1}–
                {Math.min(data.pagination.currentPage * data.pagination.limit, data.pagination.totalItems)} of{' '}
                {data.pagination.totalItems} employees
              </p>
              <Pagination
                page={data.pagination.currentPage}
                totalPages={data.pagination.totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      )}

      {/* Add/Edit modal */}
      <Modal
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditing(null) }}
        title={editing ? 'Edit Employee' : 'Add New Employee'}
        maxWidth="max-w-2xl"
      >
        <EmployeeForm
          initial={editing}
          isEdit={!!editing}
          onSubmit={handleFormSubmit}
          onCancel={() => { setFormOpen(false); setEditing(null) }}
          loading={formLoading}
        />
      </Modal>

      {/* Delete confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete employee"
        message={`Are you sure you want to delete ${deleteTarget?.name}? This action cannot be undone.`}
        confirmLabel="Delete"
        danger
        loading={deleteLoading}
      />
    </div>
  )
}
