import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '../../domain/entity/user.entity';
import { UserNotFoundException } from '../../domain/exception/user/user-not-found.exception';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async getAll(): Promise<User[]> {
    return await this.find();
  }

  async getOneByEmail(email: string): Promise<User> {
    const user = await this.findOneBy({ email });
    if (!user) {
      throw new UserNotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async getOneById(id: string): Promise<User> {
    const user = await this.findOneBy({ id });
    if (!user) {
      throw new UserNotFoundException(`User with id ${id} not found`);
    }
    return user;
  }
}
