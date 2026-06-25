'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Project, ProjectSettings } from '@/types/database'

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50)
}

export async function createProject(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const name = formData.get('name') as string
  const description = formData.get('description') as string

  if (!name?.trim()) {
    return { error: 'プロジェクト名は必須です' }
  }

  const baseSlug = generateSlug(name)
  let slug = baseSlug
  let attempt = 0

  // Ensure slug uniqueness
  while (attempt < 10) {
    const { data: existing } = await supabase
      .from('projects')
      .select('id')
      .eq('slug', slug)
      .single()

    if (!existing) break

    attempt++
    slug = `${baseSlug}-${attempt}`
  }

  const { data, error } = await supabase
    .from('projects')
    .insert({
      user_id: user.id,
      name: name.trim(),
      slug,
      description: description?.trim() || null,
    })
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  redirect(`/dashboard/${data.id}`)
}

export async function updateProject(projectId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const name = formData.get('name') as string
  const description = formData.get('description') as string

  const { error } = await supabase
    .from('projects')
    .update({
      name: name?.trim(),
      description: description?.trim() || null,
    })
    .eq('id', projectId)
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  revalidatePath(`/dashboard/${projectId}`)
  revalidatePath(`/dashboard/${projectId}/settings`)
  return { success: true }
}

export async function updateProjectSettings(projectId: string, settings: Partial<ProjectSettings>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Get current settings
  const { data: project } = await supabase
    .from('projects')
    .select('settings')
    .eq('id', projectId)
    .eq('user_id', user.id)
    .single()

  if (!project) return { error: 'プロジェクトが見つかりません' }

  const currentSettings = (project.settings as ProjectSettings) || {}
  const newSettings = { ...currentSettings, ...settings }

  const { error } = await supabase
    .from('projects')
    .update({ settings: newSettings })
    .eq('id', projectId)
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  revalidatePath(`/dashboard/${projectId}/settings`)
  return { success: true }
}

export async function deleteProject(projectId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId)
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  redirect('/dashboard')
}

export async function getProjects(): Promise<(Project & { testimonials: { count: number }[] })[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  const { data } = await supabase
    .from('projects')
    .select('*, testimonials(count)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return data || []
}

export async function getProject(projectId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .eq('user_id', user.id)
    .single()

  return data
}
