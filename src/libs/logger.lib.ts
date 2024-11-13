import winston from "winston";

class Logger {
  private static instance: winston.Logger;

  private constructor() {}

  public static getInstance(): winston.Logger {
    // return if already initialized
    if (Logger.instance) return Logger.instance;

    // init logger
    Logger.instance = winston.createLogger({
      level: "info",
      format: winston.format.combine(
        winston.format.label(),
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [new winston.transports.Console()],
    });

    return Logger.instance;
  }
}

export default Logger;
