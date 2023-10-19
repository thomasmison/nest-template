import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { instanceToPlain } from 'class-transformer';
import { Response, Request } from 'express';

import { UserCreateRequestDto } from '../../application/dto/user/user-create-request.dto';
import { UserListResponseDto } from '../../application/dto/user/user-list-response.dto';
import { UserResponseDto } from '../../application/dto/user/user-response.dto';
import { UserAppService } from '../../application/service/user.app.service';
import { RoleEnum } from '../../domain/enum/role.enum';
import { CurrentUserId } from '../decorator/auth/jwt-claim.decorator';
import { Roles } from '../decorator/auth/roles.decorator';

@ApiTags('user')
@Controller('user')
@ApiBearerAuth('JWT-auth')
@Roles()
export class UserController {
  constructor(private userAppService: UserAppService) {}

  @ApiOperation({ summary: 'Get current User.' })
  @ApiResponse({
    type: UserResponseDto,
    status: HttpStatus.OK,
    description: 'Current User.',
  })
  @Get('me')
  async getMe(
    @Req() req: Request,
    @Res() res: Response,
    @CurrentUserId(new ParseUUIDPipe()) userId: string,
  ) {
    try {
      const user = await this.userAppService.getById(userId);

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: instanceToPlain(user),
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  }

  @ApiOperation({ summary: 'Get User by id.' })
  @ApiResponse({
    type: UserResponseDto,
    status: HttpStatus.OK,
    description: 'User list.',
  })
  @Get(':userId')
  async getUserById(
    @Req() req: Request,
    @Res() res: Response,
    @Param('userId', new ParseUUIDPipe()) userId: string,
  ) {
    try {
      const user = await this.userAppService.getById(userId);

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: instanceToPlain(user),
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  }

  @ApiOperation({ summary: 'Get all users.' })
  @ApiResponse({
    type: UserListResponseDto,
    status: HttpStatus.OK,
  })
  @Get()
  @ApiBearerAuth('JWT-auth')
  async getAllUsers(@Req() req: Request, @Res() res: Response) {
    try {
      const users = await this.userAppService.getList();

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        ...instanceToPlain(users),
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  }

  @Roles([RoleEnum.Admin])
  @ApiOperation({ summary: 'Create an user.' })
  @ApiResponse({
    type: UserResponseDto,
    status: HttpStatus.CREATED,
  })
  @Post()
  async createUser(
    @Req() req: Request,
    @Res() res: Response,
    @Body(new ValidationPipe()) userCreateDto: UserCreateRequestDto,
  ) {
    try {
      const user = await this.userAppService.create(userCreateDto);

      return res.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        data: instanceToPlain(user),
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  }
}
