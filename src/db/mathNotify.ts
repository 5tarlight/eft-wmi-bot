import { getLogger } from "../log/log";
import { MatchNotifyTable } from "./Database";
import { MATCH_NOTIFY_TABLE } from "./dbConst";
import { promiseDb } from "./util";

export interface MatchNotifyDto {
  discord_id: string;
  identity_code: string;
}

const logger = getLogger("db.mathNotify");

export const insertMatchNotify = async (data: MatchNotifyDto) => {
  logger.debug("Inserting match notify", data);

  const query = `
    INSERT INTO ${MATCH_NOTIFY_TABLE} (discord_id, identity_code)
    VALUES (?, ?);
  `;

  return await promiseDb.run(query, [data.discord_id, data.identity_code]);
};

export const findMatchNotifyByIdentityCode = async (identity_code: string) => {
  logger.debug("Finding match notify by identity code", identity_code);

  const query = `
    SELECT * FROM ${MATCH_NOTIFY_TABLE}
    WHERE identity_code = ?;
  `;

  return await promiseDb.get<MatchNotifyTable>(query, [identity_code]);
};

export const findMatchNotifyByDiscordId = async (discord_id: string) => {
  logger.debug("Finding match notify by discord id", discord_id);

  const query = `
    SELECT * FROM ${MATCH_NOTIFY_TABLE}
    WHERE discord_id = ?;
  `;

  return await promiseDb.get<MatchNotifyTable>(query, [discord_id]);
};

export const deleteMatchNotifyByIdentityCode = async (
  identity_code: string
) => {
  logger.debug("Deleting match notify by identity code", identity_code);

  const query = `
    DELETE FROM ${MATCH_NOTIFY_TABLE}
    WHERE identity_code = ?;
  `;

  return await promiseDb.run(query, [identity_code]);
};

export const deleteMatchNotifyByDiscordId = async (discord_id: string) => {
  logger.debug("Deleting match notify by discord id", discord_id);

  const query = `
    DELETE FROM ${MATCH_NOTIFY_TABLE}
    WHERE discord_id = ?;
  `;

  return await promiseDb.run(query, [discord_id]);
};
