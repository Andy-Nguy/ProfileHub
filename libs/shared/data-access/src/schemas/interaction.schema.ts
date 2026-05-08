import { z } from 'zod';
import { InteractionTargetType, InteractionType } from '../types';

export const CreateInteractionSchema = z.object({
  targetType: z.nativeEnum(InteractionTargetType),
  targetId: z.string().uuid('Invalid target ID'),
  interactionType: z.nativeEnum(InteractionType),
});

export type CreateInteractionDto = z.infer<typeof CreateInteractionSchema>;
