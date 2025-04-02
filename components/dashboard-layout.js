'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Bell,
  Settings,
  LogOut,
  GitBranch
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const router = useRouter()

  const handleLogout = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 bg-card shadow-lg w-64 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-in-out border-r border-border`}>
        <div className="h-16 flex items-center justify-center border-b border-border">
          <h1 className="text-xl font-bold text-primary">Gestion MRC</h1>
        </div>
        <nav className="mt-6 px-4">
          <Link href="/dashboard" className="flex items-center px-4 py-2 text-foreground hover:bg-accent rounded-lg">
            <LayoutDashboard className="h-5 w-5 mr-3" />
            Tableau de Bord
          </Link>
          <Link href="/patients" className="flex items-center px-4 py-2 mt-2 text-foreground hover:bg-accent rounded-lg">
            <Users className="h-5 w-5 mr-3" />
            Patients
          </Link>
          <Link href="/dossiers" className="flex items-center px-4 py-2 mt-2 text-foreground hover:bg-accent rounded-lg">
            <FileText className="h-5 w-5 mr-3" />
            Dossiers Médicaux
          </Link>
          <Link href="/workflows" className="flex items-center px-4 py-2 mt-2 text-foreground hover:bg-accent rounded-lg">
            <GitBranch className="h-5 w-5 mr-3" />
            Workflows
          </Link>
          <Link href="/notifications" className="flex items-center px-4 py-2 mt-2 text-foreground hover:bg-accent rounded-lg">
            <Bell className="h-5 w-5 mr-3" />
            Notifications
          </Link>
          <Link href="/parametres" className="flex items-center px-4 py-2 mt-2 text-foreground hover:bg-accent rounded-lg">
            <Settings className="h-5 w-5 mr-3" />
            Paramètres
          </Link>
          <Button 
            variant="ghost" 
            className="flex items-center px-4 py-2 mt-8 text-destructive hover:bg-destructive/10 rounded-lg w-full"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Déconnexion
          </Button>
        </nav>
      </aside>

      {/* Main content */}
      <main className={`${isSidebarOpen ? 'ml-64' : 'ml-0'} transition-margin duration-200 ease-in-out bg-background min-h-screen`}>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}