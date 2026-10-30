import { Controller,Get,Post,Patch,Param,Query,Body,UseGuards,Req } from '@nestjs/common'; import { ApplicationsService } from './applications.service'; import { JwtAuthGuard,RolesGuard,Roles,CurrentUser } from '../common/auth'; import { Role } from '@prisma/client'; import { ReviewApplicationDto } from './dto';
@Controller('applications') @UseGuards(JwtAuthGuard,RolesGuard) export class ApplicationsController {
 constructor(private service:ApplicationsService){}
 @Get('mine') @Roles(Role.YOUTH) mine(@CurrentUser() u:any,@Query('page') p='1',@Query('limit') l='10'){return this.service.mine(u.sub,+p,+l)}
 @Post(':programId') @Roles(Role.YOUTH) apply(@Param('programId') id:string,@CurrentUser() u:any){return this.service.apply(u.sub,id)}
 @Patch(':id/cancel') @Roles(Role.YOUTH) cancel(@Param('id') id:string,@CurrentUser() u:any){return this.service.cancel(id,u.sub)}
 @Get() @Roles(Role.ADMIN,Role.SUPERVISOR) list(@CurrentUser() u:any,@Query('page') p='1',@Query('limit') l='20'){return this.service.listForReview(u,+p,+l)}
 @Patch(':id/review') @Roles(Role.ADMIN,Role.SUPERVISOR) review(@Param('id') id:string,@Body() dto:ReviewApplicationDto,@CurrentUser() u:any){return this.service.review(id,dto,u)}
}
