import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
import { PublicUserResponseDto } from './dto/public-user-response.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':username')
  @ApiResponse({ status: 200, type: PublicUserResponseDto })
  async getByUsername(@Param('username') username: string) {
    const user = await this.userService.findByUsername(username);
    return new PublicUserResponseDto(user);
  }
}
