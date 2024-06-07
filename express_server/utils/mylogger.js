import winston from 'winston';

export const myLogger = (() =>  { 
  
  if (process.env.NODE_ENV === 'test') {
    return winston.createLogger({
      transports: [
        new winston.transports.Console({
          silent: true,
        }),
      ],
    });
  }
  
  return winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/request.log', level: 'info'}),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
  ],
})
})();
