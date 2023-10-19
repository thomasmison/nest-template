import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { AuthSession } from '../../domain/entity/auth-session.entity';
import { AuthSessionNotFoundException } from '../../domain/exception/auth-session/auth-session-not-found.exception';

@Injectable()
export class AuthSessionRepository extends Repository<AuthSession> {
  constructor(private dataSource: DataSource) {
    super(AuthSession, dataSource.createEntityManager());
  }

  async getOneByRefreshToken(refreshToken: string): Promise<AuthSession> {
    const authSession = await this.createQueryBuilder('authSession')
      .leftJoinAndSelect('authSession.user', 'user')
      .where('authSession.refreshToken = :refreshToken', { refreshToken })
      .getOne();

    if (!authSession) {
      throw new AuthSessionNotFoundException(
        `AuthSession with refreshToken ${refreshToken} not found`,
      );
    }

    return authSession;
  }
}
