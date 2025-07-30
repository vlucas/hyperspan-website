import { Context, Next } from 'hono';
import timestring from 'timestring';

const _memoryCache = new Map<string, string>();

/**
 * Cache the response for a given time length ('30s', '1d', '1w', '1m', etc) or given number of seconds
 */
export function memoryCacheTime(timeStrOrSeconds: string | number) {
  return async (c: Context, next: Next) => {
    const method = c.req.method.toUpperCase();

    // Only cache GET requests
    if (method === 'GET') {
      await next();
      const timeInSeconds =
        typeof timeStrOrSeconds === 'number' ? timeStrOrSeconds : timestring(timeStrOrSeconds);
      const cacheKey = `${method}:${c.req.url.toLowerCase()}`;
      const cachedRes = _memoryCache.get(cacheKey);

      // Return the cached response if it exists
      if (cachedRes) {
        return new Response(cachedRes, {
          status: 200,
          headers: {
            'Cache-Control': `public, max-age=${timeInSeconds}`,
          },
        });
      }

      const res = c.res as Response;

      // Set the cache if the response is 200
      if (res.status === 200) {
        const resBody = await res.clone().text();
        _memoryCache.set(cacheKey, resBody);
        c.header('Cache-Control', `public, max-age=${timeInSeconds}`);
      }

      return res;
    }

    return next();
  };
}
