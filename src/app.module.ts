import 'dotenv/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { appDataSource } from './infrastructure/app-data-source';
import { UserRepository } from './infrastructure/repository/user.repository';
import { UserService } from './domain/service/user.service';
import { UserController } from './infrastructure/controller/user.controller';
import { UserAppService } from './application/service/user.app.service';

@Module({
  imports: [TypeOrmModule.forRoot(appDataSource.options)],
  controllers: [UserController],
  providers: [UserRepository, UserService, UserAppService],
})
export class AppModule {}
