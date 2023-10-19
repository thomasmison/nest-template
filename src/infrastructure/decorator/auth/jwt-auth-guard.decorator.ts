import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Roles } from './roles.decorator';
import { AuthService } from '../../../application/service/auth.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const neededRole = this.reflector.get<string[] | 'public'>(
      Roles,
      context.getHandler(),
    );

    if (neededRole === 'public') {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers['authorization'];

    if (!authorizationHeader) {
      throw new UnauthorizedException('Authorization header must be provided');
    }

    const token = authorizationHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
      throw new UnauthorizedException(
        'Authorization token must be valid, maybe you forgot to add Bearer before the token',
      );
    }

    try {
      request.jwtClaims = await this.authService.decodeToken(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }

    if (!neededRole || neededRole.length === 0) {
      return true;
    }

    return request.jwtClaims.userRoles.some((role: string) =>
      neededRole.includes(role),
    );
  }
}
