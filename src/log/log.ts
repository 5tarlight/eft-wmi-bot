import { Logger } from "tslog";
import * as fs from "fs";
import { LOG_DIR } from "../config";
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

const getSize = async (name: string) => {
  return await fs.promises
    .stat(join(getLogDir(), name))
    .then((stat) => stat.size);
};

const getLogFiles = async (): Promise<LogFile[]> => {
  const names = await fs.promises.readdir(getLogDir());
  const dates = names.map(parseDate);

  const files: LogFile[] = [];

  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    const date = dates[i];
    const size = await getSize(name);
    const type = name.endsWith(".tar.gz") ? "archive" : "file";

    if (!name.endsWith(".log") && !name.endsWith(".tar.gz")) {
      continue;
    }

    files.push({ name, date, size, type });
  }

  return files;
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

    logger.attachTransport(async (log) => {
      await fs.promises.appendFile(
        getLogFilePath(),
        JSON.stringify(log) + "\n"
      );
    });
  }

  return logger;
};

export const cleanLogs = async () => {
  const logger = getLogger("log");
  logger.debug("Cleaning logs...");
  const files = await getLogFiles();

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
      await fs.promises.unlink(join(getLogDir(), file.name));

      const archiveSize = (
        await fs.promises.stat(join(getLogDir(), archiveName))
      ).size;
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

  for (const file of archives) {
    const diff = getDateDiff(file.date);
    logger.silly(`Archive ${file.name} is ${diff} days old`);

    if (diff >= 30) {
      let size = await getSize(file.name);
      let unit = "bytes";

      if (size > 1024) {
        size /= 1024;
        unit = "KB";
      }

      await fs.promises.unlink(join(getLogDir(), file.name));
      logger.debug(
        `Deleted archive ${file.name}. Saved ${Math.floor(size)} ${unit}.`
      );
    }
  }
};
