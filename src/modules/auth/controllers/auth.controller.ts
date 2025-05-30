import { Body, Controller, Get, Post, Req, Request, UseGuards, Res, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBadRequestResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { DefaultAuth } from '@lib/decorators/DefaultAuth.decorator';
import { Public } from '@lib/decorators/Public.decorator';
import { LocalAuthGuard } from '@lib/guards/local-auth.guard';

import { AuthDto } from '../dtos/auth.dto';
import { GAuthDto } from '../dtos/gauth.dto';
import { LoginResponseDTO } from '../dtos/login-reponse.dto';
import { AuthService } from '../services/auth.service';
import { UserService } from '../../user/user.service';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@ApiTags('Auth')
@Controller('v1/auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private configService: ConfigService,
  ) {}

  @Public()
  @Get('test')
  @ApiOperation({ summary: 'Hello World' })
  @ApiResponse({ status: 200 })
  sayHello() {
    return this.authService.sayHello();
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: 200, type: LoginResponseDTO })
  @Post('/login')
  async login(@Body() body: AuthDto, @Request() req) {
    return this.authService.login(req.user);
  }

  @ApiOperation({ summary: 'Protected route' })
  @ApiResponse({ status: 200 })
  @DefaultAuth()
  @Get('protected')
  async protectedRoute() {
    return { message: 'Protected route accessed' };
  }

  @Public()
  @ApiOperation({ summary: 'Google Auth' })
  @ApiResponse({ status: 200, type: LoginResponseDTO })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @Post('gauth')
  async gauth(@Body() body: GAuthDto) {
    return this.authService.gauth(body.idToken);
  }

  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google OAuth Login' })
  async googleAuth(@Req() req) {
    this.logger.log('Google auth flow initiated');
  }

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google OAuth Callback' })
  @ApiResponse({ status: 200, type: LoginResponseDTO })
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    this.logger.log('Google auth callback received');
    try {
      const loginResponse: LoginResponseDTO = req.user;
      this.logger.log(`Login successful for user: ${loginResponse.user.email}`);
      const frontendUrl = this.configService.get<string>('FRONTEND_URL');
      if (frontendUrl) {
        const redirectUrl = `${frontendUrl}/auth/google-callback?token=${loginResponse.access_token}&isNewUser=${loginResponse.isNewUser}`;
        this.logger.log(`Redirecting to: ${redirectUrl}`);
        return res.redirect(redirectUrl);
      } else {
        return res.json(loginResponse);
      }
    } catch (error) {
      this.logger.error(`Google callback error: ${error.message}`);
      return res.status(500).json({ error: 'Authentication failed' });
    }
  }
}
