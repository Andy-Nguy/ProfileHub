import { z } from 'zod';
import { EmploymentType } from '../../../types/types';

export const CreateExperienceSchema = z
  .object({
    title: z.string().min(1, 'Job title is required').max(150),
    company: z.string().min(1, 'Company name is required').max(150),
    location: z.string().max(100).nullable().optional(),
    employmentType: z.nativeEnum(EmploymentType).default(EmploymentType.FULL_TIME),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().nullable().optional(),
    isCurrent: z.boolean().default(false),
    description: z.string().max(3000).default(''),
  })
  .refine(
    (data) => {
      if (!data.isCurrent && data.endDate && data.startDate > data.endDate) {
        return false;
      }
      return true;
    },
    { message: 'Start date must be before end date', path: ['endDate'] },
  );

export const UpdateExperienceSchema = z.object({
  title: z.string().min(1).max(150).optional(),
  company: z.string().min(1).max(150).optional(),
  location: z.string().max(100).nullable().optional(),
  employmentType: z.nativeEnum(EmploymentType).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().nullable().optional(),
  isCurrent: z.boolean().optional(),
  description: z.string().max(3000).optional(),
});

export type CreateExperienceDto = z.infer<typeof CreateExperienceSchema>;
export type UpdateExperienceDto = z.infer<typeof UpdateExperienceSchema>;
