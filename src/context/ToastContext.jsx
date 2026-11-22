import { createContext, useCallback, useContext, useEffect, useState } from 'react'

const ToastContext = createContext(null)

let idCounter = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const add = useCallback((type, message) => {
    const id = ++idCounter
    setToasts((prev) => [...prev, { id, type, message }])
    setTimeout(() => remove(id), 4000)
  }, [remove])

  const toast = {
    success: (msg) => add('success', msg),
    error: (msg) => add('error', msg),
    info: (msg) => add('info', msg),
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} remove={remove} />
    </ToastContext.Provider>
  )
}

function ToastContainer({ toasts, remove }) {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm pointer-events-none">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} remove={remove} />
      ))}
    </div>
  )
}

function ToastItem({ toast, remove }) {
  const styles = {
    success: 'bg-success-600 text-white',
    error: 'bg-error-600 text-white',
    info: 'bg-primary-600 text-white',
  }
  const icons = { success: '✓', error: '✕', info: 'i' }
  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 rounded-lg px-4 py-3 shadow-lg animate-slide-in ${styles[toast.type]}`}
      role="alert"
    >
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
        {icons[toast.type]}
      </span>
      <p className="flex-1 text-sm font-medium leading-5">{toast.message}</p>
      <button
        onClick={() => remove(toast.id)}
        className="text-white/80 hover:text-white text-lg leading-none"
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
