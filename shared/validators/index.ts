import { z } from 'zod'

// ── Auth ─────────────────────────────────────────────────────────────────────

export const registerSchema = z.object({
  name:     z.string().min(2, 'Name must be at least 2 characters'),
  email:    z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  company:  z.string().optional(),
})

export const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
})

export const resetPasswordSchema = z.object({
  token:    z.string().min(1),
  password: z.string().min(8),
})

// ── User preferences ─────────────────────────────────────────────────────────

export const preferencesSchema = z.object({
  currencies:  z.array(z.string()).optional(),
  topics:      z.array(z.string()).optional(),
  interests:   z.array(z.string()).optional(),
  feedLayout:  z.object({
    liveRates:   z.boolean(),
    marketNews:  z.boolean(),
    newsletters: z.boolean(),
    rssFeed:     z.boolean(),
    hedgingDocs: z.boolean(),
    products:    z.boolean(),
  }).optional(),
  notifications: z.object({
    email:     z.boolean(),
    frequency: z.enum(['daily', 'weekly', 'monthly']),
  }).optional(),
})

// ── Lead capture ──────────────────────────────────────────────────────────────

export const leadSchema = z.object({
  name:        z.string().min(1),
  email:       z.string().email(),
  company:     z.string().optional(),
  source:      z.string(),
  requestType: z.string().optional(),
  notes:       z.string().optional(),
})

// ── Inferred types ────────────────────────────────────────────────────────────

export type RegisterInput      = z.infer<typeof registerSchema>
export type LoginInput         = z.infer<typeof loginSchema>
export type PreferencesInput   = z.infer<typeof preferencesSchema>
export type LeadInput          = z.infer<typeof leadSchema>
