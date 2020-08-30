import winston from "winston";

const options = {
  error: {
    level: "http",
    filename: "src/logs/app.log",
    handleExceptions: true,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}`
      )
    ),
  },
  console: {
    level: "debug",
    handleExceptions: true,
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp(),
      winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}`
      )
    ),
  },
};

const logger = winston.createLogger({
  transports: [
    new winston.transports.File(options.error),
    new winston.transports.Console(options.console),
  ],
  exitOnError: false,
});

const stream = {
  write: (message: string) => {
    logger.info(message);
  },
};

winston.addColors({
  error: "red",
  warn: "yellow",
  info: "cyan",
  debug: "green",
});

export { logger, stream };
