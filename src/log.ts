import { Logger } from "tslog";

export const getLogger = (name: string = "") => {
  const levels = name.split(".");
  let logger = new Logger({ name: "", type: "pretty" });

  for (const level of levels) {
    logger = logger.getSubLogger({ name: level });
  }

  return logger;
};
