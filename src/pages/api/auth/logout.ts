// File: src/pages/api/auth/logout.ts
import type { APIContext } from 'astro';

export async function POST(ctx: APIContext): Promise<Response> {
  // Clear the session cookie by deleting it
  ctx.cookies.delete('authjs.session-token', { path: '/' });
  ctx.cookies.delete('Secure-authjs.session-token', { path: '/' });

  // Return JSON confirmation instead of redirect
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function GET(ctx: APIContext): Promise<Response> {
  // Handle GET requests as well
  ctx.cookies.delete('authjs.session-token', { path: '/' });
  ctx.cookies.delete('Secure-authjs.session-token', { path: '/' });

  // Return JSON confirmation instead of redirect
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
