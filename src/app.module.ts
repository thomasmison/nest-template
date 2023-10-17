import 'dotenv/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthSessionService } from './application/service/auth-session.service';
import { AuthService } from './application/service/auth.service';
import { UserAppService } from './application/service/user.app.service';
import { UserService } from './domain/service/user.service';
import { appDataSource } from './infrastructure/app-data-source';
import { UserController } from './infrastructure/controller/user.controller';
import { AuthSessionRepository } from './infrastructure/repository/auth-session.repository';
import { UserRepository } from './infrastructure/repository/user.repository';

@Module({
  imports: [TypeOrmModule.forRoot(appDataSource.options)],
  controllers: [UserController],
  providers: [
    AuthSessionRepository,
    UserRepository,
    UserService,
    UserAppService,
    AuthService,
    AuthSessionService,
  ],
})
export class AppModule {}
