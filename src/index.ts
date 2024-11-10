import { expressApp } from "./app";

/**
 * Init server
 */
async function initServer() {
  try {
    const PORT = process.env.PORT || 3000;

    expressApp.listen(PORT, () => {
      console.log(`Note App Listening on Port ${PORT}`);
    });
  } catch (error) {
    console.error(`An error occurred: ${JSON.stringify(error)}`);
    process.exit(1);
  }
}

/**
 * Bind uncaught exception handler
 */
process.on("uncaughtException", (error) => {
  console.error("Uncaught exception error", JSON.stringify(error));
});

/**
 * Bind un-handled promise rejection handler
 */
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled promise rejection", reason);
});

/**
 * Bind interrupt signal handler for graceful termination
 */
process.on("SIGINT", () => {
  console.log(`Service gracefully terminated`);
  process.exit(0);
});

initServer();
