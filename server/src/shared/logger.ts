import path from "path";
import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import dotenv from "dotenv";

dotenv.config();

const { combine, timestamp, label, printf, errors } = format;

// Custom Log Format
const myFormat = printf(({ level, message, label, timestamp, stack }) => {
  const date = new Date(timestamp);
  const hour = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  return `${date.toDateString()} ${hour}:${minutes}:${seconds} [${label}] ${level}: ${stack || message}`;
});

const createTransport = (level: string, filename: string) => {
  return new DailyRotateFile({
    level,
    filename: path.join(process.cwd(), "logs", filename, `Easy-Express-%DATE%-${level}.log`),
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
  });
};

const createTransports = () => {
  const transportList = [
    new transports.Console(),
    createTransport("info", "success"),
    createTransport("error", "errors"),
  ];

  return transportList;
};

const logger = createLogger({
  level: "info",
  format: combine(
    label({ label: "Easy Express Server" }),
    timestamp(),
    errors({ stack: true }), 
    myFormat
  ),
  transports: createTransports(),
  exceptionHandlers: [
    new transports.Console(),
    createTransport("exceptions", "exceptions"),
  ],
  rejectionHandlers: [
    new transports.Console(),
    createTransport("rejections", "rejections"),
  ],
});
 
const errorLogger = createLogger({
  level: "error",
  format: combine(
    label({ label: "Easy Express Server" }),
    timestamp(),
    errors({ stack: true }),
    myFormat
  ),
  transports: createTransports(),
});

export { logger, errorLogger };
