import { User } from '@prisma/client';

export class TokenResponse {
  access_token: string;
  refresh_token: string;
  user: Omit<User, 'password' | 'refreshToken'>;
}
