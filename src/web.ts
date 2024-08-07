import express from "express";
import { WEB_PORT } from "./config";
import { getLogger } from "./log/log";
import { routes } from "./routes/routes";
import cors from "cors";

const logger = getLogger("web");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const registerRoutes = () => {
  logger.debug("Registering routes...");

  routes.forEach((route) => {
    app[route.method](route.url, route.handler);
    logger.trace(
      `Route ${route.url} (${route.method.toUpperCase()}) registered`
    );
  });

  logger.debug("HTTP routes registration completed");
};

export const startWebServer = () => {
  logger.debug("Starting the web server...");
  registerRoutes(),
    app.listen(WEB_PORT, () => {
      logger.info(`HTTP server is running on http://localhost:${WEB_PORT}`);
    });
};
