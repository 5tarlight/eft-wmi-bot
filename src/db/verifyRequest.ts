import { getLogger } from "../log/log";
import { VerifyRequestTable } from "./Database";
import { VERIFY_TABLE } from "./dbConst";
import { promiseDb } from "./util";

export interface VerifyRequestDto {
  identify_code: string;
  verify_code: string;
}

const logger = getLogger("db.verifyRequest");

export const insertVerifyRequest = async (data: VerifyRequestDto) => {
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

export const deleteVerifyRequestByIdentifyCode = async (
  identify_code: string
) => {
  logger.debug("Deleting verify request by identify code", identify_code);

  const query = `
    DELETE FROM ${VERIFY_TABLE}
    WHERE identify_code = ?;
  `;

  return await promiseDb.run(query, [identify_code]);
};

export const deleteVerifyRequestByVerifyCode = async (verify_code: string) => {
  logger.debug("Deleting verify request by verify code", verify_code);

  const query = `
    DELETE FROM ${VERIFY_TABLE}
    WHERE verify_code = ?;
  `;

  return await promiseDb.run(query, [verify_code]);
};
