import { Logger } from "tslog";
import * as fs from "fs";
import { LOG_DIR } from "./config";
import { join } from "path";
import * as tar from "tar";

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

interface LogFile {
  name: string;
  date: Date;
  size: number;
  type: "file" | "archive";
}

const parseDate = (name: string) => {
  const [year, month, day] = name.split("-").map((part) => parseInt(part));
  return new Date(year, month - 1, day);
};

const getSize = (name: string) => {
  return fs.statSync(join(getLogDir(), name)).size;
};

const getLogFiles = (): LogFile[] => {
  const names = fs.readdirSync(getLogDir());
  const dates = names.map(parseDate);
  const sizes = names.map(getSize);

  return names.map((name, index) => ({
    name,
    date: dates[index],
    size: sizes[index],
    type: name.endsWith(".log") ? "file" : "archive",
  }));
};

const getDateDiff = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  return days;
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

export const cleanLogs = () => {
  const logger = getLogger("log");
  logger.debug("Cleaning logs...");
  const files = getLogFiles();
  let totalSize = files.reduce((acc, file) => acc + file.size, 0);
  let unit = "bytes";
  let floorDigit = 0;

  if (totalSize > 1024) {
    totalSize /= 1024;
    unit = "KB";
    floorDigit = 2;
  }

  if (totalSize > 1024) {
    totalSize /= 1024;
    unit = "MB";
    floorDigit = 4;
  }

  const logSize =
    Math.floor(totalSize * Math.pow(10, floorDigit)) / Math.pow(10, floorDigit);
  const archives = files.filter((file) => file.type === "archive");
  const logFiles = files.filter((file) => file.type === "file");
  logger.debug(
    `Found ${logFiles.length} logs, ${archives.length} archives, total size: ${logSize} ${unit}`
  );

  for (const file of logFiles) {
    const diff = getDateDiff(file.date);
    logger.silly(`File ${file.name} is ${diff} days old`);

    if (diff >= 7 && diff < 30) {
      const archiveName = `${file.name.replace(".log", "")}.tar.gz`;
      tar.c({ gzip: true, file: join(getLogDir(), archiveName) }, [
        join(getLogDir(), file.name),
      ]);
      fs.unlinkSync(join(getLogDir(), file.name));

      const archiveSize = fs.statSync(join(getLogDir(), archiveName)).size;

      let saved = file.size - archiveSize;
      let savedUnit = "bytes";

      if (saved > 1024) {
        saved /= 1024;
        savedUnit = "KB";
      }

      logger.debug(
        `Archived log file ${file.name} to ${archiveName}. Saved ${Math.floor(saved)} ${savedUnit}.`
      );
    }
  }
};
