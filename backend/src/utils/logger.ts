import winston from 'winston';
import Transport from 'winston-transport';
import { LogstashTransport } from 'winston-logstash-transport';

const createLogger = () => {
  const options = {
    console: {
      level: 'debug',
      handleExceptions: true,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message }) => {
          return `${timestamp} ${level}: ${message}`;
        })
      )
    },
    logstash: {
      level: 'info',
      host: process.env.LOGSTASH_HOST || 'localhost',
      port: 5000,
      protocol: 'tcp'
    }
  };

  const transports: Transport[] = [
    new winston.transports.Console(options.console),
    new LogstashTransport(options.logstash)
  ];

  return winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    transports,
    exitOnError: false
  });
};

export const logger = createLogger();