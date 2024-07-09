import { createClient } from "redis";
import config from "../../../config";
 
const redisClient = createClient({
  socket: {
    host: config.redis.host,
    port: Number(config.redis.port),
  },
  password: config.redis.password,
});

class RedisWrapper {
  async connect() {
    try {
      await redisClient.connect();
      console.log("Redis connected successfully");
    } catch (error: any) {
      console.log({
        message: "Redis not connected",
        error: error.message,
      });
    }
  }
}

export const RedisClient = new RedisWrapper();

export default redisClient;
