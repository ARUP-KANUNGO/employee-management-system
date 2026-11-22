export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  const pages = []
  const start = Math.max(1, page - 2)
  const end = Math.min(totalPages, page + 2)

  for (let i = start; i <= end; i++) pages.push(i)

  const btn = (p, label, disabled, active) => (
    <button
      key={label}
      onClick={() => !disabled && onPageChange(p)}
      disabled={disabled}
      className={`min-w-[2rem] rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
        active
          ? 'bg-primary-600 text-white'
          : disabled
          ? 'text-neutral-300 cursor-not-allowed'
          : 'text-neutral-700 hover:bg-neutral-100'
      }`}
    >
      {label}
    </button>
  )

  return (
    <div className="flex items-center justify-center gap-1 mt-6">
      {btn(page - 1, 'Prev', page === 1, false)}
      {start > 1 && (
        <>
          {btn(1, '1', false, page === 1)}
          {start > 2 && <span className="px-1 text-neutral-400">…</span>}
        </>
      )}
      {pages.map((p) => btn(p, String(p), false, p === page))}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-1 text-neutral-400">…</span>}
          {btn(totalPages, String(totalPages), false, page === totalPages)}
        </>
      )}
      {btn(page + 1, 'Next', page === totalPages, false)}
    </div>
  )
}
