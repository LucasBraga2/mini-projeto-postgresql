import { PrismaClient } from '@prisma/client';

// Adiciona logs de queries quando em desenvolvimento
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : [],
});

export default prisma;