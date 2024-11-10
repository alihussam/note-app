import express from "express";

// run config file
import router from "./routes";
import { notFoundMiddleware } from "./middleware/notFound.middleware";
import { errorRequestMiddleware } from "./middleware/errorRequest.middleware";
import { requestLoggerMiddleware } from "./middleware/requestLogger.middleware";
import { getEnvConfig } from "./utils/env.utils";
import { associateModels } from "./models/modelAssociations";

// load config first
const { ROUTE_PREFIX } = getEnvConfig();

// associate all models
associateModels();

// create express app
const app = express();

// add json body parser
app.use(express.json());

// log requests
app.use(requestLoggerMiddleware);

// bind all routes
app.use(ROUTE_PREFIX, router);

/**
 * Bind route not found error
 */
app.use(notFoundMiddleware);

/**
 * Bind global error request handler
 */
app.use(errorRequestMiddleware);

export const expressApp = app;
