import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProgramsModule } from './programs/programs.module';
import { ApplicationsModule } from './applications/applications.module';
import { AnnouncementsModule } from './announcements/announcements.module';
import { UploadsModule } from './uploads/uploads.module';
import { AdminModule } from './admin/admin.module';
@Module({ imports: [ConfigModule.forRoot({ isGlobal: true }), CacheModule.register({ isGlobal: true, ttl: 30000 }), ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]), PrismaModule, AuthModule, ProgramsModule, ApplicationsModule, AnnouncementsModule, UploadsModule, AdminModule] })
export class AppModule {}
