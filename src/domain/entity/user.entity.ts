import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { AuthSession } from './auth-session.entity';

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
  // ATM we are not using password hashing, but should be implemented when AuthService is implemented
  // just an example of how to use Exclude decorator
  @Column('varchar', { length: 255 })
  password: string;

  @Exclude()
  @OneToMany(() => AuthSession, (authSession) => authSession.user, {
    eager: false,
  })
  authSessions: AuthSession[];
}
