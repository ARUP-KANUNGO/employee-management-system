import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, UserCircle, LogOut, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

const navItems = ({ isAdmin }) => {
  const items = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, adminOnly: false },
  ]
  if (isAdmin) {
    items.push({ to: '/employees', label: 'Employees', icon: Users, adminOnly: true })
  } else {
    items.push({ to: '/employees', label: 'Directory', icon: Users, adminOnly: false })
  }
  items.push({ to: '/profile', label: 'My Profile', icon: UserCircle, adminOnly: false })
  return items
}

export default function Sidebar({ open, onClose }) {
  const { isAdmin, logout, user } = useAuth()
  const items = navItems({ isAdmin })

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-neutral-900/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-neutral-900 text-neutral-300 transition-transform duration-200 lg:translate-x-0 lg:static lg:inset-auto ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-neutral-800 px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white font-bold">
              EMS
            </div>
            <span className="text-sm font-semibold text-white">Employee MS</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-neutral-400 hover:text-white"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-col gap-1 p-3">
          {items.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-600 text-white'
                      : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                  }`
                }
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            )
          })}
        </nav>

        <div className="mt-auto absolute bottom-0 left-0 right-0 p-3 border-t border-neutral-800">
          <div className="mb-2 flex items-center gap-3 px-3 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-700 text-xs font-semibold text-white">
              {(user?.name || '?').slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">{user?.name}</p>
              <p className="truncate text-xs text-neutral-500 capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}
