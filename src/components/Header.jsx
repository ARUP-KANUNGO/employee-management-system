import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, ChevronDown, LogOut, UserCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

export default function Header({ onMenuClick }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-neutral-200 bg-white px-4 lg:px-6">
      <button
        onClick={onMenuClick}
        className="lg:hidden text-neutral-600 hover:text-neutral-900"
        aria-label="Open sidebar"
      >
        <Menu size={22} />
      </button>

      <div className="hidden lg:block">
        <h2 className="text-sm font-medium text-neutral-500">
          Welcome back, <span className="text-neutral-800 font-semibold">{user?.name}</span>
        </h2>
      </div>

      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-neutral-100 transition-colors"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
            {(user?.name || '?').slice(0, 2).toUpperCase()}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-medium text-neutral-800 leading-tight">{user?.name}</p>
            <p className="text-xs text-neutral-500 capitalize">{user?.role}</p>
          </div>
          <ChevronDown size={16} className="text-neutral-400" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-lg border border-neutral-200 bg-white py-1 shadow-lg animate-fade-in">
            <button
              onClick={() => { setMenuOpen(false); navigate('/profile') }}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
            >
              <UserCircle size={16} /> My Profile
            </button>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-error-600 hover:bg-error-50"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
