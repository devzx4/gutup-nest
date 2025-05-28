/**
 * Adapted from TZ
 */

import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

import { User } from '@modules/auth/entities/user.entity';

// INFO: this decorator is used to get current user from request
export const CurrentUser = createParamDecorator(async (_data: never, ctx: ExecutionContext): Promise<User> => {
  const request = ctx.switchToHttp().getRequest();
  if (!request.user) {
    throw new UnauthorizedException('No logged in user');
  }
  const user = await User.findOne({ where: { id: request.user.userId } });
  if (user) {
    return user;
  } else {
    throw new UnauthorizedException('User not found');
  }
});
