import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

import { JwtClaimsDto } from '../../../application/dto/auth/jwt-claims.dto';

const getJwtClaimsFromContext = (ctx: ExecutionContext): JwtClaimsDto => {
  const request = ctx.switchToHttp().getRequest();
  const authBearerToken = request.headers.authorization;
  const jwtToken = authBearerToken.split(' ')[1];
  const jwtClaims = jwt.decode(jwtToken) as jwt.JwtPayload;
  const jwtClaimsDto = new JwtClaimsDto();
  Object.assign(jwtClaimsDto, jwtClaims.claims);

  return jwtClaimsDto;
};

export const JwtClaims = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    return getJwtClaimsFromContext(ctx);
  },
);

export const JwtClaim = (claimName: string) =>
  createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const jwtClaims = getJwtClaimsFromContext(ctx);
    return jwtClaims[claimName];
  });

export const CurrentUserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const jwtClaims = getJwtClaimsFromContext(ctx);
    return jwtClaims.userId;
  },
);

export const CurrentUserEmail = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const jwtClaims = getJwtClaimsFromContext(ctx);
    return jwtClaims.userEmail;
  },
);
