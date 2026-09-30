import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileText,
  LogOut,
} from 'lucide-react'

type ViewType = 'dashboard' | 'scholars' | 'programs' | 'submissions' | 'compliance'

interface NavigationProps {
  currentView: ViewType
  onViewChange: (view: ViewType) => void
}

export function Navigation({ currentView, onViewChange }: NavigationProps) {
  const navItems = [
    { id: 'dashboard' as ViewType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'scholars' as ViewType, label: 'Scholars', icon: Users },
    { id: 'programs' as ViewType, label: 'Scholarship Programs', icon: BookOpen },
    { id: 'submissions' as ViewType, label: 'Grade Submissions', icon: FileText },
  ]

  return (
    <nav className="border-b bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">SM</span>
            </div>
            <h1 className="text-xl font-bold">Scholarship Monitor</h1>
          </div>
          <div className="flex gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === item.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              )
            })}
          </div>
          <button className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  )
}
