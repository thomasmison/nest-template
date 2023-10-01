import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../infrastructure/repository/user.repository';
import { User } from '../entity/user.entity';

/**
 * Domain services are used to handle business logic.
 * for simple logic, like simple crud, use application services.
 */
@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(): Promise<User> {
    // Implement business logic
    const user = new User();
    user.email = 'placeholder@email.com';
    user.name = 'placeholder';
    return user;
  }
}
