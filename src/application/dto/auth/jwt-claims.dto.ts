import { IsArray, IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { RoleEnum } from '../../../domain/enum/role.enum';

export class JwtClaimsDto {
  @IsString()
  @IsNotEmpty()
  userEmail: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @IsEnum(RoleEnum, { each: true })
  userRoles: RoleEnum[];
}
