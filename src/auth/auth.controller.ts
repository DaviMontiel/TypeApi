import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth_credentials.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { User } from './user.entity';
import { GetUser } from './get-user.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private tasksService: AuthService) {}

  /*
   *  POST
   */

  @Get()
  getUsers(): Promise<User[]> {
    return this.tasksService.getUsers();
  }

  @Get('/getCurrent')
  @UseGuards(AuthGuard())
  getMyUser(@GetUser() user: User): Promise<User> {
    return this.tasksService.getUser(user);
  }

  /*
   *  POST
   */

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
