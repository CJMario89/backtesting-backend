import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { AuthGuardLocal } from './auth.guard';
import { Response } from 'express';
import { RequestWithUser } from './auth.type';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    return;
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.upsertUserProfile(req);
    if (!user) {
      return res.redirect(process.env.FRONTEND_URL);
    } else {
      const token = this.jwtService.sign(user);
      return res
        .cookie('jwt', token, {
          httpOnly: true,
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7days
        })
        .redirect(process.env.FRONTEND_URL);
    }
  }

  @UseGuards(AuthGuardLocal)
  @Get('profile')
  getProfile(@Req() req: RequestWithUser) {
    return req.user;
  }

  @Get('logout')
  googleLogout(@Res({ passthrough: true }) res: Response) {
    return res.clearCookie('jwt');
  }
}
