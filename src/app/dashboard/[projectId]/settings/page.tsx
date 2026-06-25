import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getProject } from '@/app/actions/projects'
import { ProjectSettingsForm } from '@/components/dashboard/project-settings-form'

interface PageProps {
  params: Promise<{ projectId: string }>
}

export default async function ProjectSettingsPage({ params }: PageProps) {
  const { projectId } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const project = await getProject(projectId)
  if (!project) notFound()

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-zinc-900">プロジェクト設定</h1>
          <p className="text-sm text-zinc-500 mt-1">{project.name} の設定を管理します</p>
        </div>

        <ProjectSettingsForm project={project} />
      </div>
    </div>
  )
}
