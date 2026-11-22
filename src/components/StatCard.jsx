export default function StatCard({ label, value, icon: Icon, color = 'primary', loading }) {
  const colors = {
    primary: 'bg-primary-50 text-primary-600',
    success: 'bg-success-50 text-success-600',
    warning: 'bg-warning-50 text-warning-600',
    error: 'bg-error-50 text-error-600',
    neutral: 'bg-neutral-100 text-neutral-600',
  }
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-500">{label}</p>
          <p className="mt-2 text-2xl font-bold text-neutral-900">
            {loading ? '—' : value}
          </p>
        </div>
        {Icon && (
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colors[color]}`}>
            <Icon size={22} />
          </div>
        )}
      </div>
    </div>
  )
}
