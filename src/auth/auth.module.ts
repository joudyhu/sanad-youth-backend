import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard, RolesGuard } from '../common/auth';
@Module({ imports: [JwtModule.registerAsync({ useFactory: (c: ConfigService) => ({ secret: c.getOrThrow('JWT_SECRET'), signOptions: { expiresIn: c.get('JWT_EXPIRES_IN', '1d') } }), inject: [ConfigService] })], controllers: [AuthController], providers: [AuthService, JwtAuthGuard, RolesGuard], exports: [JwtModule, JwtAuthGuard, RolesGuard] })
export class AuthModule {}
