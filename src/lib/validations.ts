import { z } from 'zod'

export const createProjectSchema = z.object({
  name: z.string().min(1, 'プロジェクト名は必須です').max(100, 'プロジェクト名は100文字以内'),
  description: z.string().max(500, '説明は500文字以内').optional().nullable(),
})

export const updateProjectSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional().nullable(),
})

export const projectSettingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).optional(),
  layout: z.enum(['grid', 'masonry', 'list', 'carousel']).optional(),
  showRating: z.boolean().optional(),
  showAvatar: z.boolean().optional(),
  showDate: z.boolean().optional(),
  showCompany: z.boolean().optional(),
  primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, '有効なカラーコードを入力してください').optional(),
  customCss: z.string().max(5000).optional(),
}).passthrough()

export const testimonialStatusSchema = z.enum(['approved', 'rejected', 'pending'])

export const updateTestimonialTagsSchema = z.object({
  tags: z.array(z.string().max(50)).max(20, 'タグは20個以内'),
})

export const submitTestimonialSchema = z.object({
  slug: z.string().min(1),
  author_name: z.string().min(1, '名前は必須です').max(100),
  author_title: z.string().max(100).optional().nullable(),
  author_company: z.string().max(100).optional().nullable(),
  content: z.string().min(1, 'レビュー内容は必須です').max(1000, 'レビューは1000文字以内'),
  rating: z.coerce.number().int().min(1).max(5).optional().nullable(),
})

export const idSchema = z.string().uuid('無効なIDです')
