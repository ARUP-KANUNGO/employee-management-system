import { Inbox } from 'lucide-react'

export default function EmptyState({ icon: Icon = Inbox, title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-white py-16 px-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
        <Icon size={28} />
      </div>
      <h3 className="mt-4 text-base font-semibold text-neutral-800">{title}</h3>
      {message && <p className="mt-1 text-sm text-neutral-500 max-w-sm">{message}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
