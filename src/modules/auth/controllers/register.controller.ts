import { Body, Controller, Post, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Public } from '@lib/decorators/Public.decorator';

import { RegisterService } from '../services/register.service';
import { RegisterDto } from '../dtos/register.dto';
import { VerifyDto } from '../dtos/verify.dto';
import { LoginResponseDTO } from '../dtos/login-reponse.dto';

@ApiTags('Register')
@Controller('v1/register')
export class RegisterController {
  constructor(private registerService: RegisterService) {}

  @Public()
  @Post('email')
  @ApiOperation({ summary: 'This endpoint checks that the email is unregistered and sends a verification email' })
  @ApiResponse({ status: 201, description: 'Verification email sent' })
  @ApiResponse({ status: 400, description: 'Email already registered' })
  @ApiResponse({ status: 400, description: 'An active link has already been mailed' })
  registerEmail(@Body() body: RegisterDto) {
    return this.registerService.registerEmail(body.email);
  }

  @Public()
  @Post('email/verify-link')
  @ApiOperation({ summary: 'This endpoint activates the user after validation checks' })
  @ApiResponse({ status: 200, type: LoginResponseDTO })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiBadRequestResponse({ description: 'Expired link' })
  verifyLink(@Query() body: VerifyDto) {
    return this.registerService.verifyEmail(body.email, body.code);
  }
}
