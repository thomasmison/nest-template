import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';

import { AuthSession } from '../../domain/entity/auth-session.entity';
import { User } from '../../domain/entity/user.entity';
import { AuthSessionNotFoundException } from '../../domain/exception/auth-session/auth-session-not-found.exception';
import { AuthSessionRepository } from '../../infrastructure/repository/auth-session.repository';
/**
 * We don't call this service with app because this service is only used by AuthController, it's not a business service
 */
@Injectable()
export class AuthSessionService {
  constructor(private readonly authSessionRepository: AuthSessionRepository) {}

  async getSessionByRefreshToken(refreshToken: string): Promise<AuthSession> {
    const authSession =
      await this.authSessionRepository.getOneByRefreshToken(refreshToken);

    if (authSession.isRevoked) {
      throw new AuthSessionNotFoundException(
        `AuthSession with refreshToken ${refreshToken} is revoked`,
      );
    }

    if (this.isSessionExpired(authSession)) {
      throw new AuthSessionNotFoundException(
        `AuthSession with refreshToken ${refreshToken} is expired`,
      );
    }

    return authSession;
  }

  async createAuthSession(
    user: User,
    minutesDuration: number,
  ): Promise<AuthSession> {
    const authSession = new AuthSession();
    authSession.user = user;
    authSession.refreshToken = this.generateRefreshToken();
    authSession.expiresAt = this.generateExpirationDate(minutesDuration);
    authSession.createdAt = new Date();

    return await this.authSessionRepository.save(authSession);
  }

  async refreshAuthSession(
    authSession: AuthSession,
    minutesDuration: number,
  ): Promise<AuthSession> {
    authSession.refreshToken = this.generateRefreshToken();
    authSession.expiresAt = this.generateExpirationDate(minutesDuration);

    return await this.authSessionRepository.save(authSession);
  }

  async revokeAuthSession(authSession: AuthSession): Promise<AuthSession> {
    authSession.isRevoked = true;
    return await this.authSessionRepository.save(authSession);
  }

  private isSessionExpired(authSession: AuthSession): boolean {
    return authSession.expiresAt < new Date();
  }

  private generateRefreshToken(length = 64): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;

    return Array.from({ length })
      .map(() =>
        characters.charAt(Math.floor(Math.random() * charactersLength)),
      )
      .join('');
  }

  private generateExpirationDate(minutesDuration: number): Date {
    const dateNow = DateTime.now();
    const dateNowPlusDuration = dateNow.plus({ minutes: minutesDuration });
    return dateNowPlusDuration.toJSDate();
  }
}
