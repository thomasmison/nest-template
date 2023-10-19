import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { AuthSession } from './auth-session.entity';
import { Hash } from '../../infrastructure/common/hash.utils';
import { RoleEnum } from '../enum/role.enum';

@Entity()
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column('varchar', { length: 255 })
  name: string;

  @ApiProperty()
  @Column('varchar', { length: 255 })
  email: string;

  @ApiProperty()
  @Column('varchar', { length: 255, unique: true })
  username: string;

  @Exclude()
  @Column('varchar', { length: 255 })
  password: string;

  @Exclude()
  @OneToMany(() => AuthSession, (authSession) => authSession.user, {
    eager: false,
  })
  authSessions: AuthSession[];

  // We use an array of roles instead of a single role, because we want to be able to assign multiple roles to a user
  // like rbac, but in a less complex way
  @Exclude()
  @Column('enum', { enum: RoleEnum, array: true, default: [] })
  roles: RoleEnum[];

  // We should not use this method in production, we have to use auth service, only used by convenience when loading fixtures through TypeORM yml
  private setPassword(password: string): void {
    this.password = Hash.from(password).sha512();
  }
}
