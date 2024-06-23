import { Logger } from "tslog";
import * as fs from "fs";
import { LOG_DIR } from "./config";
import { join } from "path";

const checkLogDir = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const getLogDir = () => {
  const dir = LOG_DIR || "./logs";
  checkLogDir(dir);
  return dir;
};

const getLogFileName = () => {
  const date = new Date();
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}.log`;
};

const getLogFilePath = () => {
  return join(getLogDir(), getLogFileName());
};

export const getLogger = (name: string = "") => {
  const levels = name.split(".");
  let logger = new Logger({ name: "", type: "pretty" });

  for (const level of levels) {
    logger = logger.getSubLogger({ name: level });

    logger.attachTransport((log) => {
      fs.appendFileSync(getLogFilePath(), JSON.stringify(log) + "\n");
    });
  }

  return logger;
};
