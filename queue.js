import { Queue } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis();

export const analyzeQueue = new Queue("code-analysis", {
    connection
});