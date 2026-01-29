import { Redis, RedisOptions } from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

const getRedisConfig = (): RedisOptions => {
    if (process.env.REDIS_URL) {
        console.log('[Redis] Parsing REDIS_URL from environment');
        try {
            const url = new URL(process.env.REDIS_URL);
            return {
                host: url.hostname,
                port: Number(url.port),
                username: url.username,
                password: url.password,
                tls: url.protocol === 'rediss:' ? { rejectUnauthorized: false } : undefined,
                maxRetriesPerRequest: null
            };
        } catch (e) {
            console.error('[Redis] Failed to parse REDIS_URL, falling back to specific vars or defaults', e);
        }
    }

    return {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        maxRetriesPerRequest: null,
    };
};

export const redisConfig = getRedisConfig();

export const redisConnection = new Redis(redisConfig);

redisConnection.on('connect', () => {
    console.log('Redis connected');
});

redisConnection.on('error', (err) => {
    console.error('Redis error:', err);
});
