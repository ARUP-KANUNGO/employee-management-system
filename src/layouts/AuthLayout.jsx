import { Link } from 'react-router-dom'
import { Users, ShieldCheck, BarChart3, Search } from 'lucide-react'

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen flex">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-neutral-900 text-white flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 20% 30%, #3b82f6 0%, transparent 40%), radial-gradient(circle at 80% 70%, #0ea5e9 0%, transparent 40%)'
        }} />
        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 font-bold">
              EMS
            </div>
            <span className="text-lg font-semibold">EmployeeMS</span>
          </div>
        </div>
        <div className="relative space-y-8">
          <div>
            <h1 className="text-3xl font-bold leading-tight">
              Manage your workforce with confidence.
            </h1>
            <p className="mt-3 text-neutral-400 max-w-md">
              A centralized, secure dashboard for employee records, roles, and team insights —
              built for modern organizations.
            </p>
          </div>
          <div className="space-y-4">
            <Feature icon={Users} text="Centralized employee records" />
            <Feature icon={ShieldCheck} text="Role-based access control" />
            <Feature icon={BarChart3} text="Real-time dashboard statistics" />
            <Feature icon={Search} text="Search, filter & sort instantly" />
          </div>
        </div>
        <div className="relative text-sm text-neutral-500">
          © {new Date().getFullYear()} EmployeeMS. All rights reserved.
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-12 bg-neutral-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-white font-bold">
              EMS
            </div>
            <span className="text-lg font-semibold text-neutral-900">EmployeeMS</span>
          </div>
          <h2 className="text-2xl font-bold text-neutral-900">{title}</h2>
          <p className="mt-2 text-sm text-neutral-500">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  )
}

function Feature({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-primary-400">
        <Icon size={18} />
      </div>
      <span className="text-sm text-neutral-300">{text}</span>
    </div>
  )
}
