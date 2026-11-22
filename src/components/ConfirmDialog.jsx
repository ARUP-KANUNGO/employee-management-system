import { AlertTriangle } from 'lucide-react'
import Modal from './Modal.jsx'

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Confirm action',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = false,
  loading = false,
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} maxWidth="max-w-sm">
      <div className="flex gap-3">
        {danger && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-error-100 text-error-600">
            <AlertTriangle size={20} />
          </div>
        )}
        <p className="text-sm text-neutral-600 pt-1">{message}</p>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <button onClick={onClose} className="btn-secondary" disabled={loading}>
          {cancelLabel}
        </button>
        <button
          onClick={onConfirm}
          className={danger ? 'btn-danger' : 'btn-primary'}
          disabled={loading}
        >
          {loading ? 'Working…' : confirmLabel}
        </button>
      </div>
    </Modal>
  )
}
