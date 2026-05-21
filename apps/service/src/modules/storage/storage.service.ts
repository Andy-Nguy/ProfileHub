import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from './providers/supabase-storage.provider';
import { ProfileRepository } from '../profile/profile.repository';

// ── Allowed MIME types ─────────────────────────────────────────────────────────
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

// ── Magic bytes for supported image formats ────────────────────────────────────
// Each entry: [offset, bytes] – checks a signature at a specific offset in the buffer
const IMAGE_MAGIC: Array<{ offset: number; bytes: number[] }> = [
  { offset: 0, bytes: [0xff, 0xd8, 0xff] },                         // JPEG
  { offset: 0, bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] }, // PNG
  { offset: 0, bytes: [0x52, 0x49, 0x46, 0x46] },                  // RIFF (WebP container)
];

const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly bucket: string;

  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
    private readonly config: ConfigService,
    private readonly profileRepository: ProfileRepository,
  ) {
    this.bucket = this.config.getOrThrow<string>('SUPABASE_STORAGE_BUCKET');
  }

  // ── Public ────────────────────────────────────────────────────────────────────

  async uploadAvatar(
    userId: string,
    file: Express.Multer.File,
  ): Promise<{ avatarUrl: string }> {
    this.logger.debug(`Initiating avatar upload for user ID: ${userId}, size: ${file?.size} bytes`);
    this.validateFile(file);

    const storagePath = this.buildPath(userId);
    this.logger.debug(`Generated target storage path: ${storagePath}`);

    const { error } = await this.supabase.storage
      .from(this.bucket)
      .upload(storagePath, file.buffer, {
        contentType: file.mimetype,
        upsert: true, // overwrite if re-uploading
      });

    if (error) {
      this.logger.debug(`Supabase upload failed for path: ${storagePath}. Error: ${error.message}`);
      throw new InternalServerErrorException(
        `Failed to upload avatar: ${error.message}`,
      );
    }

    this.logger.debug(`Supabase upload completed successfully for path: ${storagePath}`);

    const { data: publicUrlData } = this.supabase.storage
      .from(this.bucket)
      .getPublicUrl(storagePath);

    const avatarUrl = publicUrlData.publicUrl;
    this.logger.debug(`Supabase public URL generated: ${avatarUrl}`);

    // Persist avatarUrl in the profiles table via repository
    await this.profileRepository.upsertProfileFields(userId, { avatarUrl });
    this.logger.debug(`Successfully persisted avatar URL to profile DB record for user ID: ${userId}`);

    return { avatarUrl };
  }

  // ── Private helpers ───────────────────────────────────────────────────────────

  /**
   * Validates file size, MIME type, and magic bytes.
   * Throws BadRequestException on any failure.
   */
  private validateFile(file: Express.Multer.File): void {
    if (!file || !file.buffer) {
      this.logger.debug(`Validation failed: No file or buffer present`);
      throw new BadRequestException('No file uploaded.');
    }

    if (file.size > MAX_SIZE_BYTES) {
      this.logger.debug(`Validation failed: File size ${file.size} exceeds max allowed ${MAX_SIZE_BYTES}`);
      throw new BadRequestException(
        `File too large. Maximum allowed size is 2 MB.`,
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype as typeof ALLOWED_MIME_TYPES[number])) {
      this.logger.debug(`Validation failed: Invalid MIME type: ${file.mimetype}`);
      throw new BadRequestException(
        `Invalid file type. Allowed types: jpeg, png, webp.`,
      );
    }

    if (!this.hasMagicBytes(file.buffer)) {
      this.logger.debug(`Validation failed: File headers magic bytes check failed`);
      throw new BadRequestException(
        'File content does not match a valid image. Rejected.',
      );
    }

    this.logger.debug(`File validated successfully: MIME type ${file.mimetype}, size: ${file.size}`);
  }

  /**
   * Checks that the buffer starts with a recognised image signature.
   * Prevents spoofed extensions / MIME types.
   */
  private hasMagicBytes(buffer: Buffer): boolean {
    return IMAGE_MAGIC.some(({ offset, bytes }) =>
      bytes.every((b, i) => buffer[offset + i] === b),
    );
  }

  /**
   * Produces a safe, user-scoped, unique storage path.
   * Pattern: avatars/{userId}/{timestamp}-{random}.webp
   * No user-controlled input is used in the path.
   */
  private buildPath(userId: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).slice(2, 8);
    return `avatars/${userId}/${timestamp}-${random}.webp`;
  }
}
