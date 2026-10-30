import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto';
@Controller('auth')
export class AuthController {
 constructor(private service: AuthService) {}
 @Post('register') @Throttle({ default: { limit: 5, ttl: 60000 } }) register(@Body() dto: RegisterDto) { return this.service.register(dto); }
 @Post('login') @Throttle({ default: { limit: 5, ttl: 60000 } }) login(@Body() dto: LoginDto) { return this.service.login(dto); }
}
