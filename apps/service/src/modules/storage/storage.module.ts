import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StorageController } from './storage.controller';
import { StorageService } from './storage.service';
import { SupabaseClientProvider } from './providers/supabase-storage.provider';
import { ProfileModule } from '../profile/profile.module';

@Module({
  imports: [
    ConfigModule,   // provides ConfigService for SupabaseClientProvider
    ProfileModule,  // provides ProfileRepository (already exported by ProfileModule)
  ],
  controllers: [StorageController],
  providers: [
    SupabaseClientProvider,
    StorageService,
  ],
  exports: [StorageService],
})
export class StorageModule {}
