import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { UserService } from './user.service';
import type { CreateUserDto } from '../../../../../libs/shared/data-access/src';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':username')
  getByUsername(@Param('username') username: string) {
    return this.userService.findByUsername(username);
  }

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }
}
