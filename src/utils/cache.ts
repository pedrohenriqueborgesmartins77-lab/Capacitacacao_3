import { Logger } from "pino";

interface CacheEntry<T> {
    data: T;
    expireAt: number;
}

const cache = new Map<string, CacheEntry<any>>();

export function getFromCache<T>(key: string, logger: Logger): T | null {
    const entry = cache.get(key);

    if (entry) {
        if (Date.now() < entry.expireAt) {
            logger.info({ cacheKey: key}, 'Cache HIT');
            return entry.data as T;
        }
        cache.delete(key);
    }
    logger.info({ cacheKey: key}, 'Cache MISS');
    return null
}

export function setInCache<T>(key: string, value: T, ttlSeconds: number): void {
    const expireAt = Date.now() + ttlSeconds * 1000;
    const entry: CacheEntry<T> = { data: value, expireAt };
    cache.set(key, entry)        
}