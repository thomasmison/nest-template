import { ApiProperty } from '@nestjs/swagger';

import { User } from '../../../domain/entity/user.entity';
import { BaseResponseDto } from '../common/base.response.dto';

export class UserResponseDto extends BaseResponseDto {
  @ApiProperty({ type: User })
  data: User;
}
