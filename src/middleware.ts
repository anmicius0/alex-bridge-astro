import { defineMiddleware } from 'astro:middleware';
import { getSession } from 'auth-astro/server';

const PROTECTED_ROUTES = ['/user/dashboard', '/admin'];
const PUBLIC_ROUTES = ['/', '/user/login', '/news', '/holiday'];

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return next();
  }

  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    const session = await getSession(context.request);

    if (!session?.user) {
      return context.redirect('/user/login');
    }
  }

  return next();
});
