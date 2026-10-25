import { z } from 'zod';
import { VisibilityTypeEnum } from '@profilehub/types';

export const CreateProfileSchema = z.object({
  displayName: z.string().min(1, 'Display name is required').max(100),
  headline: z.string().max(200).nullable().optional(),
  bio: z.string().nullable().optional(),
  avatarUrl: z.string().url('Invalid URL').nullable().optional(),
  coverUrl: z.string().url('Invalid URL').nullable().optional(),
  location: z.string().nullable().optional(),
  industry: z.string().nullable().optional(),
  visibility: z.nativeEnum(VisibilityTypeEnum).optional(),
});

export const UpdateProfileSchema = CreateProfileSchema.partial();

export type CreateProfileDto = z.infer<typeof CreateProfileSchema>;
export type UpdateProfileDto = z.infer<typeof UpdateProfileSchema>;

export type UpdateOnboardingDto = UpdateProfileDto;
