import { Hyperspan as HS } from '@hyperspan/framework';
import timestring from 'timestring';

const _memoryCache = new Map<string, string>();

/**
 * Cache the response for a given time length ('30s', '1d', '1w', '1m', etc) or given number of seconds
 */
export function memoryCacheTime(timeStrOrSeconds: string | number) {
  return async (c: HS.Context, next: HS.NextFunction) => {
    const method = c.req.method;

    // Only cache GET requests
    if (method === 'GET') {
      const res = await next();
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
    }

    return next();
  };
}
