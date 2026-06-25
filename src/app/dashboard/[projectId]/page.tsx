import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getProject } from '@/app/actions/projects'
import { getTestimonials } from '@/app/actions/testimonials'
import { TestimonialList } from '@/components/testimonials/testimonial-list'
import { Button } from '@/components/ui/button'
import { ExternalLink, Settings, Code, Copy } from 'lucide-react'

interface PageProps {
  params: Promise<{ projectId: string }>
  searchParams: Promise<{ status?: string }>
}

export default async function ProjectPage({ params, searchParams }: PageProps) {
  const { projectId } = await params
  const { status = 'all' } = await searchParams

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [project, testimonials] = await Promise.all([
    getProject(projectId),
    getTestimonials(projectId, status),
  ])

  if (!project) notFound()

  const pendingCount = testimonials.filter(t => t.status === 'pending').length
  const approvedCount = testimonials.filter(t => t.status === 'approved').length
  const collectUrl = `${process.env.NEXT_PUBLIC_APP_URL || ''}/collect/${project.slug}`

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900">{project.name}</h1>
            {project.description && (
              <p className="text-sm text-zinc-500 mt-1">{project.description}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/wall/${project.slug}`} target="_blank">
              <Button variant="outline" size="sm">
                <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                Wall を見る
              </Button>
            </Link>
            <Link href={`/dashboard/${project.id}/embed`}>
              <Button variant="outline" size="sm">
                <Code className="w-3.5 h-3.5 mr-1.5" />
                埋め込み
              </Button>
            </Link>
            <Link href={`/dashboard/${project.id}/settings`}>
              <Button variant="outline" size="sm">
                <Settings className="w-3.5 h-3.5 mr-1.5" />
                設定
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats + Collect URL */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-zinc-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-zinc-900">{approvedCount}</div>
            <div className="text-sm text-zinc-500 mt-0.5">承認済み</div>
          </div>
          <div className="bg-white border border-zinc-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-amber-600">{pendingCount}</div>
            <div className="text-sm text-zinc-500 mt-0.5">承認待ち</div>
          </div>
          <div className="bg-white border border-zinc-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-zinc-900">{testimonials.filter(t => t.is_featured).length}</div>
            <div className="text-sm text-zinc-500 mt-0.5">注目レビュー</div>
          </div>
        </div>

        {/* Collect URL */}
        <div className="bg-white border border-zinc-200 rounded-lg p-4 mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-700 mb-0.5">収集フォームURL</p>
            <p className="text-sm text-zinc-500">顧客にこのURLを送ってレビューを集めましょう</p>
          </div>
          <div className="flex items-center gap-2">
            <code className="text-xs bg-zinc-100 px-3 py-1.5 rounded-md text-zinc-700 font-mono max-w-xs truncate">
              {collectUrl}
            </code>
            <CopyButton text={collectUrl} />
            <Link href={collectUrl} target="_blank">
              <Button variant="outline" size="sm">
                <ExternalLink className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="mb-4">
          <div className="flex items-center gap-1">
            {[
              { value: 'all', label: 'すべて', count: testimonials.length },
              { value: 'pending', label: '承認待ち', count: pendingCount },
              { value: 'approved', label: '承認済み', count: approvedCount },
              { value: 'rejected', label: '却下', count: testimonials.filter(t => t.status === 'rejected').length },
            ].map((tab) => (
              <Link
                key={tab.value}
                href={`/dashboard/${projectId}?status=${tab.value}`}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
                  status === tab.value
                    ? 'bg-zinc-900 text-white'
                    : 'text-zinc-600 hover:bg-zinc-100'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    status === tab.value ? 'bg-zinc-700' : 'bg-zinc-100 text-zinc-500'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Testimonial list */}
        <TestimonialList
          testimonials={testimonials}
          projectId={project.id}
          filter={status as 'all' | 'pending' | 'approved' | 'rejected'}
        />
      </div>
    </div>
  )
}

function CopyButton({ text }: { text: string }) {
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(text)
      }}
      className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
    >
      <Copy className="w-3.5 h-3.5" />
    </button>
  )
}
