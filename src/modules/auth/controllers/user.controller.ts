import { Body, Controller, Patch, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { DefaultAuth } from '@lib/decorators/DefaultAuth.decorator';
import { CurrentUser } from '@lib/decorators/CurrentUser.decorator';
import { Public } from '@lib/decorators/Public.decorator';

import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserService } from '../services/user.service';
import { User } from '../entities/user.entity';
import { SendTestNotificationDto } from '../dtos/send-test-notification';

@ApiTags('User')
@Controller('v1/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Patch('me')
  @ApiOperation({
    summary: 'Update the user obtained by the access token. ',
    description:
      'Note: The currentPassword field should be provided only if updating the password on a user who has already set their password at least once. If passwordUpdatedAt is null, no need to provide currentPassword',
  })
  @ApiResponse({ status: 200, description: 'User details updated successfully' })
  @ApiBadRequestResponse({ description: 'Invalid properties' })
  @DefaultAuth() // INFO: instructs Swagger that this is a gated endpoint so bearer token should be sent
  updateUser(@Body() body: UpdateUserDto, @CurrentUser() user: User) {
    return this.userService.updateUserApi(body, user);
  }

  @Public()
  @Post('notifications')
  @ApiOperation({
    summary: 'Send a test notification to the user',
  })
  @ApiResponse({ status: 200 })
  @ApiBadRequestResponse({ description: 'Invalid request' })
  sendTestNotification(@Body() body: SendTestNotificationDto) {
    if (body.secret !== 'sillycat@2024') {
      throw new Error("That's the wrong key!");
    }
    return this.userService.sendTestNotificationApi(body);
  }
}
