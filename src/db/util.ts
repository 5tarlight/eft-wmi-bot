import { getLogger } from "../log/log";
import { db } from "./Database";

const logger = getLogger("db.util");

export const promiseDb = {
  run: (query: string, params: any[] = []) =>
    new Promise((resolve, reject) => {
      logger.trace("Running query:", query, params);
      db.run(query, params, function (err) {
        if (err) reject(err);
        else resolve(this);
      });
    }),

  close: () =>
    new Promise<void>((resolve, reject) => {
      logger.trace("Closing database...");
      db.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    }),

  get: <T>(query: string, params: any[] = []) =>
    new Promise<T>((resolve, reject) => {
      logger.trace("Getting row:", query, params);
      db.get<T>(query, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    }),

  all: <T>(query: string, params: any[] = []) =>
    new Promise<T[]>((resolve, reject) => {
      logger.trace("Getting all rows:", query, params);
      db.all<T>(query, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    }),

  insert: (query: string, params: any[] = []) =>
    new Promise<number>((resolve, reject) => {
      logger.trace("Inserting row:", query, params);
      db.run(query, params, function (err) {
        if (err) reject(err);
        else resolve(this.lastID);
      });
    }),

  update: (query: string, params: any[] = []) =>
    new Promise<number>((resolve, reject) => {
      logger.trace("Updating row:", query, params);
      db.run(query, params, function (err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
    }),

  delete: (query: string, params: any[] = []) =>
    new Promise<number>((resolve, reject) => {
      logger.trace("Deleting row:", query, params);
      db.run(query, params, function (err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
    }),
};
