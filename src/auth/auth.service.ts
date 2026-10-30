import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.module';
import * as bcrypt from 'bcrypt';
import { RegisterDto, LoginDto } from './dto';
@Injectable()
export class AuthService {
 constructor(private prisma: PrismaService, private jwt: JwtService) {}
 async register(dto: RegisterDto) {
  const email = dto.email.toLowerCase().trim();
  if (await this.prisma.user.findUnique({ where: { email } })) throw new ConflictException('Email already registered');
  const user = await this.prisma.user.create({ data: { name: dto.name.trim(), email, passwordHash: await bcrypt.hash(dto.password, 12), role: 'YOUTH' }, select: { id:true,name:true,email:true,role:true,createdAt:true } });
  return { user, accessToken: await this.jwt.signAsync({ sub:user.id, email:user.email, role:user.role }) };
 }
 async login(dto: LoginDto) {
  const user = await this.prisma.user.findUnique({ where: { email: dto.email.toLowerCase().trim() } });
  if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) throw new UnauthorizedException('Invalid email or password');
  return { user: { id:user.id,name:user.name,email:user.email,role:user.role }, accessToken: await this.jwt.signAsync({ sub:user.id,email:user.email,role:user.role }) };
 }
}
