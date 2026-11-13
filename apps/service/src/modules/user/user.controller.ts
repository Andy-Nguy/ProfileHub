import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { UserService } from './user.service';
import { PublicUserResponseDto } from './dto/public-user-response.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':username')
  @ApiOperation({ summary: 'Get public user profile information by username' })
  @ApiParam({ name: 'username', description: 'Username of the user' })
  @ApiResponse({ status: 200, type: PublicUserResponseDto, description: 'User found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getByUsername(@Param('username') username: string) {
    const user = await this.userService.findByUsername(username);
    return new PublicUserResponseDto(user);
  }
}

