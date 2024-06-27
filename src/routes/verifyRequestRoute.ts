import { Request, RequestHandler } from "express";
import { getLogger } from "../log/log";
import {
  findVerifyRequestByIdentifyCode,
  insertVerifyRequest,
} from "../db/verifyRequest";

const logger = getLogger("routes.verifyRequest");

export interface VerifyRequestBody {
  identify_code: string;
  verify_code: string;
}

export const verifyRequestHandler: RequestHandler = async (
  req: Request<{}, {}, VerifyRequestBody>,
  res
) => {
  logger.trace("Received a verify request from IP:", req.ip);

  const prevReq = await findVerifyRequestByIdentifyCode(req.body.identify_code);
  if (prevReq) {
    logger.debug("Verify request already exists", prevReq);
    res.status(409).send("Verify request already exists");
    return;
  }

  await insertVerifyRequest(req.body);
  res.status(201).send("Verify request inserted successfully");

  logger.debug("Verify request inserted successfully");
};
