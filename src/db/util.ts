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
};
