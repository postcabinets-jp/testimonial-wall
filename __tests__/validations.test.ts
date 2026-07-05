import { describe, it, expect } from 'vitest'
import {
  createProjectSchema,
  updateProjectSchema,
  projectSettingsSchema,
  testimonialStatusSchema,
  updateTestimonialTagsSchema,
  submitTestimonialSchema,
  idSchema,
} from '@/lib/validations'

// ---------------------------------------------------------------------------
// createProjectSchema
// ---------------------------------------------------------------------------
describe('createProjectSchema', () => {
  it('accepts valid input with name only', () => {
    const result = createProjectSchema.safeParse({ name: 'My Project' })
    expect(result.success).toBe(true)
  })

  it('accepts valid input with name and description', () => {
    const result = createProjectSchema.safeParse({
      name: 'My Project',
      description: 'A short description',
    })
    expect(result.success).toBe(true)
  })

  it('accepts null description', () => {
    const result = createProjectSchema.safeParse({
      name: 'Test',
      description: null,
    })
    expect(result.success).toBe(true)
  })

  it('accepts undefined description (optional)', () => {
    const result = createProjectSchema.safeParse({ name: 'Test' })
    expect(result.success).toBe(true)
  })

  it('rejects empty name', () => {
    const result = createProjectSchema.safeParse({ name: '' })
    expect(result.success).toBe(false)
  })

  it('rejects missing name', () => {
    const result = createProjectSchema.safeParse({})
    expect(result.success).toBe(false)
  })

  it('accepts name at max length (100 chars)', () => {
    const result = createProjectSchema.safeParse({ name: 'a'.repeat(100) })
    expect(result.success).toBe(true)
  })

  it('rejects name over 100 chars', () => {
    const result = createProjectSchema.safeParse({ name: 'a'.repeat(101) })
    expect(result.success).toBe(false)
  })

  it('accepts description at max length (500 chars)', () => {
    const result = createProjectSchema.safeParse({
      name: 'Test',
      description: 'x'.repeat(500),
    })
    expect(result.success).toBe(true)
  })

  it('rejects description over 500 chars', () => {
    const result = createProjectSchema.safeParse({
      name: 'Test',
      description: 'x'.repeat(501),
    })
    expect(result.success).toBe(false)
  })

  it('accepts single-char name (min boundary)', () => {
    const result = createProjectSchema.safeParse({ name: 'A' })
    expect(result.success).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// updateProjectSchema
// ---------------------------------------------------------------------------
describe('updateProjectSchema', () => {
  it('accepts empty object (all fields optional)', () => {
    const result = updateProjectSchema.safeParse({})
    expect(result.success).toBe(true)
  })

  it('accepts name only', () => {
    const result = updateProjectSchema.safeParse({ name: 'Updated' })
    expect(result.success).toBe(true)
  })

  it('accepts description only', () => {
    const result = updateProjectSchema.safeParse({ description: 'New desc' })
    expect(result.success).toBe(true)
  })

  it('accepts null description', () => {
    const result = updateProjectSchema.safeParse({ description: null })
    expect(result.success).toBe(true)
  })

  it('rejects empty name (min 1)', () => {
    const result = updateProjectSchema.safeParse({ name: '' })
    expect(result.success).toBe(false)
  })

  it('rejects name over 100 chars', () => {
    const result = updateProjectSchema.safeParse({ name: 'a'.repeat(101) })
    expect(result.success).toBe(false)
  })

  it('rejects description over 500 chars', () => {
    const result = updateProjectSchema.safeParse({
      description: 'x'.repeat(501),
    })
    expect(result.success).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// projectSettingsSchema
// ---------------------------------------------------------------------------
describe('projectSettingsSchema', () => {
  it('accepts empty object (all optional)', () => {
    const result = projectSettingsSchema.safeParse({})
    expect(result.success).toBe(true)
  })

  it('accepts all valid fields', () => {
    const result = projectSettingsSchema.safeParse({
      theme: 'dark',
      layout: 'masonry',
      showRating: true,
      showAvatar: false,
      showDate: true,
      showCompany: false,
      primaryColor: '#ff00aa',
      customCss: '.card { color: red; }',
    })
    expect(result.success).toBe(true)
  })

  // theme enum
  it.each(['light', 'dark', 'auto'] as const)('accepts theme="%s"', (theme) => {
    const result = projectSettingsSchema.safeParse({ theme })
    expect(result.success).toBe(true)
  })

  it('rejects invalid theme', () => {
    const result = projectSettingsSchema.safeParse({ theme: 'sepia' })
    expect(result.success).toBe(false)
  })

  // layout enum
  it.each(['grid', 'masonry', 'list', 'carousel'] as const)(
    'accepts layout="%s"',
    (layout) => {
      const result = projectSettingsSchema.safeParse({ layout })
      expect(result.success).toBe(true)
    },
  )

  it('rejects invalid layout', () => {
    const result = projectSettingsSchema.safeParse({ layout: 'table' })
    expect(result.success).toBe(false)
  })

  // primaryColor regex
  it('accepts valid hex color #aabbcc', () => {
    const result = projectSettingsSchema.safeParse({ primaryColor: '#aabbcc' })
    expect(result.success).toBe(true)
  })

  it('accepts uppercase hex color #AABBCC', () => {
    const result = projectSettingsSchema.safeParse({ primaryColor: '#AABBCC' })
    expect(result.success).toBe(true)
  })

  it('accepts mixed case hex color #aAbBcC', () => {
    const result = projectSettingsSchema.safeParse({ primaryColor: '#aAbBcC' })
    expect(result.success).toBe(true)
  })

  it('rejects short hex #abc', () => {
    const result = projectSettingsSchema.safeParse({ primaryColor: '#abc' })
    expect(result.success).toBe(false)
  })

  it('rejects hex without # prefix', () => {
    const result = projectSettingsSchema.safeParse({ primaryColor: 'aabbcc' })
    expect(result.success).toBe(false)
  })

  it('rejects 8-digit hex #aabbccdd', () => {
    const result = projectSettingsSchema.safeParse({ primaryColor: '#aabbccdd' })
    expect(result.success).toBe(false)
  })

  it('rejects non-hex chars #gghhii', () => {
    const result = projectSettingsSchema.safeParse({ primaryColor: '#gghhii' })
    expect(result.success).toBe(false)
  })

  // customCss max
  it('accepts customCss at 5000 chars', () => {
    const result = projectSettingsSchema.safeParse({
      customCss: 'x'.repeat(5000),
    })
    expect(result.success).toBe(true)
  })

  it('rejects customCss over 5000 chars', () => {
    const result = projectSettingsSchema.safeParse({
      customCss: 'x'.repeat(5001),
    })
    expect(result.success).toBe(false)
  })

  // passthrough: unknown keys preserved
  it('passes through unknown keys', () => {
    const result = projectSettingsSchema.safeParse({ unknownKey: 'value' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect((result.data as Record<string, unknown>).unknownKey).toBe('value')
    }
  })

  // boolean fields
  it('rejects non-boolean for showRating', () => {
    const result = projectSettingsSchema.safeParse({ showRating: 'yes' })
    expect(result.success).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// testimonialStatusSchema
// ---------------------------------------------------------------------------
describe('testimonialStatusSchema', () => {
  it.each(['approved', 'rejected', 'pending'] as const)(
    'accepts "%s"',
    (status) => {
      const result = testimonialStatusSchema.safeParse(status)
      expect(result.success).toBe(true)
    },
  )

  it('rejects invalid status', () => {
    const result = testimonialStatusSchema.safeParse('archived')
    expect(result.success).toBe(false)
  })

  it('rejects empty string', () => {
    const result = testimonialStatusSchema.safeParse('')
    expect(result.success).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// updateTestimonialTagsSchema
// ---------------------------------------------------------------------------
describe('updateTestimonialTagsSchema', () => {
  it('accepts empty tags array', () => {
    const result = updateTestimonialTagsSchema.safeParse({ tags: [] })
    expect(result.success).toBe(true)
  })

  it('accepts single tag', () => {
    const result = updateTestimonialTagsSchema.safeParse({ tags: ['good'] })
    expect(result.success).toBe(true)
  })

  it('accepts 20 tags (max)', () => {
    const tags = Array.from({ length: 20 }, (_, i) => `tag-${i}`)
    const result = updateTestimonialTagsSchema.safeParse({ tags })
    expect(result.success).toBe(true)
  })

  it('rejects 21 tags (over max)', () => {
    const tags = Array.from({ length: 21 }, (_, i) => `tag-${i}`)
    const result = updateTestimonialTagsSchema.safeParse({ tags })
    expect(result.success).toBe(false)
  })

  it('accepts tag at 50 chars (max)', () => {
    const result = updateTestimonialTagsSchema.safeParse({
      tags: ['a'.repeat(50)],
    })
    expect(result.success).toBe(true)
  })

  it('rejects tag over 50 chars', () => {
    const result = updateTestimonialTagsSchema.safeParse({
      tags: ['a'.repeat(51)],
    })
    expect(result.success).toBe(false)
  })

  it('rejects missing tags field', () => {
    const result = updateTestimonialTagsSchema.safeParse({})
    expect(result.success).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// submitTestimonialSchema
// ---------------------------------------------------------------------------
describe('submitTestimonialSchema', () => {
  const validInput = {
    slug: 'my-project',
    author_name: 'Taro',
    content: 'Great product!',
  }

  it('accepts minimal valid input', () => {
    const result = submitTestimonialSchema.safeParse(validInput)
    expect(result.success).toBe(true)
  })

  it('accepts full valid input with all optional fields', () => {
    const result = submitTestimonialSchema.safeParse({
      ...validInput,
      author_title: 'CEO',
      author_company: 'Acme Inc.',
      rating: 5,
    })
    expect(result.success).toBe(true)
  })

  it('accepts null optional fields', () => {
    const result = submitTestimonialSchema.safeParse({
      ...validInput,
      author_title: null,
      author_company: null,
      rating: null,
    })
    expect(result.success).toBe(true)
  })

  // slug
  it('rejects empty slug', () => {
    const result = submitTestimonialSchema.safeParse({
      ...validInput,
      slug: '',
    })
    expect(result.success).toBe(false)
  })

  it('rejects missing slug', () => {
    const { slug: _, ...noSlug } = validInput
    const result = submitTestimonialSchema.safeParse(noSlug)
    expect(result.success).toBe(false)
  })

  // author_name
  it('rejects empty author_name', () => {
    const result = submitTestimonialSchema.safeParse({
      ...validInput,
      author_name: '',
    })
    expect(result.success).toBe(false)
  })

  it('accepts author_name at 100 chars', () => {
    const result = submitTestimonialSchema.safeParse({
      ...validInput,
      author_name: 'a'.repeat(100),
    })
    expect(result.success).toBe(true)
  })

  it('rejects author_name over 100 chars', () => {
    const result = submitTestimonialSchema.safeParse({
      ...validInput,
      author_name: 'a'.repeat(101),
    })
    expect(result.success).toBe(false)
  })

  // author_title
  it('accepts author_title at 100 chars', () => {
    const result = submitTestimonialSchema.safeParse({
      ...validInput,
      author_title: 'x'.repeat(100),
    })
    expect(result.success).toBe(true)
  })

  it('rejects author_title over 100 chars', () => {
    const result = submitTestimonialSchema.safeParse({
      ...validInput,
      author_title: 'x'.repeat(101),
    })
    expect(result.success).toBe(false)
  })

  // author_company
  it('accepts author_company at 100 chars', () => {
    const result = submitTestimonialSchema.safeParse({
      ...validInput,
      author_company: 'x'.repeat(100),
    })
    expect(result.success).toBe(true)
  })

  it('rejects author_company over 100 chars', () => {
    const result = submitTestimonialSchema.safeParse({
      ...validInput,
      author_company: 'x'.repeat(101),
    })
    expect(result.success).toBe(false)
  })

  // content
  it('rejects empty content', () => {
    const result = submitTestimonialSchema.safeParse({
      ...validInput,
      content: '',
    })
    expect(result.success).toBe(false)
  })

  it('accepts content at 1000 chars', () => {
    const result = submitTestimonialSchema.safeParse({
      ...validInput,
      content: 'x'.repeat(1000),
    })
    expect(result.success).toBe(true)
  })

  it('rejects content over 1000 chars', () => {
    const result = submitTestimonialSchema.safeParse({
      ...validInput,
      content: 'x'.repeat(1001),
    })
    expect(result.success).toBe(false)
  })

  // rating (coerce + int + 1..5)
  it('accepts rating 1 (min boundary)', () => {
    const result = submitTestimonialSchema.safeParse({
      ...validInput,
      rating: 1,
    })
    expect(result.success).toBe(true)
  })

  it('accepts rating 5 (max boundary)', () => {
    const result = submitTestimonialSchema.safeParse({
      ...validInput,
      rating: 5,
    })
    expect(result.success).toBe(true)
  })

  it('rejects rating 0 (below min)', () => {
    const result = submitTestimonialSchema.safeParse({
      ...validInput,
      rating: 0,
    })
    expect(result.success).toBe(false)
  })

  it('rejects rating 6 (above max)', () => {
    const result = submitTestimonialSchema.safeParse({
      ...validInput,
      rating: 6,
    })
    expect(result.success).toBe(false)
  })

  it('rejects non-integer rating 3.5', () => {
    const result = submitTestimonialSchema.safeParse({
      ...validInput,
      rating: 3.5,
    })
    expect(result.success).toBe(false)
  })

  it('coerces string rating "4" to number', () => {
    const result = submitTestimonialSchema.safeParse({
      ...validInput,
      rating: '4',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.rating).toBe(4)
    }
  })

  it('rejects negative rating', () => {
    const result = submitTestimonialSchema.safeParse({
      ...validInput,
      rating: -1,
    })
    expect(result.success).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// idSchema
// ---------------------------------------------------------------------------
describe('idSchema', () => {
  it('accepts valid UUID v4', () => {
    const result = idSchema.safeParse('550e8400-e29b-41d4-a716-446655440000')
    expect(result.success).toBe(true)
  })

  it('accepts another valid UUID', () => {
    const result = idSchema.safeParse('123e4567-e89b-12d3-a456-426614174000')
    expect(result.success).toBe(true)
  })

  it('rejects empty string', () => {
    const result = idSchema.safeParse('')
    expect(result.success).toBe(false)
  })

  it('rejects plain string', () => {
    const result = idSchema.safeParse('not-a-uuid')
    expect(result.success).toBe(false)
  })

  it('rejects UUID without hyphens', () => {
    const result = idSchema.safeParse('550e8400e29b41d4a716446655440000')
    expect(result.success).toBe(false)
  })

  it('rejects UUID with extra chars', () => {
    const result = idSchema.safeParse('550e8400-e29b-41d4-a716-446655440000-extra')
    expect(result.success).toBe(false)
  })

  it('rejects number input', () => {
    const result = idSchema.safeParse(12345)
    expect(result.success).toBe(false)
  })

  it('rejects null', () => {
    const result = idSchema.safeParse(null)
    expect(result.success).toBe(false)
  })
})
