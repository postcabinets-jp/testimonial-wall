'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { testimonialStatusSchema, updateTestimonialTagsSchema, submitTestimonialSchema, idSchema } from '@/lib/validations'

export async function updateTestimonialStatus(
  testimonialId: string,
  status: 'approved' | 'rejected' | 'pending',
  projectId: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: '認証が必要です' }

  const idResult = idSchema.safeParse(testimonialId)
  const pidResult = idSchema.safeParse(projectId)
  if (!idResult.success || !pidResult.success) return { error: '無効なIDです' }

  const statusResult = testimonialStatusSchema.safeParse(status)
  if (!statusResult.success) return { error: '無効なステータスです' }

  // Verify ownership via project
  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('id', projectId)
    .eq('user_id', user.id)
    .single()

  if (!project) return { error: 'プロジェクトが見つかりません' }

  const { error } = await supabase
    .from('testimonials')
    .update({ status })
    .eq('id', testimonialId)
    .eq('project_id', projectId)

  if (error) return { error: error.message }

  revalidatePath(`/dashboard/${projectId}`)
  return { success: true }
}

export async function toggleFeatured(testimonialId: string, projectId: string, isFeatured: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: '認証が必要です' }

  const idResult = idSchema.safeParse(testimonialId)
  const pidResult = idSchema.safeParse(projectId)
  if (!idResult.success || !pidResult.success) return { error: '無効なIDです' }

  const { error } = await supabase
    .from('testimonials')
    .update({ is_featured: isFeatured })
    .eq('id', testimonialId)
    .eq('project_id', projectId)

  if (error) return { error: error.message }

  revalidatePath(`/dashboard/${projectId}`)
  return { success: true }
}

export async function updateTestimonialTags(
  testimonialId: string,
  projectId: string,
  tags: string[]
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: '認証が必要です' }

  const idResult = idSchema.safeParse(testimonialId)
  const pidResult = idSchema.safeParse(projectId)
  if (!idResult.success || !pidResult.success) return { error: '無効なIDです' }

  const tagsResult = updateTestimonialTagsSchema.safeParse({ tags })
  if (!tagsResult.success) return { error: tagsResult.error.issues[0]?.message ?? 'タグの値が不正です' }

  const { error } = await supabase
    .from('testimonials')
    .update({ tags })
    .eq('id', testimonialId)
    .eq('project_id', projectId)

  if (error) return { error: error.message }

  revalidatePath(`/dashboard/${projectId}`)
  return { success: true }
}

export async function deleteTestimonial(testimonialId: string, projectId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: '認証が必要です' }

  const idResult = idSchema.safeParse(testimonialId)
  const pidResult = idSchema.safeParse(projectId)
  if (!idResult.success || !pidResult.success) return { error: '無効なIDです' }

  const { error } = await supabase
    .from('testimonials')
    .delete()
    .eq('id', testimonialId)
    .eq('project_id', projectId)

  if (error) return { error: error.message }

  revalidatePath(`/dashboard/${projectId}`)
  return { success: true }
}

export async function getTestimonials(projectId: string, status?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  let query = supabase
    .from('testimonials')
    .select('*')
    .eq('project_id', projectId)
    .order('submitted_at', { ascending: false })

  if (status && status !== 'all') {
    query = query.eq('status', status as 'pending' | 'approved' | 'rejected')
  }

  const { data } = await query
  return data || []
}

// Public submit (no auth required - adds to pending)
export async function submitTestimonial(formData: FormData) {
  const supabase = await createClient()

  const parsed = submitTestimonialSchema.safeParse({
    slug: formData.get('slug'),
    author_name: formData.get('author_name'),
    author_title: formData.get('author_title'),
    author_company: formData.get('author_company'),
    content: formData.get('content'),
    rating: formData.get('rating') || undefined,
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'バリデーションエラー' }
  }

  const { slug, author_name: authorName, author_title: authorTitle, author_company: authorCompany, content, rating } = parsed.data

  // Find project by slug
  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('slug', slug)
    .single()

  if (!project) return { error: 'プロジェクトが見つかりません' }

  const { error } = await supabase
    .from('testimonials')
    .insert({
      project_id: project.id,
      author_name: authorName.trim(),
      author_title: authorTitle?.trim() ?? null,
      author_company: authorCompany?.trim() ?? null,
      content: content.trim(),
      rating: rating ?? null,
      status: 'pending',
    })

  if (error) return { error: error.message }

  return { success: true }
}

// Public: get approved testimonials for wall
export async function getPublicTestimonials(slug: string) {
  const supabase = await createClient()

  const { data: project } = await supabase
    .from('projects')
    .select('id, name, settings')
    .eq('slug', slug)
    .single()

  if (!project) return null

  const { data: testimonials } = await supabase
    .from('testimonials')
    .select('*')
    .eq('project_id', project.id)
    .eq('status', 'approved')
    .order('submitted_at', { ascending: false })

  return { project, testimonials: testimonials || [] }
}
