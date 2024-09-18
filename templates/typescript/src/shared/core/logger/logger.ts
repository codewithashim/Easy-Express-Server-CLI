import { envConfig } from '../../config/environment.config';
import path from 'path';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const { combine, timestamp, printf, errors, colorize } = winston.format;

const fileFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} ${level.toUpperCase()}: ${stack || message}`;
});

const consoleFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} ${level}: ${stack || message}`;
});

const rotateTransport = new DailyRotateFile({
    filename: path.join(process.cwd(), envConfig.logger.logDir, `${envConfig.logger.logFilePrefix}-%DATE%.log`),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: envConfig.logger.maxSize,
    maxFiles: envConfig.logger.maxFiles,
    level: 'info',
});

const logger = winston.createLogger({
    level: 'info',
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
        errors({ stack: true }),
        fileFormat
    ),
    transports: [rotateTransport],
});

if (envConfig.nodeEnv !== 'production') {
    logger.add(new winston.transports.Console({
        format: combine(
            timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
            errors({ stack: true }),
            colorize({ all: true }),
            consoleFormat
        ),
        level: 'debug',
    }));
}

const stream = {
    write: (message: string) => {
        logger.info(message.trim());
    },
};

export { logger, stream };