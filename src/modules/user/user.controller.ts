import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from '@lib/decorators/Public.decorator';
import { DefaultAuth } from '@lib/decorators/DefaultAuth.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminUserResponseDto, UserResponseDto } from './dto/user-response.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Get('me/current')
  @DefaultAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Returns the current user profile', type: UserResponseDto })
  @ApiBearerAuth('JWT-auth')
  async getCurrentUser(@Request() req) {
    const userId = req.user.userId;
    const user = await this.userService.findById(userId);

    if (user.user_role === 'admin') {
      //return admin DTO (without survey data)
      return new AdminUserResponseDto(user);
    } else {
      // Return customer DTO (with survey_data)
      return new UserResponseDto(user);
    }
  }
}