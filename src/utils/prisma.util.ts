import { PrismaClient } from "prisma/generated/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import 'dotenv/config'
import type { LogEvent, QueryEvent } from "prisma/generated/internal/prismaNamespace.js";
import { logger } from "./winston.util.js";

const adapter = new PrismaPg({
    connectionString: process.env['DATABASE_URL'],
})

export const prismaClient = new PrismaClient({
    adapter,
    log: [
        {
            level: 'error',
            emit: 'event',
        },
        {
            level: 'warn',
            emit: 'event',
        },
        {
            level: 'info',
            emit: 'event',
        },
        {
            level: 'query',
            emit: 'event',
        },
    ]
})

prismaClient.$on('error', (event: LogEvent) => {
    logger.error(event.message);
})

prismaClient.$on('warn', (event: LogEvent) => {
    logger.warn(event.message);
})

prismaClient.$on('info', (event: LogEvent) => {
    logger.info(event.message);
})

prismaClient.$on('query', (event: QueryEvent) => {
    logger.info(event.query);
})