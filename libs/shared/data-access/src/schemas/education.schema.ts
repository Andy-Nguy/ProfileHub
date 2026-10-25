import { z } from 'zod';

export const CreateEducationSchema = z.object({
  institution: z.string().min(1, 'Institution is required').max(200),
  degree: z.string().min(1, 'Degree is required').max(150),
  fieldOfStudy: z.string().min(1, 'Field of study is required').max(150),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().nullable().optional(),
  isCurrent: z.boolean().optional(),
  institutionLogoUrl: z.string().url().nullable().optional(),
  description: z.string().nullable().optional(),
});

export const UpdateEducationSchema = CreateEducationSchema.partial();

export type CreateEducationDto = z.infer<typeof CreateEducationSchema>;
export type UpdateEducationDto = z.infer<typeof UpdateEducationSchema>;
