const allowedMethods = ['GET', 'POST', 'PATCH', 'DELETE'] as const;

interface RouteContext {
  params: Promise<{ path: string[] }>;
}

async function proxy(request: Request, context: RouteContext): Promise<Response> {
  const baseUrl = process.env.API_BASE_URL;
  if (baseUrl === undefined || baseUrl.trim().length === 0) {
    return Response.json({ detail: 'API_BASE_URL is not configured.' }, { status: 503 });
  }

  const { path } = await context.params;
  if (
    path.length === 0 ||
    path[0] !== 'todos' ||
    path.length > 2 ||
    (path.length === 2 && !/^\d+$/.test(path[1] ?? ''))
  ) {
    return Response.json({ detail: 'Not found' }, { status: 404 });
  }

  let target: URL;
  try {
    target = new URL(`/api/v1/${path.map(encodeURIComponent).join('/')}`, baseUrl);
  } catch {
    return Response.json({ detail: 'API_BASE_URL is invalid.' }, { status: 500 });
  }
  target.search = new URL(request.url).search;

  const headers = new Headers();
  const contentType = request.headers.get('content-type');
  if (contentType !== null) headers.set('content-type', contentType);
  headers.set('accept', 'application/json');

  try {
    const init: RequestInit & { duplex?: 'half' } = {
      method: request.method,
      headers,
      cache: 'no-store',
    };
    if (request.method !== 'GET' && request.method !== 'DELETE' && request.body !== null) {
      init.body = request.body;
      init.duplex = 'half';
    }
    const upstream = await fetch(target, init);
    const responseHeaders = new Headers();
    const upstreamContentType = upstream.headers.get('content-type');
    if (upstreamContentType !== null) responseHeaders.set('content-type', upstreamContentType);
    responseHeaders.set('cache-control', 'no-store');
    return new Response(upstream.body, {
      status: upstream.status,
      headers: responseHeaders,
    });
  } catch {
    return Response.json(
      { detail: 'Backend is unavailable. Check API_BASE_URL and the backend server.' },
      { status: 502 },
    );
  }
}

export const GET = proxy;
export const POST = proxy;
export const PATCH = proxy;
export const DELETE = proxy;

export function OPTIONS(): Response {
  return new Response(null, { status: 204, headers: { Allow: allowedMethods.join(', ') } });
}
