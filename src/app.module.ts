import 'dotenv/config';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthSessionService } from './application/service/auth-session.service';
import { AuthService } from './application/service/auth.service';
import { UserAppService } from './application/service/user.app.service';
import { UserService } from './domain/service/user.service';
import { appDataSource } from './infrastructure/app-data-source';
import { AuthController } from './infrastructure/controller/auth.controller';
import { UserController } from './infrastructure/controller/user.controller';
import { RolesGuard } from './infrastructure/decorator/auth/jwt-auth-guard.decorator';
import { AuthSessionRepository } from './infrastructure/repository/auth-session.repository';
import { UserRepository } from './infrastructure/repository/user.repository';

@Module({
  imports: [TypeOrmModule.forRoot(appDataSource.options)],
  controllers: [AuthController, UserController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    AuthSessionRepository,
    UserRepository,
    UserService,
    UserAppService,
    AuthService,
    AuthSessionService,
  ],
})
export class AppModule {}
