import { Injectable } from '@nestjs/common';

import { UserRepository } from '../../infrastructure/repository/user.repository';
import { UserNotFoundException } from '../exception/user/user-not-found.exception';

/**
 * Domain services are used to handle business logic
 * for simple logic, like simple crud, use application services.
 */
@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  // Just an example of method that can be in domain service, very useless in this case.
  async isUsernameValid(username: string): Promise<boolean> {
    const isValid = true; // some logic

    if (!isValid) {
      return false;
    }

    try {
      await this.userRepository.getOneByUsername(username);
      return false;
    } catch (error) {
      switch (error.constructor) {
        // Here we handle UserNotFoundException exception from repository.
        case UserNotFoundException:
          return true;
        // For other exceptions we just throw them.
        default:
          throw error;
      }
    }
  }
}
