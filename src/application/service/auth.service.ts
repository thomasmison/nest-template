import { Injectable } from '@nestjs/common';
import { validateOrReject } from 'class-validator';
import * as jwt from 'jsonwebtoken';

import { AuthSessionService } from './auth-session.service';
import { User } from '../../domain/entity/user.entity';
import { Hash } from '../../infrastructure/common/hash.utils';
import { Time } from '../../infrastructure/common/time.utils';
import { UserRepository } from '../../infrastructure/repository/user.repository';
import { AuthTokenDto } from '../dto/auth/auth-token.dto';
import { JwtClaimsDto } from '../dto/auth/jwt-claims.dto';
import { SignInRequestDto } from '../dto/auth/sign-in-request.dto';
import { WrongPasswordException } from '../exception/auth/wrong-password.exception';

@Injectable()
export class AuthService {
  private readonly jwtSecret: string;
  private readonly jwtExpiresIn: string;
  private readonly jwtAlgorithm: jwt.Algorithm;
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authSessionService: AuthSessionService,
  ) {
    this.jwtSecret = process.env.JWT_SECRET;
    if (!this.jwtSecret) {
      throw new Error('JWT_SECRET is not defined');
    }

    this.jwtExpiresIn = '30m';
    this.jwtAlgorithm = 'HS512';
  }

  async signIn(signInDto: SignInRequestDto): Promise<AuthTokenDto> {
    const user = await this.userRepository.getOneByEmail(signInDto.email);

    const hashedPassword = this.hashPassword(signInDto.password);

    if (user.password !== hashedPassword) {
      throw new WrongPasswordException(`Wrong password`);
    }

    const authSession = await this.authSessionService.createAuthSession(
      user,
      Time.fromDays(7).minutes, // For the moment we set the refresh token to expire in 7 days, when we implement the keep me logged in feature we can change this
    );

    return {
      accessToken: await this.generateJwtToken(user),
      refreshToken: authSession.refreshToken,
    };
  }

  async refresh(refreshToken: string): Promise<AuthTokenDto> {
    const authSession =
      await this.authSessionService.getSessionByRefreshToken(refreshToken);

    const user = await this.userRepository.getOneById(authSession.user.id);

    const newAuthSession = await this.authSessionService.refreshAuthSession(
      authSession,
      Time.fromDays(7).minutes, // For the moment we set the refresh token to expire in 7 days, when we implement the keep me logged in feature we can change this
    );

    return {
      accessToken: await this.generateJwtToken(user),
      refreshToken: newAuthSession.refreshToken,
    };
  }

  private async generateJwtToken(user: User): Promise<string> {
    const claims = await this.generateJwtClaims(user);

    return jwt.sign({ claims }, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn,
      algorithm: this.jwtAlgorithm,
    });
  }

  public hashPassword(password: string): string {
    return Hash.from(password).sha512();
  }

  public async generateJwtClaims(user: User): Promise<JwtClaimsDto> {
    const claims = new JwtClaimsDto();
    claims.userEmail = user.email;
    claims.userId = user.id;

    await validateOrReject(claims);
    return claims;
  }

  public async decodeToken(token: string): Promise<JwtClaimsDto> {
    const decodedToken = jwt.verify(token, this.jwtSecret) as jwt.JwtPayload;
    const claimsDto = new JwtClaimsDto();
    Object.assign(claimsDto, decodedToken.claims);

    await validateOrReject(claimsDto);
    return claimsDto;
  }
}
