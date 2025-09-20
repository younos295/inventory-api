import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const byEmail = await this.userRepo.findOne({ where: { email: dto.email } });
    if (byEmail) throw new ConflictException('Email already registered');
    const byUsername = await this.userRepo.findOne({ where: { username: dto.username } });
    if (byUsername) throw new ConflictException('Username already taken');
    const hash = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({ ...dto, password: hash });
    // In case of a race condition, saving may still throw a unique constraint error.
    try {
      await this.userRepo.save(user);
    } catch (err: any) {
      // Postgres unique violation
      if (err && (err.code === '23505' || err?.driverError?.code === '23505')) {
        const detail: string | undefined = err.detail || err?.driverError?.detail;
        if (detail?.includes('(email)')) {
          throw new ConflictException('Email already registered');
        }
        if (detail?.includes('(username)')) {
          throw new ConflictException('Username already taken');
        }
        throw new ConflictException('Duplicate value');
      }
      throw err;
    }
    // Return safe public fields so interceptor wraps meaningful data
    const { id, email, username } = user;
    return { id, email, username };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refresh_token);
    return tokens;
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) throw new UnauthorizedException('Refresh token missing');
    const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');
    let payload: any;
    try {
      payload = await this.jwtService.verifyAsync(refreshToken, { secret: refreshSecret });
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const user = await this.userRepo.findOne({ where: { id: payload.sub } });
    if (!user || !user.refreshTokenHash) throw new UnauthorizedException('Invalid refresh token');
    const isMatch = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!isMatch) throw new UnauthorizedException('Invalid refresh token');
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refresh_token);
    return tokens;
  }

  private async getTokens(userId: number, email: string) {
    const accessSecret = this.configService.get<string>('JWT_SECRET');
    const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');
    const accessToken = await this.jwtService.signAsync(
      { sub: userId, email },
      { secret: accessSecret, expiresIn: '60m' },
    );
    const refreshToken = await this.jwtService.signAsync(
      { sub: userId, email },
      { secret: refreshSecret, expiresIn: '7d' },
    );
    return { access_token: accessToken, refresh_token: refreshToken };
  }

  private async updateRefreshToken(userId: number, refreshToken: string) {
    const hash = await bcrypt.hash(refreshToken, 10);
    await this.userRepo.update({ id: userId }, { refreshTokenHash: hash });
  }
}

