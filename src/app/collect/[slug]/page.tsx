import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { CollectForm } from '@/components/testimonials/collect-form'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function CollectPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: project } = await supabase
    .from('projects')
    .select('id, name, description, slug, settings')
    .eq('slug', slug)
    .single()

  if (!project) notFound()

  return (
    <div className="min-h-screen bg-zinc-50 py-12 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-zinc-900 flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-lg font-bold">T</span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 mb-2">
            {project.name} のレビューを書く
          </h1>
          <p className="text-zinc-500">
            {project.description || 'あなたの体験をシェアしてください。数分で完了します。'}
          </p>
        </div>

        <CollectForm projectSlug={slug} />

        <p className="text-center text-xs text-zinc-400 mt-6">
          Powered by{' '}
          <Link href="/" className="hover:text-zinc-600 underline">Testimonial Wall</Link>
        </p>
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: project } = await supabase
    .from('projects')
    .select('name')
    .eq('slug', slug)
    .single()

  return {
    title: project ? `${project.name} のレビューを書く` : 'レビューフォーム',
  }
}
