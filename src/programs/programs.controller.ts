import { Controller, Get, Post, Patch, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ProgramsService } from './programs.service'; import { CreateProgramDto,UpdateProgramDto,CreateSessionDto } from './dto'; import { JwtAuthGuard,RolesGuard,Roles,CurrentUser } from '../common/auth'; import { Role } from '@prisma/client';
@Controller('programs') export class ProgramsController {
 constructor(private service:ProgramsService){}
 @Get() list(@Query('page') page='1',@Query('limit') limit='10',@Query('q') q?:string){return this.service.list(Number(page),Number(limit),q)}
 @Get('manage/mine') @UseGuards(JwtAuthGuard,RolesGuard) @Roles(Role.SUPERVISOR,Role.ADMIN) mine(@CurrentUser() u:any){return this.service.manageList(u)}
 @Get(':id') get(@Param('id') id:string){return this.service.get(id)}
 @Post() @UseGuards(JwtAuthGuard,RolesGuard) @Roles(Role.SUPERVISOR,Role.ADMIN) create(@Body() dto:CreateProgramDto,@CurrentUser() u:any){return this.service.create(dto,u)}
 @Patch(':id') @UseGuards(JwtAuthGuard,RolesGuard) @Roles(Role.SUPERVISOR,Role.ADMIN) update(@Param('id') id:string,@Body() dto:UpdateProgramDto,@CurrentUser() u:any){return this.service.update(id,dto,u)}
 @Post(':id/sessions') @UseGuards(JwtAuthGuard,RolesGuard) @Roles(Role.SUPERVISOR,Role.ADMIN) session(@Param('id') id:string,@Body() dto:CreateSessionDto,@CurrentUser() u:any){return this.service.addSession(id,dto,u)}
}
