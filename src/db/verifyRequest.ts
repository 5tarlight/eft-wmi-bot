import { getLogger } from "../log/log";
import { VerifyRequestTable } from "./Database";
import { VERIFY_TABLE } from "./dbConst";
import { promiseDb } from "./util";

export interface VerifyRequest {
  identify_code: string;
  verify_code: string;
}

const logger = getLogger("db.verifyRequest");

export const insertVerifyRequest = async (data: VerifyRequest) => {
  logger.debug("Inserting verify request", data);

  const query = `
    INSERT INTO ${VERIFY_TABLE} (identify_code, verify_code)
    VALUES (?, ?);
  `;

  return await promiseDb.run(query, [data.identify_code, data.verify_code]);
};

export const findVerifyRequestByIdentifyCode = async (
  identify_code: string
) => {
  logger.debug("Finding verify request by identify code", identify_code);

  const query = `
    SELECT * FROM ${VERIFY_TABLE}
    WHERE identify_code = ?;
  `;

  return await promiseDb.get<VerifyRequestTable>(query, [identify_code]);
};

export const findVerifyRequestByVerifyCode = async (verify_code: string) => {
  logger.debug("Finding verify request by verify code", verify_code);

  const query = `
    SELECT * FROM ${VERIFY_TABLE}
    WHERE verify_code = ?;
  `;

  return await promiseDb.get<VerifyRequestTable>(query, [verify_code]);
};
