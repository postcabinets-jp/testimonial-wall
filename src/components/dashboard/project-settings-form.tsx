'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { updateProject, deleteProject, updateProjectSettings } from '@/app/actions/projects'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
import type { Project, ProjectSettings } from '@/types/database'

interface Props {
  project: Project
}

export function ProjectSettingsForm({ project }: Props) {
  const router = useRouter()
  const settings = (project.settings as ProjectSettings) || {}

  const [name, setName] = useState(project.name)
  const [description, setDescription] = useState(project.description || '')
  const [layout, setLayout] = useState(settings.layout || 'masonry')
  const [theme, setTheme] = useState(settings.theme || 'light')
  const [saving, setSaving] = useState(false)
  const [settingsSaving, setSettingsSaving] = useState(false)

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    const formData = new FormData()
    formData.set('name', name)
    formData.set('description', description)

    const result = await updateProject(project.id, formData)
    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success('保存しました')
      router.refresh()
    }
    setSaving(false)
  }

  async function handleSettingsSave() {
    setSettingsSaving(true)
    const result = await updateProjectSettings(project.id, { layout: layout as ProjectSettings['layout'], theme: theme as ProjectSettings['theme'] })
    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success('ウィジェット設定を保存しました')
      router.refresh()
    }
    setSettingsSaving(false)
  }

  async function handleDelete() {
    await deleteProject(project.id)
  }

  return (
    <div className="space-y-6">
      {/* Basic info */}
      <Card className="shadow-none border-zinc-200">
        <CardHeader>
          <CardTitle className="text-base">基本情報</CardTitle>
          <CardDescription>プロジェクトの名前と説明を変更します</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">プロジェクト名</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="description">説明</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>
            <div className="space-y-1.5">
              <Label>スラッグ（変更不可）</Label>
              <Input value={project.slug} disabled className="bg-zinc-50 text-zinc-500 font-mono text-sm" />
              <p className="text-xs text-zinc-400">
                収集URL: /collect/{project.slug} / Wall URL: /wall/{project.slug}
              </p>
            </div>
            <div className="flex justify-end">
              <Button type="submit" className="bg-zinc-900 hover:bg-zinc-800" disabled={saving}>
                {saving ? '保存中...' : '保存する'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Widget settings */}
      <Card className="shadow-none border-zinc-200">
        <CardHeader>
          <CardTitle className="text-base">ウィジェット設定</CardTitle>
          <CardDescription>Wall of Love の表示設定をカスタマイズします</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>レイアウト</Label>
            <Select value={layout} onValueChange={(v) => v && setLayout(v as typeof layout)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="masonry">Masonry Grid（おすすめ）</SelectItem>
                <SelectItem value="carousel">カルーセル</SelectItem>
                <SelectItem value="list">リスト</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>テーマ</Label>
            <Select value={theme} onValueChange={(v) => v && setTheme(v as typeof theme)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">ライト</SelectItem>
                <SelectItem value="dark">ダーク</SelectItem>
                <SelectItem value="auto">システム設定に従う</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleSettingsSave}
              className="bg-zinc-900 hover:bg-zinc-800"
              disabled={settingsSaving}
            >
              {settingsSaving ? '保存中...' : 'ウィジェット設定を保存'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger zone */}
      <Card className="shadow-none border-red-200">
        <CardHeader>
          <CardTitle className="text-base text-red-700">危険な操作</CardTitle>
          <CardDescription>この操作は取り消せません</CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger>
              <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                プロジェクトを削除する
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>プロジェクトを削除しますか？</AlertDialogTitle>
                <AlertDialogDescription>
                  「{project.name}」とすべてのテスティモニアルが永久に削除されます。この操作は取り消せません。
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>キャンセル</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-600 hover:bg-red-700"
                  onClick={handleDelete}
                >
                  削除する
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  )
}
