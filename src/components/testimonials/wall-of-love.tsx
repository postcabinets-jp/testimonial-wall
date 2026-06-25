'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Testimonial } from '@/types/database'

interface WallProps {
  testimonials: Testimonial[]
  layout: 'masonry' | 'carousel' | 'list'
  theme: 'light' | 'dark' | 'auto'
}

function StarRating({ rating }: { rating: number | null }) {
  if (!rating) return null
  return (
    <div className="flex items-center gap-0.5 mb-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i <= rating ? 'fill-amber-400 text-amber-400' : 'fill-zinc-200 text-zinc-200'}`}
        />
      ))}
    </div>
  )
}

function TestimonialCard({ t, dark }: { t: Testimonial; dark?: boolean }) {
  return (
    <div className={`rounded-xl p-5 border ${dark
      ? 'bg-zinc-800 border-zinc-700 text-white'
      : 'bg-white border-zinc-200 text-zinc-900'
    }`}>
      <StarRating rating={t.rating} />
      <p className={`text-sm leading-relaxed mb-4 ${dark ? 'text-zinc-300' : 'text-zinc-700'}`}>
        &ldquo;{t.content}&rdquo;
      </p>
      <div className="flex items-center gap-3">
        <Avatar className="w-9 h-9 flex-shrink-0">
          <AvatarImage src={t.author_avatar_url || undefined} />
          <AvatarFallback className={`text-xs font-medium ${dark ? 'bg-zinc-700 text-zinc-300' : 'bg-zinc-100 text-zinc-600'}`}>
            {t.author_name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className={`text-sm font-medium ${dark ? 'text-white' : 'text-zinc-900'}`}>{t.author_name}</p>
          {(t.author_title || t.author_company) && (
            <p className={`text-xs ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              {[t.author_title, t.author_company].filter(Boolean).join(' @ ')}
            </p>
          )}
        </div>
        {t.is_featured && (
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 ml-auto flex-shrink-0" />
        )}
      </div>
    </div>
  )
}

function MasonryLayout({ testimonials, dark }: { testimonials: Testimonial[]; dark?: boolean }) {
  if (testimonials.length === 0) {
    return (
      <div className="text-center py-16 text-zinc-400">
        <p className="text-sm">まだレビューがありません</p>
      </div>
    )
  }

  // Distribute into 3 columns
  const columns: Testimonial[][] = [[], [], []]
  testimonials.forEach((t, i) => {
    columns[i % 3].push(t)
  })

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {columns.map((col, ci) => (
        <div key={ci} className="space-y-4">
          {col.map((t) => (
            <TestimonialCard key={t.id} t={t} dark={dark} />
          ))}
        </div>
      ))}
    </div>
  )
}

function CarouselLayout({ testimonials, dark }: { testimonials: Testimonial[]; dark?: boolean }) {
  const [current, setCurrent] = useState(0)

  if (testimonials.length === 0) {
    return (
      <div className="text-center py-16 text-zinc-400">
        <p className="text-sm">まだレビューがありません</p>
      </div>
    )
  }

  function prev() {
    setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length)
  }

  function next() {
    setCurrent((c) => (c + 1) % testimonials.length)
  }

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {testimonials.map((t) => (
            <div key={t.id} className="w-full flex-shrink-0 px-4 max-w-2xl mx-auto">
              <TestimonialCard t={t} dark={dark} />
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 mt-6">
        <Button
          variant="outline"
          size="icon"
          onClick={prev}
          className="w-9 h-9"
          aria-label="前のレビュー"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <span className="text-sm text-zinc-500">
          {current + 1} / {testimonials.length}
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={next}
          className="w-9 h-9"
          aria-label="次のレビュー"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-1.5 mt-3">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-1.5 h-1.5 rounded-full transition-colors ${
              i === current ? 'bg-zinc-900' : 'bg-zinc-300'
            }`}
            aria-label={`レビュー ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

function ListLayout({ testimonials, dark }: { testimonials: Testimonial[]; dark?: boolean }) {
  if (testimonials.length === 0) {
    return (
      <div className="text-center py-16 text-zinc-400">
        <p className="text-sm">まだレビューがありません</p>
      </div>
    )
  }

  return (
    <div className="space-y-3 max-w-2xl mx-auto">
      {testimonials.map((t) => (
        <TestimonialCard key={t.id} t={t} dark={dark} />
      ))}
    </div>
  )
}

export function WallOfLove({ testimonials, layout, theme }: WallProps) {
  const dark = theme === 'dark'

  if (layout === 'carousel') {
    return <CarouselLayout testimonials={testimonials} dark={dark} />
  }

  if (layout === 'list') {
    return <ListLayout testimonials={testimonials} dark={dark} />
  }

  return <MasonryLayout testimonials={testimonials} dark={dark} />
}
