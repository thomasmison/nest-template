import { ApiProperty } from '@nestjs/swagger';

import { User } from '../../../domain/entity/user.entity';
import { ListResponseDto } from '../common/list.response.dto';

export class UserListResponseDto extends ListResponseDto {
  @ApiProperty({ type: [User] })
  data: User[];
}
