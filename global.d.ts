import type { PrismaClient } from '@prisma/client'

// The ideal approach would be to just use 'declare namespace NodeJS { ... }'
// (without using the 'global') and have access to the PrismaClient type via a
// reference to '@prisma/client' (see the next-env.d.ts file for an example)
// instead of using an import, but that specific reference doesn't seem to work.

declare global {
  namespace NodeJS {
    interface Global {
      prisma: PrismaClient
    }

    interface ProcessEnv extends Dict<string> {
      readonly DATABASE_URL: string
      readonly BCRYPT_IP_SALT: string
    }
  }
}
