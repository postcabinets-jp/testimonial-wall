'use client'

import { useState, useRef } from 'react'
import { createProject } from '@/app/actions/projects'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus } from 'lucide-react'

interface CreateProjectDialogProps {
  trigger?: React.ReactNode
}

export function CreateProjectDialog({ trigger }: CreateProjectDialogProps) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formRef.current) return

    setLoading(true)
    setError('')

    const formData = new FormData(formRef.current)
    const result = await createProject(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
    // On success, createProject redirects
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        {trigger || (
          <Button className="bg-zinc-900 hover:bg-zinc-800">
            <Plus className="w-4 h-4 mr-2" />
            プロジェクトを作成
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>新しいプロジェクト</DialogTitle>
          <DialogDescription>
            プロジェクトを作成してテスティモニアルの収集を開始します
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="project-name">プロジェクト名 <span className="text-red-500">*</span></Label>
            <Input
              id="project-name"
              name="name"
              placeholder="My SaaS Product"
              required
              autoFocus
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="project-desc">説明 <span className="text-zinc-400 font-normal">(任意)</span></Label>
            <Textarea
              id="project-desc"
              name="description"
              placeholder="このプロジェクトについて..."
              rows={3}
              className="resize-none"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">{error}</p>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              キャンセル
            </Button>
            <Button type="submit" className="bg-zinc-900 hover:bg-zinc-800" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  作成中...
                </span>
              ) : '作成する'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
