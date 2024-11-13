// redisClient.ts
import Redis from "ioredis";
import { getEnvConfig } from "../utils/env.utils";
import Logger from "./logger.lib";

const { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } = getEnvConfig();

export const redis = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT,
  ...(REDIS_PASSWORD ? { password: REDIS_PASSWORD } : {}),
});

/**
 * Delete redis keys matching a pattern
 *
 * @param pattern - Pattern to match
 */
export const deleteRedisCacheByPattern = async (
  pattern: string
): Promise<void> => {
  let cursor = "0";
  do {
    // scan matching keys
    const result = await redis.scan(cursor, "MATCH", pattern);

    // get matched keys and delete
    const keys = result[1];
    if (keys.length) {
      Logger.getInstance().info("Deleting keys", ...keys);
      await redis.del(...keys);
    }

    // update cursor
    cursor = result[0];
  } while (cursor !== "0");
};
