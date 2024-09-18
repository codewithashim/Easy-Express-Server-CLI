import { createClient } from "redis";
import { envConfig } from "../../../config/environment.config";

const redisClient = createClient({
    socket: {
        host: envConfig.redis.host,
        port: Number(envConfig.redis.port),
    },
    password: envConfig.redis.password,
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
