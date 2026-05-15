import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("error", (error) => {
  console.log("Redis Error: ", error);
});

(async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    console.log("Redis connected failed");
  }
})();

export default redisClient;
