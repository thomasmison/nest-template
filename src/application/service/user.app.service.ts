import { Injectable } from '@nestjs/common';

import { User } from '../../domain/entity/user.entity';
import { CannotCreateUserException } from '../../domain/exception/user/cannot-create-user.exception';
import { UserService } from '../../domain/service/user.service';
import { UserRepository } from '../../infrastructure/repository/user.repository';
import { ListBuilder, ListInterface } from '../common/list';
import { UserCreateRequestDto } from '../dto/user/user-create-request.dto';

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

  async create(userCreateDto: UserCreateRequestDto): Promise<User> {
    const isUsernameValid = await this.userService.isUsernameValid(
      userCreateDto.name,
    );

    if (!isUsernameValid) {
      throw new CannotCreateUserException(
        `Cannot create user, Username ${userCreateDto.name} is not valid`,
      );
    }

    const user = new User();
    user.name = userCreateDto.name;
    user.email = userCreateDto.email;
    user.username = userCreateDto.username;
    // it's an example of using domain service, but very useless in this case.

    return this.userRepository.create(user);
  }
}
