import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma-service';
import { UserProfile } from './auth.type';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async upsertUserProfile(req: { user: UserProfile }) {
    const data = {
      google_id: req.user.id,
      display_name: req.user.displayName,
      given_name: req.user.givenName,
      family_name: req.user.familyName,
      photo: req.user.photo,
      provider: req.user.provider,
      access_token: req.user.accessToken,
      refresh_token: req.user.refreshToken,
    };

    const userProfile = await this.prisma.user_profile.upsert({
      where: { email: req.user.email },
      update: data,
      create: {
        id: uuidv4(),
        google_id: req.user.id,
        email: req.user.email,
        ...data,
      },
    });

    return {
      id: userProfile.id,
      name: userProfile.display_name,
      email: userProfile.email,
    };
  }
}
