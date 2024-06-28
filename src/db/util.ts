import { db } from "./Database";

export const promiseDb = {
  run: (query: string, params: any[] = []) =>
    new Promise((resolve, reject) => {
      db.run(query, params, function (err) {
        if (err) reject(err);
        else resolve(this);
      });
    }),

  close: () =>
    new Promise<void>((resolve, reject) => {
      db.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    }),

  get: <T>(query: string, params: any[] = []) =>
    new Promise<T>((resolve, reject) => {
      db.get<T>(query, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    }),

  all: <T>(query: string, params: any[] = []) =>
    new Promise<T[]>((resolve, reject) => {
      db.all<T>(query, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    }),

  insert: (query: string, params: any[] = []) =>
    new Promise<number>((resolve, reject) => {
      db.run(query, params, function (err) {
        if (err) reject(err);
        else resolve(this.lastID);
      });
    }),

  update: (query: string, params: any[] = []) =>
    new Promise<number>((resolve, reject) => {
      db.run(query, params, function (err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
    }),

  delete: (query: string, params: any[] = []) =>
    new Promise<number>((resolve, reject) => {
      db.run(query, params, function (err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
    }),
};
