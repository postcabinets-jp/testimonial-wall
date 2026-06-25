import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getProject } from '@/app/actions/projects'
import { EmbedCodeGenerator } from '@/components/dashboard/embed-code-generator'

interface PageProps {
  params: Promise<{ projectId: string }>
}

export default async function EmbedPage({ params }: PageProps) {
  const { projectId } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const project = await getProject(projectId)
  if (!project) notFound()

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-zinc-900">埋め込みコード</h1>
          <p className="text-sm text-zinc-500 mt-1">
            このコードをコピーして、あなたのサイトに貼り付けてください
          </p>
        </div>

        <EmbedCodeGenerator project={project} />
      </div>
    </div>
  )
}
