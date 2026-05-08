import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { ProfileEntity } from './entities/profile.entity';
import { SkillEntity } from './entities/skill.entity';
import { ExperienceEntity } from './entities/experience.entity';
import { EducationEntity } from './entities/education.entity';
import { InteractionEntity } from './entities/interaction.entity';
import { UserModule } from './modules/user/user.module';
import { ProfileModule } from './modules/profile/profile.module';
import { InteractionModule } from './modules/interaction/interaction.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres' as const,
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get<string>('DB_USER', 'postgres'),
        password: config.get<string>('DB_PASS', 'postgres'),
        database: config.get<string>('DB_NAME', 'profilehub'),
        entities: [
          UserEntity,
          ProfileEntity,
          SkillEntity,
          ExperienceEntity,
          EducationEntity,
          InteractionEntity,
        ],
        synchronize: true, // dev only — use migrations in prod
        logging: config.get('NODE_ENV') === 'development',
      }),
    }),

    UserModule,
    ProfileModule,
    InteractionModule,
  ],
})
export class AppModule {}
