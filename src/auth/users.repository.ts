import { DataSource, Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import * as bcrypt from 'bcrypt';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadInterface } from './dto/jwt-payload.interface';

@Injectable()
export class UsersRepository extends Repository<UserEntity> {
  constructor(
    private dataSource: DataSource,
    private jwtService: JwtService,
  ) {
    super(UserEntity, dataSource.createEntityManager());
  }

  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    // hash the password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.create({ username, password: hashedPassword });
    try {
      await this.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validateUserPassword(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialsDto;
    try {
      const user = await this.findOne({ where: { username } });

      if (user && (await bcrypt.compare(password, user.password))) {
        const payload: JwtPayloadInterface = { username };
        const accessToken: string = this.jwtService.sign(payload);
        return { accessToken };
      } else {
        throw new UnauthorizedException('Invalid credentials');
      }
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
