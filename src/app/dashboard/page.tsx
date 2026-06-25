import Link from 'next/link'
import { getProjects } from '@/app/actions/projects'
import { CreateProjectDialog } from '@/components/dashboard/create-project-dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, Plus, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function DashboardPage() {
  const projects = await getProjects()

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900">ダッシュボード</h1>
            <p className="text-sm text-zinc-500 mt-1">プロジェクトを管理してテスティモニアルを収集しましょう</p>
          </div>
          <CreateProjectDialog />
        </div>

        {projects.length === 0 ? (
          <div className="border-2 border-dashed border-zinc-200 rounded-xl p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-6 h-6 text-zinc-400" />
            </div>
            <h3 className="text-base font-medium text-zinc-900 mb-1">プロジェクトがありません</h3>
            <p className="text-sm text-zinc-500 mb-6">
              最初のプロジェクトを作成して、顧客のレビューを収集し始めましょう
            </p>
            <CreateProjectDialog trigger={
              <Button className="bg-zinc-900 hover:bg-zinc-800">
                <Plus className="w-4 h-4 mr-2" />
                プロジェクトを作成
              </Button>
            } />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => {
              const count = (project as { testimonials: { count: number }[] }).testimonials?.[0]?.count || 0
              return (
                <Link key={project.id} href={`/dashboard/${project.id}`}>
                  <Card className="h-full hover:border-zinc-300 hover:shadow-sm transition-all cursor-pointer border-zinc-200 shadow-none">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base font-medium text-zinc-900">{project.name}</CardTitle>
                        <ArrowRight className="w-4 h-4 text-zinc-400 flex-shrink-0 mt-0.5" />
                      </div>
                      {project.description && (
                        <CardDescription className="text-sm text-zinc-500 line-clamp-2">
                          {project.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="bg-zinc-100 text-zinc-700 font-normal">
                          <MessageSquare className="w-3 h-3 mr-1" />
                          {count} 件のレビュー
                        </Badge>
                        <span className="text-xs text-zinc-400">
                          /{project.slug}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}

            {/* Add new project card */}
            <CreateProjectDialog trigger={
              <div className="border-2 border-dashed border-zinc-200 rounded-lg p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-zinc-300 hover:bg-zinc-50 transition-all min-h-[140px]">
                <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center">
                  <Plus className="w-4 h-4 text-zinc-500" />
                </div>
                <span className="text-sm text-zinc-500">新しいプロジェクト</span>
              </div>
            } />
          </div>
        )}
      </div>
    </div>
  )
}
