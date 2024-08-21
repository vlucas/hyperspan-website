// @ts-ignore
import Router from 'trek-router';
// @ts-ignore
import Middleware from 'trek-middleware';
import deepmerge from '@fastify/deepmerge';

const mergeAll = deepmerge({ all: true });

type THTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * Request context
 */
export class HSRequestContext {
  public req: Request;
  public locals: Record<string, any>;
  public headers: Headers;
  public route: {
    params: Record<string, string>;
    query: URLSearchParams;
  };

  constructor(req: Request, params: Record<string, string> = {}) {
    this.req = req;
    this.locals = {};
    this.headers = new Headers();
    this.route = {
      params,
      query: new URL(req.url).searchParams,
    };
  }

  /**
   * Response helper
   * Preserves all headers added in context/middleware
   */
  res(content: BodyInit, options: ResponseInit): Response {
    return new Response(content, mergeAll({ headers: this.headers.toJSON() }, options));
  }

  /**
   * HTML response helper
   * Preserves all headers added in context/middleware
   */
  html(content: string, options: ResponseInit): Response {
    return new Response(
      content,
      mergeAll(
        { headers: this.headers.toJSON() },
        { headers: { 'Content-Type': 'text/html' } },
        options
      )
    );
  }

  /**
   * JSON response helper
   * Preserves all headers added in context/middleware
   */
  json(content: any, options: ResponseInit): Response {
    return new Response(
      content,
      mergeAll(
        { headers: this.headers.toJSON() },
        { headers: { 'Content-Type': 'application/json' } },
        options
      )
    );
  }
}

type THSRouteHandler = (
  context: HSRequestContext
) => (Response | null | void) | Promise<Response | null | void>;

/**
 * App
 */
export class HSApp {
  private _router: typeof Router;
  private _mw: typeof Middleware;
  public _defaultRoute: THSRouteHandler;

  constructor() {
    this._router = new Router();
    this._mw = new Middleware();
    this._defaultRoute = (c: HSRequestContext) => {
      return c.res('Not found', { status: 404 });
    };
  }

  // @TODO: Middleware !!!!

  public get(path: string, handler: THSRouteHandler) {
    return this._route('GET', path, handler);
  }
  public post(path: string, handler: THSRouteHandler) {
    return this._route('POST', path, handler);
  }
  public put(path: string, handler: THSRouteHandler) {
    return this._route('PUT', path, handler);
  }
  public delete(path: string, handler: THSRouteHandler) {
    return this._route('DELETE', path, handler);
  }
  public all(path: string, handler: THSRouteHandler) {
    return this.addRoute(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], path, handler);
  }
  public addRoute(methods: THTTPMethod[], path: string, handler: THSRouteHandler) {
    methods.forEach((method) => {
      this._route(method, path, handler);
    });
    return this;
  }
  public defaultRoute(handler: THSRouteHandler) {
    this._defaultRoute = handler;
  }
  private _route(method: string | string[], path: string, handler: any) {
    this._router.add(method, path, handler);
    return this;
  }

  async run(req: Request): Promise<Response> {
    let response: Response;
    let url = new URL(req.url);
    let urlPath = normalizePath(url.pathname);

    // Redirect to normalized path (lowercase & without trailing slash)
    if (urlPath !== url.pathname) {
      url.pathname = urlPath;
      return Response.redirect(url);
    }

    let result = this._router.find(req.method.toUpperCase(), urlPath);
    let params: Record<string, any> = {};

    if (result && result[0]) {
      // Build params
      result[1].forEach((param: any) => (params[param.name] = param.value));

      // Run route with context
      const context = new HSRequestContext(req, params);
      response = result[0](context);
    }

    // @ts-ignore
    if (response) {
      return response;
    }

    const context = new HSRequestContext(req);

    // @ts-ignore
    return this._defaultRoute(context);
  }
}

/**
 * Normalize URL path
 * Removes trailing slash and lowercases path
 */
export function normalizePath(urlPath: string): string {
  return (
    (urlPath.endsWith('/') ? urlPath.substring(0, urlPath.length - 1) : urlPath).toLowerCase() ||
    '/'
  );
}
