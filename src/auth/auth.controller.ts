import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '@prisma/client';
import { SignUpDto } from './models/sign-up.dto';
import { LocalGuard } from './guards/local.guard';
import { TokenResponse } from './models/token-response.model';
import { CurrentUser } from '../decorators/current-user.decorator';
import { GoogleGuard } from './guards/google.guard';
import { RefreshGuard } from './guards/refresh.guard';
import { JwtGuard } from './guards/jwt.guard';
import { MicrosoftGuard } from "./guards/microsoft.guard";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  signUp(@Body() signUpRequest: SignUpDto): Promise<User> {
    return this.authService.signUp(signUpRequest);
  }

  @Post('/login')
  @UseGuards(LocalGuard)
  signIn(@CurrentUser() user: User): Promise<TokenResponse> {
    return this.authService.login(user);
  }

  @Delete('/logout')
  @UseGuards(JwtGuard)
  logout(@CurrentUser() user: User): Promise<void> {
    return this.authService.logout(user);
  }

  @Get('/refresh')
  @UseGuards(RefreshGuard)
  refresh(@CurrentUser() user: User): Promise<TokenResponse> {
    return this.authService.login(user);
  }

  @Get('/google/login')
  @UseGuards(GoogleGuard)
  googleCallback(@CurrentUser() user: User): Promise<TokenResponse> {
    return this.authService.login(user);
  }

  @Get('/microsoft/login')
  @UseGuards(MicrosoftGuard)
  microsoftCallback(@CurrentUser() user: User): Promise<TokenResponse> {
    return this.authService.login(user);
  }
}
