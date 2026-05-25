import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CompaniesService } from './companies.service';
import {
  CompanyResponseDto,
  CreateCompanyDto,
  SearchCompaniesDto,
} from './dto';
import { CompanyMapper } from './mappers/company.mapper';

@ApiTags('Companies')
@ApiBearerAuth()
@Controller('companies')
export class CompaniesController {
  constructor(
    private readonly companiesService: CompaniesService,
    private readonly companyMapper: CompanyMapper,
  ) {}

  @Get('search')
  @ApiOperation({ summary: 'Search companies by name or domain' })
  @ApiResponse({ status: 200, type: [CompanyResponseDto] })
  async search(
    @Query() query: SearchCompaniesDto,
  ): Promise<CompanyResponseDto[]> {
    const companies = await this.companiesService.search(query.q);
    return this.companyMapper.toResponseDtos(companies);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 2 * 1024 * 1024 },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a deduplicated company record' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['name'],
      properties: {
        name: { type: 'string' },
        domain: { type: 'string' },
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 201, type: CompanyResponseDto })
  async create(
    @Body() dto: CreateCompanyDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<CompanyResponseDto> {
    const company = await this.companiesService.create(dto, file);
    return this.companyMapper.toResponseDto(company);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get company by ID' })
  @ApiResponse({ status: 200, type: CompanyResponseDto })
  async getById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<CompanyResponseDto> {
    const company = await this.companiesService.getById(id);
    return this.companyMapper.toResponseDto(company);
  }
}

