'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { updateTestimonialStatus, toggleFeatured, deleteTestimonial } from '@/app/actions/testimonials'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Check, X, Star, Trash2, MessageSquare } from 'lucide-react'
import type { Testimonial } from '@/types/database'

interface TestimonialListProps {
  testimonials: Testimonial[]
  projectId: string
  filter: 'all' | 'pending' | 'approved' | 'rejected'
}

function StarRating({ rating }: { rating: number | null }) {
  if (!rating) return null
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i <= rating ? 'fill-amber-400 text-amber-400' : 'fill-zinc-200 text-zinc-200'}`}
        />
      ))}
    </div>
  )
}

function StatusBadge({ status }: { status: Testimonial['status'] }) {
  const config = {
    pending: { label: '承認待ち', className: 'bg-amber-100 text-amber-700 border-amber-200' },
    approved: { label: '承認済み', className: 'bg-green-100 text-green-700 border-green-200' },
    rejected: { label: '却下', className: 'bg-red-100 text-red-700 border-red-200' },
  }
  const { label, className } = config[status]
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${className}`}>
      {label}
    </span>
  )
}

export function TestimonialList({ testimonials, projectId, filter }: TestimonialListProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const filtered = filter === 'all' ? testimonials : testimonials.filter(t => t.status === filter)

  async function handleStatusChange(id: string, status: 'approved' | 'rejected' | 'pending') {
    setLoadingId(id)
    const result = await updateTestimonialStatus(id, status, projectId)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(status === 'approved' ? '承認しました' : status === 'rejected' ? '却下しました' : '保留中に戻しました')
    }
    setLoadingId(null)
  }

  async function handleToggleFeatured(id: string, current: boolean) {
    setLoadingId(id)
    const result = await toggleFeatured(id, projectId, !current)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(current ? '注目解除しました' : '注目に設定しました')
    }
    setLoadingId(null)
  }

  async function handleDelete(id: string) {
    const result = await deleteTestimonial(id, projectId)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('削除しました')
    }
  }

  if (filtered.length === 0) {
    return (
      <div className="bg-white border border-zinc-200 rounded-lg p-12 text-center">
        <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center mx-auto mb-3">
          <MessageSquare className="w-5 h-5 text-zinc-400" />
        </div>
        <p className="text-sm text-zinc-500">
          {filter === 'pending' ? '承認待ちのレビューはありません' :
           filter === 'approved' ? '承認済みのレビューはありません' :
           filter === 'rejected' ? '却下されたレビューはありません' :
           'レビューがまだありません。収集フォームURLを顧客に共有しましょう。'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {filtered.map((t) => (
        <div key={t.id} className="bg-white border border-zinc-200 rounded-lg p-5 hover:border-zinc-300 transition-colors">
          <div className="flex items-start gap-4">
            <Avatar className="w-10 h-10 flex-shrink-0">
              <AvatarImage src={t.author_avatar_url || undefined} />
              <AvatarFallback className="bg-zinc-100 text-zinc-600 text-sm font-medium">
                {t.author_name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm text-zinc-900">{t.author_name}</span>
                    {(t.author_title || t.author_company) && (
                      <span className="text-xs text-zinc-500">
                        {[t.author_title, t.author_company].filter(Boolean).join(' @ ')}
                      </span>
                    )}
                    <StatusBadge status={t.status} />
                    {t.is_featured && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200 font-medium">
                        注目
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <StarRating rating={t.rating} />
                    <span className="text-xs text-zinc-400">
                      {new Date(t.submitted_at).toLocaleDateString('ja-JP')}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-zinc-700 leading-relaxed mb-3">{t.content}</p>

              {t.tags && t.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {t.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs bg-zinc-100 text-zinc-600">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2">
                {t.status !== 'approved' && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs text-green-700 border-green-200 hover:bg-green-50"
                    onClick={() => handleStatusChange(t.id, 'approved')}
                    disabled={loadingId === t.id}
                  >
                    <Check className="w-3 h-3 mr-1" />
                    承認
                  </Button>
                )}
                {t.status !== 'rejected' && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs text-red-700 border-red-200 hover:bg-red-50"
                    onClick={() => handleStatusChange(t.id, 'rejected')}
                    disabled={loadingId === t.id}
                  >
                    <X className="w-3 h-3 mr-1" />
                    却下
                  </Button>
                )}
                {t.status === 'approved' && (
                  <Button
                    size="sm"
                    variant="outline"
                    className={`h-7 text-xs ${t.is_featured ? 'text-amber-700 border-amber-200 bg-amber-50' : 'text-zinc-600'}`}
                    onClick={() => handleToggleFeatured(t.id, t.is_featured)}
                    disabled={loadingId === t.id}
                  >
                    <Star className={`w-3 h-3 mr-1 ${t.is_featured ? 'fill-amber-400' : ''}`} />
                    {t.is_featured ? '注目解除' : '注目'}
                  </Button>
                )}
                <AlertDialog>
                  <AlertDialogTrigger>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-xs text-zinc-400 hover:text-red-600 hover:bg-red-50 ml-auto"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>レビューを削除しますか？</AlertDialogTitle>
                      <AlertDialogDescription>
                        この操作は取り消せません。{t.author_name} のレビューが完全に削除されます。
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>キャンセル</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-600 hover:bg-red-700"
                        onClick={() => handleDelete(t.id)}
                      >
                        削除する
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
