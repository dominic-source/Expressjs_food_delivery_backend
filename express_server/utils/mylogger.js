import winston from 'winston';

export const myLogger = (() =>  winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
  transports: [
    new winston.transports.File({ filename: 'logs/request.log', level: 'info'}),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
  ],
}))();
