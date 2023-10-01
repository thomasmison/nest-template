import { Injectable } from '@nestjs/common';

import { User } from '../../domain/entity/user.entity';
import { UserService } from '../../domain/service/user.service';
import { UserRepository } from '../../infrastructure/repository/user.repository';
import { ListBuilder, ListInterface } from '../common/list';

/**
 * Application services are the ones that are used by the controllers.
 * They are responsible for handling simple CRUD. for more complex logic, use domain services.
 */
@Injectable()
export class UserAppService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userService: UserService,
  ) {}

  async getById(id: string): Promise<User> {
    return await this.userRepository.getOneById(id);
  }

  async getList(): Promise<ListInterface<User>> {
    const users = await this.userRepository.getAll();

    const list = new ListBuilder(users);

    return list.build();
  }
}
