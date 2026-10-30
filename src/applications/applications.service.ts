import { Injectable, NotFoundException, ForbiddenException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.module';
@Injectable() export class ApplicationsService {
 constructor(private prisma:PrismaService){}
 async mine(userId:string,page=1,limit=10){page=Math.max(1,page);limit=Math.min(50,Math.max(1,limit));const where={userId};const [items,total]=await this.prisma.$transaction([this.prisma.application.findMany({where,skip:(page-1)*limit,take:limit,orderBy:{createdAt:'desc'},include:{program:{select:{id:true,title:true,imagePath:true,sessions:{orderBy:{startsAt:'asc'}}}}}}),this.prisma.application.count({where})]);return {items,meta:{page,limit,total,totalPages:Math.ceil(total/limit)}}}
 async apply(userId:string,programId:string,cvPath?:string){
  const existing=await this.prisma.application.findUnique({where:{userId_programId:{userId,programId}}}); if(existing) throw new ConflictException('You have already applied to this program');
 
  try { return await this.prisma.$transaction(async tx=>{
    const p=await tx.program.findFirst({where:{id:programId,isPublished:true}}); if(!p) throw new NotFoundException('Program not found or unpublished');
  
    const changed=await tx.program.updateMany({where:{id:programId,reservedSeats:{lt:p.capacity}},data:{reservedSeats:{increment:1}}});
 
    if(changed.count!==1) throw new ConflictException('No seats remaining');
    return tx.application.create({data:{userId,programId,cvPath},include:{program:{select:{id:true,title:true}}}});
  },{isolationLevel:'Serializable'}); } catch(e:any){if(e?.code==='P2002') throw new ConflictException('You have already applied to this program'); if(e?.code==='P2034') throw new ConflictException('Concurrent update; please retry'); throw e;}
 }

 async cancel(id:string,userId:string){return this.prisma.$transaction(async tx=>{const a=await tx.application.findUnique({where:{id}});if(!a)throw new NotFoundException();if(a.userId!==userId)throw new ForbiddenException();if(a.status==='CANCELLED')return a;if(a.status!=='PENDING')throw new BadRequestException('Only pending applications can be cancelled');const updated=await tx.application.update({where:{id},data:{status:'CANCELLED'}});await tx.program.update({where:{id:a.programId},data:{reservedSeats:{decrement:1}}});return updated;});}
 async review(id:string,dto:any,reviewer:any){return this.prisma.$transaction(async tx=>{const a=await tx.application.findUnique({where:{id},include:{program:true}});if(!a)throw new NotFoundException();if(reviewer.role!=='ADMIN'&&a.program.supervisorId!==reviewer.sub)throw new ForbiddenException();if(a.status!=='PENDING')throw new BadRequestException('Only pending applications can be reviewed');if(!['ACCEPTED','REJECTED'].includes(dto.status))throw new BadRequestException('status must be ACCEPTED or REJECTED');const updated=await tx.application.update({where:{id},data:{status:dto.status,reviewedById:reviewer.sub,reviewNote:dto.reviewNote}});if(dto.status==='REJECTED')await tx.program.update({where:{id:a.programId},data:{reservedSeats:{decrement:1}}});return updated;});}
 async listForReview(user:any,page=1,limit=20){page=Math.max(1,page);limit=Math.min(50,Math.max(1,limit));const where:any=user.role==='ADMIN'?{}:{program:{supervisorId:user.sub}};const [items,total]=await this.prisma.$transaction([this.prisma.application.findMany({where,skip:(page-1)*limit,take:limit,orderBy:{createdAt:'asc'},include:{user:{select:{id:true,name:true,email:true}},program:{select:{id:true,title:true,supervisorId:true}}}}),this.prisma.application.count({where})]);return {items,meta:{page,limit,total,totalPages:Math.ceil(total/limit)}};}
}
