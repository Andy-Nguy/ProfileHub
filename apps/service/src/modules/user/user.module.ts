import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UsersRepository } from './repositories/users.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserService, UsersRepository],
  exports: [UserService, UsersRepository],
})
export class UserModule {}
