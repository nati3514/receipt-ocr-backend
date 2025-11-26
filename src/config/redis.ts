import { Redis } from 'ioredis';

export const redisConnection = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
});

redisConnection.on('connect', () => {
    console.log('✅ Connected to Redis Cloud');
});

redisConnection.on('error', (err) => {
    console.error('❌ Redis connection error:', err);
});
