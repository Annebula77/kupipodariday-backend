import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Wish } from '../wishes/entities/wish.entity';
import { SearchUsersDto } from './dto/search-user.dto';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved', type: User })
  async getOwnerProfile(
    @Request() req: Request & { user: User },
  ): Promise<User> {
    return req.user;
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'Profile updated', type: User })
  async updateOwnerPrifile(
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: Request & { user: User },
  ): Promise<User> {
    return this.usersService.update(req.user.id, updateUserDto);
  }

  @Get('me/wishes')
  @ApiOperation({ summary: 'Get current user wishes' })
  @ApiResponse({ status: 200, description: 'Wishes retrieved', type: [Wish] })
  async getOwnerWishes(
    @Request() req: Request & { user: User },
  ): Promise<Wish[]> {
    return this.usersService.getUserWishes(req.user.id);
  }

  @Get(':username')
  @ApiOperation({ summary: 'Get user by username' })
  @ApiResponse({ status: 200, description: 'User retrieved', type: User })
  async getUser(@Body() searchUsersDto: SearchUsersDto): Promise<User> {
    return this.usersService.findUserByUsername(searchUsersDto.quiry);
  }

  @Post('find')
  @ApiOperation({ summary: 'Search for users' })
  @ApiResponse({ status: 200, description: 'Search results', type: [User] })
  async searchUsers(@Body() searchUsersDto: SearchUsersDto): Promise<User[]> {
    return this.usersService.searchUsers(searchUsersDto.quiry);
  }

  @Get(':username/wishes')
  @Get(':username/wishes')
  @ApiOperation({ summary: 'Get wishes of a user by username' })
  @ApiResponse({ status: 200, description: 'Wishes retrieved', type: [Wish] })
  async getUserWishes(@Param('username') username: string): Promise<Wish[]> {
    return this.usersService.getOtherUserWishes(username);
  }
}
