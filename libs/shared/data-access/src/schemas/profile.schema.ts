import { z } from 'zod';

export const CreateProfileSchema = z.object({
  displayName: z.string().min(1, 'Display name is required').max(100),
  headline: z.string().max(200).optional(),
  bio: z.string().optional(),
  avatarUrl: z.string().url('Invalid URL').nullable().optional(),
  location: z.string().nullable().optional(),
  isPublic: z.boolean().optional(),
});

export const UpdateProfileSchema = CreateProfileSchema.partial();

export type CreateProfileDto = z.infer<typeof CreateProfileSchema>;
export type UpdateProfileDto = z.infer<typeof UpdateProfileSchema>;
