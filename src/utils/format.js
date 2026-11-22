export const formatDate = (date) => {
  if (!date) return '—'
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}

export const initials = (name) => {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export const classForStatus = (status) => {
  switch (status) {
    case 'active': return 'bg-success-100 text-success-700'
    case 'inactive': return 'bg-neutral-100 text-neutral-600'
    case 'on-leave': return 'bg-warning-100 text-warning-700'
    case 'terminated': return 'bg-error-100 text-error-700'
    default: return 'bg-neutral-100 text-neutral-600'
  }
}

export const titleCase = (s) =>
  (s || '').replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
