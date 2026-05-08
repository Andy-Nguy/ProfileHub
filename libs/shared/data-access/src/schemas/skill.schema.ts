import { z } from 'zod';
import { SkillCategory } from '../types';

export const CreateSkillSchema = z.object({
  name: z
    .string()
    .min(1, 'Skill name is required')
    .max(50, 'Skill name must be at most 50 characters'),
  category: z.nativeEnum(SkillCategory).default(SkillCategory.OTHER),
});

export const UpdateSkillSchema = CreateSkillSchema.partial();

export type CreateSkillDto = z.infer<typeof CreateSkillSchema>;
export type UpdateSkillDto = z.infer<typeof UpdateSkillSchema>;
