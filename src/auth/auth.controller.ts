import { Controller, Post, Body, UseGuards, Req, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth_credentials.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private tasksService: AuthService) {}

  @Post('/signUp')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userName: { example: '"null"' },
        passwd: { example: '"null"' },
      },
    },
  })
  signUp(@Body() dto: AuthCredentialsDto): Promise<void> {
    return this.tasksService.signUp(dto);
  }

  @Post('/signIn')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userName: { example: '"null"' },
        passwd: { example: '"null"' },
      },
    },
  })
  signIn(@Body() dto: AuthCredentialsDto): Promise<string> {
    return this.tasksService.signIn(dto);
  }

  @Post('/test')
  @UseGuards(AuthGuard())
  test(@Req() req) {
    console.log(req);
  }
}
