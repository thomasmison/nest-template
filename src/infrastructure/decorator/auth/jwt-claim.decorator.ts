import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

import { JwtClaimsDto } from '../../../application/dto/auth/jwt-claims.dto';

export const JwtClaims = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const authBearerToken = request.headers.authorization;
    const jwtToken = authBearerToken.split(' ')[1];
    const jwtClaims = jwt.decode(jwtToken) as jwt.JwtPayload;
    const jwtClaimsDto = new JwtClaimsDto();
    Object.assign(jwtClaimsDto, jwtClaims);

    return jwtClaimsDto;
  },
);
