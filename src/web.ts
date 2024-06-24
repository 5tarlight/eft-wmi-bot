import express from "express";
import { WEB_PORT } from "./config";
import { getLogger } from "./log/log";

const logger = getLogger("web");
logger.debug("Starting the web server...");
const app = express();

app.get("/", (req, res) => {
  logger.trace(`GET / from ${req.ip}`);
  res.send("Hello World!");
});

export const startWebServer = () =>
  app.listen(WEB_PORT, () => {
    logger.info(`Server is running on http://localhost:${WEB_PORT}`);
  });
