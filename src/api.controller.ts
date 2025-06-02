import { Controller, Get, Request, UseGuards, Logger } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { DefaultAuth } from '@lib/decorators/DefaultAuth.decorator';
import { UserService } from '@modules/user/user.service';
import { UserResponseDto } from '@modules/user/dto/user-response.dto';

@ApiTags('API')
@Controller('api')
export class ApiController {
  private readonly logger = new Logger(ApiController.name);
  constructor(private readonly userService: UserService) {}

  @Get('current-user')
  @DefaultAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Returns the current user profile', type: UserResponseDto })
  @ApiBearerAuth('JWT-auth')
  async getCurrentUser(@Request() req) {
    this.logger.log(`Getting current user for userId: ${req.user.userId}`);
    try {
      const user = await this.userService.findById(req.user.userId);
      this.logger.log(`Successfully retrieved user: ${user.email}`);
      return user;
    } catch (error) {
      this.logger.error(`Error retrieving user: ${error.message}`);
      throw error;
    }
  }
}
