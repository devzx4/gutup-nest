import { Controller, Get, UseGuards, Post, Request, Body, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { LocalAuthGuard } from '@lib/guards/local-auth.guard';
import { JwtAuthGuard } from '@lib/guards/jwt-auth.guard';
import { DefaultAuth } from '@lib/decorators/DefaultAuth.decorator';
import { GoogleOauthGuard } from '@lib/guards/google-oauth.guard';

import { AuthService } from '../services/auth.service';
import { AuthDto } from '../dtos/auth.dto';
import { HashThisDto } from '../dtos/hashThis.dto';
import { LoginResponseDTO } from '../dtos/login-reponse.dto';

@ApiTags('Auth')
@Controller('v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('test')
  @ApiOperation({ summary: 'Hello World' })
  @ApiResponse({ status: 200 })
  sayHello() {
    return this.authService.sayHello();
  }

  @Get('hashThis')
  @ApiOperation({ summary: 'Hash the supplied string' })
  @ApiResponse({ status: 200 })
  hashThis(@Query() query: HashThisDto) {
    return this.authService.hashThis(query.password);
  }

  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: 200, type: LoginResponseDTO })
  @Post('/login')
  async login(@Body() body: AuthDto, @Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Protected route' })
  @ApiResponse({ status: 200 })
  @DefaultAuth()
  @Get('protected')
  async protectedRoute(@Request() req) {
    return req.user;
  }

  @ApiOperation({ summary: 'Google Auth' })
  @ApiResponse({ status: 200 })
  @Get('google')
  @UseGuards(GoogleOauthGuard)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async gauth() {}
}
