'use client'

import { useState } from 'react'
import { submitTestimonial } from '@/app/actions/testimonials'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Star } from 'lucide-react'

interface CollectFormProps {
  projectSlug: string
}

export function CollectForm({ projectSlug }: CollectFormProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [charCount, setCharCount] = useState(0)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    formData.set('slug', projectSlug)
    if (rating > 0) formData.set('rating', rating.toString())

    const result = await submitTestimonial(formData)

    if (result.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <Card className="shadow-none border-zinc-200">
        <CardContent className="pt-12 pb-12 text-center">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-zinc-900 mb-2">ありがとうございます！</h2>
          <p className="text-zinc-500 text-sm">
            レビューを受け取りました。内容を確認の上、公開いたします。
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-none border-zinc-200">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Rating */}
          <div className="space-y-2">
            <Label>評価</Label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-110"
                  aria-label={`${star}星`}
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      star <= (hoverRating || rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-zinc-200 text-zinc-200'
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 text-sm text-zinc-500">
                  {['', '不満', 'やや不満', '普通', '満足', '大変満足'][rating]}
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-1.5">
            <Label htmlFor="content">
              レビュー内容 <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="content"
              name="content"
              placeholder="あなたの体験を具体的に教えてください。導入前後の変化、特に印象に残ったこと、他のユーザーへのアドバイスなど..."
              rows={5}
              required
              maxLength={1000}
              onChange={(e) => setCharCount(e.target.value.length)}
              className="resize-none"
            />
            <p className="text-xs text-zinc-400 text-right">{charCount}/1000</p>
          </div>

          {/* Author info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="author_name">
                お名前 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="author_name"
                name="author_name"
                placeholder="山田 太郎"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="author_title">役職 <span className="text-zinc-400 font-normal">(任意)</span></Label>
              <Input
                id="author_title"
                name="author_title"
                placeholder="マーケティング部長"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="author_company">会社名 <span className="text-zinc-400 font-normal">(任意)</span></Label>
            <Input
              id="author_company"
              name="author_company"
              placeholder="株式会社〇〇"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">{error}</p>
          )}

          <Button
            type="submit"
            className="w-full bg-zinc-900 hover:bg-zinc-800"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                送信中...
              </span>
            ) : 'レビューを送信する'}
          </Button>

          <p className="text-xs text-zinc-400 text-center">
            送信内容は審査後に公開されます
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
