import { Hyperspan as HS } from '@hyperspan/framework';
import timestring from 'timestring';

const IS_DEV = process.env.NODE_ENV === 'development';
const _memoryCache = new Map<string, string>();

/**
 * Cache the response for a given time length ('30s', '1d', '1w', '1m', etc) or given number of seconds
 */
export function memoryCacheTime(timeStrOrSeconds: string | number): HS.MiddlewareFunction {
  return async (c, next) => {
    const method = c.req.method;
    const canCache = method === 'GET' && !c.vars.isKnownAIBot && !IS_DEV;

    // Only cache requests that we can
    if (canCache) {
      const timeInSeconds =
        typeof timeStrOrSeconds === 'number' ? timeStrOrSeconds : timestring(timeStrOrSeconds);
      const cacheKey = `${method}:${c.req.url.pathname}`;
      const cachedRes = _memoryCache.get(cacheKey);

      // Return the cached response if it exists
      if (cachedRes) {
        return c.res.html(cachedRes, {
          headers: {
            'Cache-Control': `public, max-age=${timeInSeconds}`,
          },
        });
      }

      const res = await next();

      // Set the cache if the response is 200
      if (res && res.status === 200) {
        const resBody = await res.clone().text();
        _memoryCache.set(cacheKey, resBody);

        return c.res.html(resBody, {
          headers: {
            'Cache-Control': `public, max-age=${timeInSeconds}`,
          },
        });
      }

      return res;
    } else {
      c.res.headers.set('Cache-Control', 'no-cache');
    }

    return next();
  };
}

/**
 * Middleware to check if the user agent is a known AI bot
 */
export function isKnownAIBot(): HS.MiddlewareFunction {
  return (c, next) => {
    const KNOWN_AI_BOTS = [
      'Amazonbot',
      'Applebot',
      'Bytespider',
      'ClaudeBot',
      'DuckAssistBot',
      'Google-CloudVertexBot',
      'GoogleOther',
      'GPTBot',
      'Meta-ExternalAgent',
      'PetalBot',
      'TikTokSpider',
      'CCBot',
    ];

    const knownBotMatchers = KNOWN_AI_BOTS.map((bot) => bot.toLowerCase());

    const isKnownAIBot = (userAgent?: string | null) => {
      if (!userAgent) return false;
      const normalized = userAgent.toLowerCase();
      return knownBotMatchers.some((bot) => normalized.includes(bot));
    };

    const userAgent = c.req.headers.get('user-agent');

    c.vars.isKnownAIBot = isKnownAIBot(userAgent);

    return next();
  };
}
