import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth_credentials.dto';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  /*
   * GET
   */

  async getUsers(): Promise<User[]> {
    const query = this.repository.createQueryBuilder('users');

    return query.getMany();
  }

  async getUser(user: User): Promise<User> {
    const { id } = user;
    try {
      const found = await this.repository.findOne({ where: { id } });

      if (!found) {
        throw new NotFoundException();
      }

      return found;
    } catch (ex) {
      throw new NotFoundException();
    }
  }

  /*
   * POST
   */

  async signUp(dto: AuthCredentialsDto): Promise<void> {
    const { userName, passwd } = dto;

    const salt = await bcrypt.genSalt();
    const hashedPasswd = await bcrypt.hash(passwd, salt);

    const user = this.repository.create({ userName, passwd: hashedPasswd });

    try {
      await this.repository.save(user);
    } catch (ex) {
      if (ex.code == 23505) {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn(dto: AuthCredentialsDto): Promise<string> {
    const { userName, passwd } = dto;

    const user = await this.repository.findOneBy({ userName });

    if (user && (await bcrypt.compare(passwd, user.passwd))) {
      const payload: JwtPayload = { userName };
      const accessToken: string = this.jwtService.sign(payload);

      return accessToken;
    } else {
      throw new UnauthorizedException('Please check your username or passwd');
    }
  }
}
