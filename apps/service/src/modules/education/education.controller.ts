import {
  Controller,
  Get,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { EducationService } from './education.service';
import { EducationSearchResultDto, SearchEducationDto } from './dto';

@ApiTags('Education')
@ApiBearerAuth()
@Controller('education')
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @Get('search')
  @ApiOperation({ summary: 'Search institutions by name (derived from education entries)' })
  @ApiResponse({ status: 200, type: [EducationSearchResultDto] })
  async search(
    @Query() query: SearchEducationDto,
  ): Promise<EducationSearchResultDto[]> {
    return this.educationService.search(query.q);
  }
}
