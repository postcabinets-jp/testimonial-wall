import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPublicTestimonials } from '@/app/actions/testimonials'
import { WallOfLove } from '@/components/testimonials/wall-of-love'
import type { ProjectSettings } from '@/types/database'

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ embed?: string; layout?: string }>
}

export default async function WallPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const { embed, layout } = await searchParams

  const data = await getPublicTestimonials(slug)
  if (!data) notFound()

  const { project, testimonials } = data
  const settings = (project.settings as ProjectSettings) || {}
  const currentLayout = (layout || settings.layout || 'masonry') as 'masonry' | 'carousel' | 'list'
  const isEmbed = embed === '1'

  return (
    <div className={isEmbed ? 'p-4' : 'min-h-screen bg-zinc-50 py-12 px-4'}>
      {!isEmbed && (
        <div className="max-w-5xl mx-auto text-center mb-10">
          <h1 className="text-3xl font-bold text-zinc-900 mb-3">
            {project.name} のレビュー
          </h1>
          <p className="text-zinc-500">
            {testimonials.length} 件のレビューが寄せられています
          </p>
        </div>
      )}

      <div className={isEmbed ? '' : 'max-w-5xl mx-auto'}>
        <WallOfLove
          testimonials={testimonials}
          layout={currentLayout}
          theme={settings.theme || 'light'}
        />
      </div>

      {!isEmbed && (
        <div className="text-center mt-12">
          <p className="text-xs text-zinc-400">
            Powered by{' '}
            <Link href="/" className="hover:text-zinc-600 underline">Testimonial Wall</Link>
            {' — '}
            <Link href={`/collect/${slug}`} className="hover:text-zinc-600 underline">
              あなたもレビューを書く
            </Link>
          </p>
        </div>
      )}
    </div>
  )
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const data = await getPublicTestimonials(slug)

  return {
    title: data ? `${data.project.name} — Wall of Love` : 'Wall of Love',
  }
}
