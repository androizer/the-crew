import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RequestQueryBuilder } from '@nestjsx/crud-request';
import { User } from '@the-crew/common';
import { RegisterUserDTO } from '@the-crew/common/dto';
import { Request, Response } from 'express';

import { CurrentUser } from '../../core/decorators';
import { JwtAuthGuard, LocalAuthGuard } from '../guards';
import { RefreshTokenDTO } from '../models/dto';
import { AuthService } from '../services';

@ApiTags('Authentication/Authorization')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Post('register')
  async register(@Body() dto: RegisterUserDTO) {
    return this.authService.register({ ...dto });
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: Request) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logout(@CurrentUser() user: User) {
    this.authService.logout(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  whoAmI(@CurrentUser() user: User, @Res() res: Response, @Req() req: Request) {
    const qb = RequestQueryBuilder.create(req.query).query();
    if (qb) {
      return res.redirect(`/api/users/${user.id}?${qb}`);
    } else {
      return res.redirect(`/api/users/${user.id}`);
    }
  }

  @Post('token/refresh')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async refreshToken(@Body() payload: RefreshTokenDTO) {
    // generate accessToken & refreshToken
    if (!payload.refreshToken) {
      throw new UnauthorizedException('Refresh Token Malformed');
    }
    return this.authService.createAccessAndRefreshToken(payload.refreshToken);
  }
}
