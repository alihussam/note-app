import { expressApp } from "./app";
import Logger from "./libs/logger.lib";

const logger = Logger.getInstance();

/**
 * Init server
 */
async function initServer() {
  try {
    const PORT = process.env.PORT || 3000;

    expressApp.listen(PORT, () => {
      logger.info(`Note App Listening on Port ${PORT}`);
    });
  } catch (error) {
    logger.error(`An error occurred: ${JSON.stringify(error)}`);
    process.exit(1);
  }
}

/**
 * Bind uncaught exception handler
 */
process.on("uncaughtException", (error) => {
  logger.error("Uncaught exception error", JSON.stringify(error));
});

/**
 * Bind un-handled promise rejection handler
 */
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled promise rejection", reason);
});

/**
 * Bind interrupt signal handler for graceful termination
 */
process.on("SIGINT", () => {
  logger.info(`Service gracefully terminated`);
  process.exit(0);
});

initServer();
