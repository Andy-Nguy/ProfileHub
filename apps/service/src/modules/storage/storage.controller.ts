import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
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
import { StorageService } from './storage.service';
import { UploadAvatarResponseDto } from './dto/upload-avatar-response.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Storage')
@ApiBearerAuth()
@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  /**
   * POST /api/storage/avatar
   *
   * Accepts a multipart/form-data upload with field name `file`.
   * Validates the file, uploads it to Supabase Storage, updates
   * the authenticated user's profile.avatarUrl, and returns the
   * public URL.
   */
  @Post('avatar')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(), // keep file in RAM buffer – never touch disk
      limits: { fileSize: 2 * 1024 * 1024 }, // hard 2 MB guard at transport layer
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload avatar image for the authenticated user' })
  @ApiBody({
    description: 'Avatar image file (jpeg, png, webp – max 2 MB). Frontend must compress before upload.',
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Avatar uploaded successfully. Returns the public URL.',
    type: UploadAvatarResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid file type, size, or content.' })
  @ApiResponse({ status: 401, description: 'Unauthorized – valid JWT required.' })
  async uploadAvatar(
    @CurrentUser('id') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UploadAvatarResponseDto> {
    return this.storageService.uploadAvatar(userId, file);
  }
}
