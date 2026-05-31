import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Pour la production, utilisez les clés Upstash Redis (gratuit 10K requêtes/jour)
// https://console.upstash.com
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL || "",
  token: process.env.UPSTASH_REDIS_TOKEN || "",
});

// Fallback pour le développement (pas de rate limit)
const isDev = !process.env.UPSTASH_REDIS_URL;

export const loginRateLimit = isDev
  ? { limit: () => ({ success: true }) }
  : new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "15m"), // 5 tentatives / 15 min
      analytics: true,
    });

export const apiRateLimit = isDev
  ? { limit: () => ({ success: true }) }
  : new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(100, "1m"), // 100 requêtes / min
      analytics: true,
    });

export const passwordResetLimit = isDev
  ? { limit: () => ({ success: true }) }
  : new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(3, "1h"), // 3 tentatives / heure
      analytics: true,
    });