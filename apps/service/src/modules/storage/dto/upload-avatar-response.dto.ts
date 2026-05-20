import { ApiProperty } from '@nestjs/swagger';

export class UploadAvatarResponseDto {
  @ApiProperty({
    description: 'Public URL of the uploaded avatar image',
    example: 'https://xyz.supabase.co/storage/v1/object/public/profilehub-assets/avatars/user-id/1715900000000-a1b2c3.webp',
  })
  avatarUrl!: string;
}
