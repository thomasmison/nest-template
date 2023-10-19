import { ApiProperty } from '@nestjs/swagger';

import { AuthTokenDto } from './auth-token.dto';
import { BaseResponseDto } from '../common/base.response.dto';

export class AuthTokenResponseDto extends BaseResponseDto {
  @ApiProperty({ type: AuthTokenDto })
  data: AuthTokenDto;
}
