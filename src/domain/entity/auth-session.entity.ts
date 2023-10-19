import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from './user.entity';

@Entity()
export class AuthSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 512 })
  refreshToken: string;

  @Column('timestamp')
  expiresAt: Date;

  @ManyToOne(() => User, (user) => user.authSessions)
  user: User;

  @Column('timestamp')
  createdAt: Date;

  @Column('boolean', { default: false })
  isRevoked: boolean;

  // Wr can add more fields here, like ip address, user agent, etc...
}
