import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProfileSettingsForm } from '@/components/dashboard/profile-settings-form'
import type { Profile } from '@/types/database'

export default async function AccountSettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-zinc-900">アカウント設定</h1>
          <p className="text-sm text-zinc-500 mt-1">プロフィールとアカウントを管理します</p>
        </div>

        <ProfileSettingsForm profile={profile as Profile | null} userEmail={user.email || ''} />
      </div>
    </div>
  )
}
