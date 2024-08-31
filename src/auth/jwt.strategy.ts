import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UsersRepository } from './users.repository';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayloadInterface } from './dto/jwt-payload.interface';
import { UserEntity } from './user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersRepository: UsersRepository) {
    super({
      secretOrKey: 'nqmgaming',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayloadInterface): Promise<UserEntity> {
    const { username } = payload;

    const user: UserEntity = await this.usersRepository.findOne({
      where: { username },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
