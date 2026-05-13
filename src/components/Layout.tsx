import { Outlet, Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, BookOpen, FileQuestion, Calendar, StickyNote, Settings, Menu, X, GraduationCap } from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/workspace', icon: BookOpen, label: 'Workspace' },
  { path: '/practice', icon: FileQuestion, label: 'MCQ Practice' },
  { path: '/planner', icon: Calendar, label: 'Study Planner' },
  { path: '/notebook', icon: StickyNote, label: 'Notebook' },
  { path: '/admin', icon: Settings, label: 'Admin' },
]

export default function Layout() {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [exam] = useState({ name: 'GATE', branch: 'Computer Science', semester: '5' })

  return (
    <div className="min-h-screen bg-surface-secondary flex">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-border transform transition-transform duration-200 lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center gap-3 px-6 border-b border-border">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-text-primary">ExamPrep AI</span>
          <button className="lg:hidden ml-auto" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? 'bg-accent text-white'
                  : 'text-text-secondary hover:bg-surface-tertiary'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-6">
          <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
          <div className="hidden lg:flex items-center gap-4 text-sm">
            <span className="px-3 py-1 rounded-full bg-accent-light text-accent font-medium">{exam.name} 2026</span>
            <span className="text-text-muted">{exam.branch}</span>
            <span className="text-text-muted">Sem {exam.semester}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-surface-tertiary flex items-center justify-center text-sm font-medium">
              AK
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}