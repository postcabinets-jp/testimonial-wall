'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { LayoutDashboard, LogOut, Settings, ChevronRight } from 'lucide-react'
import type { Project } from '@/types/database'

interface SidebarProps {
  projects: Project[]
  currentProjectId?: string
}

export function Sidebar({ projects, currentProjectId }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="fixed inset-y-0 left-0 w-56 bg-white border-r border-zinc-200 flex flex-col z-10">
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b border-zinc-200">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-zinc-900 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">T</span>
          </div>
          <span className="font-semibold text-zinc-900 text-sm">Testimonial Wall</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        <Link
          href="/dashboard"
          className={cn(
            'flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors',
            pathname === '/dashboard'
              ? 'bg-zinc-100 text-zinc-900 font-medium'
              : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
          )}
        >
          <LayoutDashboard className="w-4 h-4" />
          ダッシュボード
        </Link>

        {/* Projects */}
        {projects.length > 0 && (
          <div className="mt-4">
            <p className="px-2.5 text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1">
              プロジェクト
            </p>
            <div className="space-y-0.5">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/dashboard/${project.id}`}
                  className={cn(
                    'flex items-center justify-between px-2.5 py-2 rounded-md text-sm transition-colors group',
                    currentProjectId === project.id
                      ? 'bg-zinc-100 text-zinc-900 font-medium'
                      : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                  )}
                >
                  <span className="truncate">{project.name}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-400 opacity-0 group-hover:opacity-100 flex-shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="border-t border-zinc-200 p-2">
        <Link
          href="/dashboard/settings"
          className={cn(
            'flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors',
            pathname === '/dashboard/settings'
              ? 'bg-zinc-100 text-zinc-900 font-medium'
              : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
          )}
        >
          <Settings className="w-4 h-4" />
          設定
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          ログアウト
        </button>
      </div>
    </aside>
  )
}
