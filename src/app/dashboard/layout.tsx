import Link from 'next/link'
import { Calendar, LayoutDashboard, Settings } from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-slate-900 text-white p-4">
        <div className="mb-8 font-bold text-2xl">TeeOptimize AI</div>
        <nav className="space-y-2">
          <Link href="/dashboard" className="flex items-center space-x-2 p-2 hover:bg-slate-800 rounded">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          <Link href="/dashboard/inventory" className="flex items-center space-x-2 p-2 hover:bg-slate-800 rounded">
            <Calendar size={20} />
            <span>Inventory</span>
          </Link>
          <Link href="/dashboard/pricing" className="flex items-center space-x-2 p-2 hover:bg-slate-800 rounded">
            <Settings size={20} />
            <span>Pricing Rules</span>
          </Link>
          <Link href="/dashboard/settings" className="flex items-center space-x-2 p-2 hover:bg-slate-800 rounded">
            <Settings size={20} />
            <span>Settings</span>
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-8 bg-slate-50">
        {children}
      </main>
    </div>
  )
}
