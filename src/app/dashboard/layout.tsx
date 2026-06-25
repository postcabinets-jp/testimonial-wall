import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getProjects } from '@/app/actions/projects'
import { Sidebar } from '@/components/dashboard/sidebar'
import { Toaster } from '@/components/ui/sonner'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const projects = await getProjects()

  return (
    <div className="min-h-screen bg-zinc-50">
      <Sidebar projects={projects} />
      <main className="ml-56 min-h-screen">
        {children}
      </main>
      <Toaster />
    </div>
  )
}
