import { Controller,Get,Post,Body,Query,UseGuards } from '@nestjs/common'; import { AnnouncementsService } from './announcements.service'; import { JwtAuthGuard,RolesGuard,Roles,CurrentUser } from '../common/auth'; import { Role } from '@prisma/client'; import { IsString,IsOptional,IsIn,MaxLength } from 'class-validator';
class CreateAnnouncementDto { @IsString() @MaxLength(180) title!:string; @IsString() @MaxLength(10000) body!:string; @IsOptional() @IsIn(['GENERAL','PROGRAM']) scope?:'GENERAL'|'PROGRAM'; @IsOptional() @IsString() programId?:string; }
@Controller('announcements') export class AnnouncementsController {constructor(private service:AnnouncementsService){}
 @Get() list(@Query('page') p='1',@Query('limit') l='20',@CurrentUser() u?:any){return this.service.list(u,+p,+l)}
 @Post() @UseGuards(JwtAuthGuard,RolesGuard) @Roles(Role.ADMIN,Role.SUPERVISOR) create(@Body() dto:CreateAnnouncementDto,@CurrentUser() u:any){return this.service.create(dto,u)}
}
