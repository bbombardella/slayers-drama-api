import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';
import { TokenResponseDto } from './dto/token-response.dto';
import { CurrentUser } from '../decorators/current-user.decorator';
import { GoogleGuard } from './guards/google.guard';
import { RefreshGuard } from './guards/refresh.guard';
import { JwtGuard } from './guards/jwt.guard';
import { MicrosoftGuard } from './guards/microsoft.guard';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  @ApiOperation({
    summary: 'Create an user',
  })
  @ApiCreatedResponse({ type: UserEntity })
  async signUp(@Body() signUpRequest: CreateUserDto): Promise<UserEntity> {
    return this.authService.signUp(signUpRequest);
  }

  @Post('/login')
  @UseGuards(LocalGuard)
  @ApiOperation({
    summary: 'Login via login/password',
  })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ type: TokenResponseDto })
  signIn(@CurrentUser() user: UserEntity): Promise<TokenResponseDto> {
    return this.authService.login(user);
  }

  @Delete('/logout')
  @UseGuards(JwtGuard)
  @ApiOperation({
    summary: 'Disconnect user',
  })
  @ApiOkResponse()
  logout(@CurrentUser() user: UserEntity): Promise<void> {
    return this.authService.logout(user);
  }

  @Get('/refresh')
  @UseGuards(RefreshGuard)
  @ApiOperation({
    summary: 'Create new token thanks to refresh token',
  })
  @ApiOkResponse({ type: TokenResponseDto })
  refresh(@CurrentUser() user: UserEntity): Promise<TokenResponseDto> {
    return this.authService.login(user);
  }

  @Get('/google/login')
  @UseGuards(GoogleGuard)
  @ApiOperation({
    summary: 'Login via Google provider',
  })
  @ApiOkResponse({ type: TokenResponseDto })
  googleCallback(@CurrentUser() user: UserEntity): Promise<TokenResponseDto> {
    return this.authService.login(user);
  }

  @Get('/microsoft/login')
  @UseGuards(MicrosoftGuard)
  @ApiOperation({
    summary: 'Login via Microsoft provider',
  })
  @ApiOkResponse({ type: TokenResponseDto })
  microsoftCallback(
    @CurrentUser() user: UserEntity,
  ): Promise<TokenResponseDto> {
    return this.authService.login(user);
  }
}
