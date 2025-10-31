// Simple CORS helper for API routes.
const CONFIGURED_ORIGIN = import.meta.env.PUBLIC_APP_ORIGIN?.replace(/\//g, '');

const localhosts = [
  'http://localhost:4321',
  'http://127.0.0.1:4321',
  'http://0.0.0.0:4321',
];

/** Return CORS headers, choosing an allowed origin based on the incoming request. */
export function corsHeaders(request?: Request) {
  const allowed = import.meta.env.PROD
    ? [CONFIGURED_ORIGIN].filter(Boolean)
    : ['*', ...localhosts];
  let origin = request?.headers.get('origin') || '';
  if (!allowed.includes(origin)) origin = CONFIGURED_ORIGIN || '*';

  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Credentials': 'true',
  } as Record<string, string>;
}

export function optionsResponse(request?: Request) {
  return new Response(null, { status: 204, headers: corsHeaders(request) });
}
