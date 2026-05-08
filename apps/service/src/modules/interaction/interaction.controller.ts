import { Controller, Post, Body } from '@nestjs/common';
import { InteractionService } from './interaction.service';
import type { CreateInteractionDto } from '../../../../../libs/shared/data-access/src';

@Controller('interactions')
export class InteractionController {
  constructor(private readonly interactionService: InteractionService) {}

  @Post()
  toggle(@Body() dto: CreateInteractionDto) {
    // TODO: get userId from auth token
    const userId = 'temp-user-id';
    return this.interactionService.toggle(userId, dto);
  }
}
