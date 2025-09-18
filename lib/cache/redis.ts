import Redis from "ioredis";

let redisClient: Redis | undefined;

if (process.env.NEXT_PUBLIC_REDIS_URL) {
  redisClient = new Redis(process.env.NEXT_PUBLIC_REDIS_URL, {
    maxRetriesPerRequest: 2,
  });
}

export const redis = redisClient;
