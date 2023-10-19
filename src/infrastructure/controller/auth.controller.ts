import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { instanceToPlain } from 'class-transformer';
import { Request, Response } from 'express';

import { AuthTokenResponseDto } from '../../application/dto/auth/auth-token-response.dto';
import { RefreshAuthRequestDto } from '../../application/dto/auth/refresh-auth-request.dto';
import { SignInRequestDto } from '../../application/dto/auth/sign-in-request.dto';
import { AuthService } from '../../application/service/auth.service';
import { Roles } from '../decorator/auth/roles.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Authenticate user using username and password' })
  @ApiResponse({
    type: AuthTokenResponseDto,
    status: HttpStatus.OK,
    description: 'Authentication tokens.',
  })
  @Post('sign-in')
  @Roles('public')
  async signIn(
    @Req() req: Request,
    @Res() res: Response,
    @Body(ValidationPipe) signInRequest: SignInRequestDto,
  ) {
    try {
      const tokens = await this.authService.signIn(signInRequest);

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: instanceToPlain(tokens),
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  }

  @ApiOperation({ summary: 'Refresh authentication tokens' })
  @ApiResponse({
    type: AuthTokenResponseDto,
    status: HttpStatus.OK,
  })
  @Post('refresh')
  @Roles('public')
  async refresh(
    @Req() req: Request,
    @Res() res: Response,
    @Body(ValidationPipe) refreshAuthRequest: RefreshAuthRequestDto,
  ) {
    try {
      const tokens = await this.authService.refresh(
        refreshAuthRequest.refreshToken,
      );

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: instanceToPlain(tokens),
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  }
}
