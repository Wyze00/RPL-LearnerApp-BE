import winston from 'winston'
import wdrf from 'winston-daily-rotate-file';

export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.printf((log) => {
        return `[${new Date().toISOString()}] [${log.level}] [${log.message}]`
    }),
    transports: [
        new winston.transports.Console({}),
        new winston.transports.File({
            level:'error',
            filename: './log/error.log',
            handleExceptions: true,
            handleRejections: true,
        }),
        new wdrf ({
            filename: './log/app-%DATE%.log',
            zippedArchive: true,
            maxSize: '1m',
            maxFiles: '14d',
        })
    ]
})