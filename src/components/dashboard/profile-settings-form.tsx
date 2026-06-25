'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import type { Profile } from '@/types/database'

interface Props {
  profile: Profile | null
  userEmail: string
}

export function ProfileSettingsForm({ profile, userEmail }: Props) {
  const router = useRouter()
  const supabase = createClient()

  const [displayName, setDisplayName] = useState(profile?.display_name || '')
  const [companyName, setCompanyName] = useState(profile?.company_name || '')
  const [websiteUrl, setWebsiteUrl] = useState(profile?.website_url || '')
  const [saving, setSaving] = useState(false)

  const [newPassword, setNewPassword] = useState('')
  const [passwordSaving, setPasswordSaving] = useState(false)

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    const { error } = await supabase
      .from('profiles')
      .update({
        display_name: displayName,
        company_name: companyName || null,
        website_url: websiteUrl || null,
      })
      .eq('id', profile?.id || '')

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('プロフィールを保存しました')
      router.refresh()
    }
    setSaving(false)
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault()
    setPasswordSaving(true)

    const { error } = await supabase.auth.updateUser({ password: newPassword })

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('パスワードを変更しました')
      setNewPassword('')
    }
    setPasswordSaving(false)
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-none border-zinc-200">
        <CardHeader>
          <CardTitle className="text-base">プロフィール</CardTitle>
          <CardDescription>公開プロフィール情報を管理します</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileSave} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">メールアドレス</Label>
              <Input id="email" value={userEmail} disabled className="bg-zinc-50 text-zinc-500" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="display-name">表示名</Label>
              <Input
                id="display-name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="山田 太郎"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="company">会社名</Label>
              <Input
                id="company"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="株式会社〇〇"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="website">ウェブサイト</Label>
              <Input
                id="website"
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://example.com"
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" className="bg-zinc-900 hover:bg-zinc-800" disabled={saving}>
                {saving ? '保存中...' : '保存する'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="shadow-none border-zinc-200">
        <CardHeader>
          <CardTitle className="text-base">パスワード変更</CardTitle>
          <CardDescription>新しいパスワードを設定します</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="new-password">新しいパスワード</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="8文字以上"
                minLength={8}
                required
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" className="bg-zinc-900 hover:bg-zinc-800" disabled={passwordSaving}>
                {passwordSaving ? '変更中...' : 'パスワードを変更'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
