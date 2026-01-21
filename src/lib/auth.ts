import { cookies } from 'next/headers';

export const AUTH_COOKIE_NAME = 'blog_admin_session';

export async function isAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.has(AUTH_COOKIE_NAME);
}

export async function login(password: string) {
  if (password === process.env.ADMIN_PASSWORD) {
    const cookieStore = await cookies();
    // Set cookie for 7 days
    cookieStore.set(AUTH_COOKIE_NAME, 'true', {
      httpOnly: true,
      // Only set secure cookie in production if not explicitly allowed to be insecure
      // This helps with Docker deployments behind HTTP proxies
      secure: process.env.NODE_ENV === 'production' && process.env.ALLOW_INSECURE_COOKIES !== 'true',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
    return true;
  }
  return false;
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}
