import { z } from 'zod'

export const providerSchema = z.enum(['email', 'google'])
export const variantSchema = z.enum(['control', 'variant_a', 'variant_b'])

export const createUserSchema = z.object({
  email: z.string().trim().toLowerCase().email('Invalid email address'),
  name: z.string().trim().min(1, 'Name is required').max(80),
  provider: providerSchema,
  variant: variantSchema.optional(),
  source: z.string().trim().max(120).optional(),
})

export const updateUserSchema = z
  .object({
    name: z.string().trim().min(1).max(80).optional(),
    variant: variantSchema.optional(),
    source: z.string().trim().max(120).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided.',
  })

export const listQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).optional(),
  cursor: z.string().min(1).optional(),
})
