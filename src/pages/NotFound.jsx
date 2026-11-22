import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 p-6">
      <div className="text-center">
        <p className="text-7xl font-bold text-primary-600">404</p>
        <h1 className="mt-4 text-2xl font-bold text-neutral-900">Page not found</h1>
        <p className="mt-2 text-sm text-neutral-500">The page you're looking for doesn't exist or has moved.</p>
        <Link to="/dashboard" className="btn-primary mt-6 inline-flex">Go to Dashboard</Link>
      </div>
    </div>
  )
}
