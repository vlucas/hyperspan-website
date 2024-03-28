import { renderToStream, renderToString } from './html';
import App from '../../app/routes/__app';

export const IS_PROD = process.env.NODE_ENV === 'production';
const STATIC_FILE_MATCHER = /[^/\\&\?]+\.\w{3,6}(?=([\?&].*$|$))/;

// Cached route components
const _routeCache: { [key: string]: any } = {};

/**
 * Did request come from a bot?
 */
function requestIsBot(req: Request) {
  const ua = req.headers.get('User-Agent');

  return ua && typeof ua === 'string' ? ua.includes('bot') : false;
}

export async function useFilesystemRouter(req: Request) {
  const router = new Bun.FileSystemRouter({
    style: 'nextjs',
    dir: './app/routes',
    // origin: "https://mydomain.com",
    assetPrefix: '_hs/static/',
  });

  const url = new URL(req.url);
  const qs = url.searchParams;
  const matchingRoute = router.match(req.url);

  if (!matchingRoute) {
    return new Response('Not found!', {
      status: 404,
      headers: { 'content-type': 'text/html' },
    });
  }

  // Redirect to canonical URL so there are no dupe URLs
  if (matchingRoute.kind === 'exact' && url.pathname !== matchingRoute.name) {
    return Response.redirect(matchingRoute.name, 301);
  }

  // @TODO: Move this to config or something...
  const streamOpt = qs.get('__nostream') ? !Boolean(qs.get('__nostream')) : undefined;
  const streamingEnabled = streamOpt !== undefined ? streamOpt : true;

  // Import route component
  const RouteModule = _routeCache[matchingRoute.name] || (await import(matchingRoute.filePath));

  if (IS_PROD) {
    // Only cache routes in prod
    _routeCache[matchingRoute.name] = RouteModule;
  }

  // Route module
  const RouteComponent = RouteModule.default;
  const reqMethod = req.method.toUpperCase();

  // API Route?
  if (RouteComponent === undefined && RouteModule[reqMethod] !== undefined) {
    return await RouteModule[reqMethod](req);
  }

  // Route component
  const routeContent = await RouteComponent(req);

  if (routeContent instanceof Response) {
    return routeContent;
  }

  if (streamingEnabled && !requestIsBot(req)) {
    return new StreamResponse(renderToStream(await App(req, routeContent))) as Response;
  } else {
    // Render content and template
    // TODO: Use any context variables from RouteComponent rendering to set values in layout (dynamic title, etc.)...
    const html = await renderToString(await App(req, routeContent));

    // Render it...
    return new Response(html, {
      headers: { 'content-type': 'text/html' },
    });
  }
}

export type THSServerConfig = {
  appDir: string;
  staticFileRoot: string;
  // Can intercept the current request and return a custom Response
  onRequest: (req: Request) => void | Response | StreamResponse;
};
export function createServer(config: THSServerConfig) {
  return Bun.serve({
    port: process.env.PORT || 3005,
    async fetch(req) {
      // Static files
      if (STATIC_FILE_MATCHER.test(req.url)) {
        const filePath = config.staticFileRoot + new URL(req.url).pathname;
        const file = Bun.file(filePath);
        return new Response(file);
      }

      // Run onRequest
      const matchedRoute = config.onRequest(req);

      if (matchedRoute) {
        return matchedRoute as Response;
      }

      return new Response(null, { status: 404 });
    },
    error() {
      return new Response(null, { status: 404 });
    },
  });
}

/**
 * Streaming HTML Response
 */
export class StreamResponse {
  constructor(iterator: AsyncIterator<unknown>, options = {}) {
    const stream = createReadableStreamFromAsyncGenerator(iterator as AsyncGenerator);

    return new Response(stream, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        'Transfer-Encoding': 'chunked',
        // @ts-ignore
        ...(options?.headers ?? {}),
      },
      ...options,
    });
  }
}

/**
 * Does what it says on the tin...
 */
export function createReadableStreamFromAsyncGenerator(output: AsyncGenerator) {
  const encoder = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      while (true) {
        const { done, value } = await output.next();

        if (done) {
          controller.close();
          break;
        }

        controller.enqueue(encoder.encode(value as unknown as string));
      }
    },
  });
}
