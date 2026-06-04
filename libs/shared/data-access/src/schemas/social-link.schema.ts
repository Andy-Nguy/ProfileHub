import { z } from 'zod';
import { SocialPlatform } from '@profilehub/types';

export const CreateSocialLinkSchema = z.object({
  platform: z.nativeEnum(SocialPlatform),
  url: z.string().url('Invalid URL').max(2048),
});

export const UpdateSocialLinkSchema = CreateSocialLinkSchema.partial();

export type CreateSocialLinkDto = z.infer<typeof CreateSocialLinkSchema>;
export type UpdateSocialLinkDto = z.infer<typeof UpdateSocialLinkSchema>;
