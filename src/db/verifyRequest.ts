import { Request } from "express";
import { getLogger } from "../log/log";
import { db } from "./Database";

export interface VerifyRequest {
  identify_code: string;
  verify_code: string;
}

const logger = getLogger("db.verifyRequest");

export const insertVerifyRequest = (req: Request, data: VerifyRequest) => {
  logger.debug("Inserting verify request", data);

  const query = `
    INSERT INTO verify_requests (identify_code, verify_code)
    VALUES (?, ?)
  `;

  return db.run(query, [data.identify_code, data.verify_code]);
};
