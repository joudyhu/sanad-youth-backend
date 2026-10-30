import {
Injectable,
NotFoundException,
ForbiddenException,
BadRequestException,
Inject,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.module';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ProgramsService {
constructor(
private readonly prisma: PrismaService,
@Inject(CACHE_MANAGER) private readonly cache: Cache,
) {}

async list(page = 1, limit = 10, q?: string) {
page = Math.max(1, page);
limit = Math.min(50, Math.max(1, limit));

const cacheKey = `programs:${page}:${limit}:${q || ''}`;
const cached = await this.cache.get<any>(cacheKey);

if (cached) {
  return cached;
}

const where: any = {
  isPublished: true,
  ...(q
    ? {
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
        ],
      }
    : {}),
};

const [items, total] = await this.prisma.$transaction([
  this.prisma.program.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      description: true,
      imagePath: true,
      capacity: true,
      reservedSeats: true,
      supervisor: {
        select: { id: true, name: true },
      },
      sessions: {
        orderBy: { startsAt: 'asc' },
      },
      createdAt: true,
      updatedAt: true,
    },
  }),
  this.prisma.program.count({ where }),
]);

const result = {
  items,
  meta: {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  },
};

await this.cache.set(cacheKey, result, 30000);
return result;


}

async get(id: string) {
const cacheKey = `program:${id}`;
const cached = await this.cache.get<any>(cacheKey);


if (cached) {
  return cached;
}

const program = await this.prisma.program.findFirst({
  where: { id, isPublished: true },
  include: {
    supervisor: {
      select: { id: true, name: true },
    },
    sessions: {
      orderBy: { startsAt: 'asc' },
    },
  },
});

if (!program) {
  throw new NotFoundException('Program not found');
}

const result = {
  ...program,
  remainingSeats: program.capacity - program.reservedSeats,
};

await this.cache.set(cacheKey, result, 30000);
return result;


}

private async invalidateProgramCache(): Promise<void> {
// Cache Manager v5 لا يوفر clear() على الواجهة Cache.
// نحذف المفاتيح المعروفة للبرامج عند تعديلها.
const store = this.cache as any;


if (typeof store.store?.keys === 'function') {
  const keys: string[] = await store.store.keys('*');

  await Promise.all(
    keys
      .filter((key) => key.startsWith('programs:') || key.startsWith('program:'))
      .map((key) => this.cache.del(key)),
  );
  return;
}

// إذا كان مخزن الكاش لا يدعم استعراض المفاتيح،
// تنتهي صلاحية عناصر الكاش تلقائيًا بعد 30 ثانية.


}

async create(dto: any, user: any) {
const result = await this.prisma.program.create({
data: {
...dto,
supervisorId:
user.role === 'ADMIN' && dto.supervisorId
? dto.supervisorId
: user.sub,
},
});


await this.invalidateProgramCache();
return result;


}

async update(id: string, dto: any, user: any) {
const program = await this.prisma.program.findUnique({
where: { id },
});


if (!program) {
  throw new NotFoundException();
}

if (user.role !== 'ADMIN' && program.supervisorId !== user.sub) {
  throw new ForbiddenException();
}

if (
  dto.capacity !== undefined &&
  dto.capacity < program.reservedSeats
) {
  throw new BadRequestException(
    'Capacity cannot be below reserved seats',
  );
}

const result = await this.prisma.program.update({
  where: { id },
  data: dto,
});

await this.invalidateProgramCache();
return result;


}

async addSession(id: string, dto: any, user: any) {
const program = await this.prisma.program.findUnique({
where: { id },
});


if (!program) {
  throw new NotFoundException();
}

if (user.role !== 'ADMIN' && program.supervisorId !== user.sub) {
  throw new ForbiddenException();
}

if (new Date(dto.endsAt) <= new Date(dto.startsAt)) {
  throw new BadRequestException(
    'endsAt must be after startsAt',
  );
}

const result = await this.prisma.session.create({
  data: {
    programId: id,
    startsAt: new Date(dto.startsAt),
    endsAt: new Date(dto.endsAt),
    location: dto.location,
    meetingUrl: dto.meetingUrl,
  },
});

await this.invalidateProgramCache();
return result;


}

async manageList(user: any) {
return this.prisma.program.findMany({
where: user.role === 'ADMIN' ? {} : { supervisorId: user.sub },
include: { sessions: true },
orderBy: { createdAt: 'desc' },
});
}
}
