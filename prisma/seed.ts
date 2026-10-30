import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();
async function main() {
  const email = 'admin@sanad.local';
  const existing = await prisma.user.findUnique({ where: { email } });
  if (!existing) await prisma.user.create({ data: { name: 'Platform Admin', email, passwordHash: await bcrypt.hash('ChangeMe123!', 12), role: Role.ADMIN } });
  console.log('Seed admin: admin@sanad.local / ChangeMe123! (change immediately)');
}
main().finally(() => prisma.$disconnect());
