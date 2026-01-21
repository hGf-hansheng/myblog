'use server';

import { isAuthenticated } from '@/lib/auth';
import { PostMeta } from '@/lib/posts';
import { GlassNavbarClient } from './GlassNavbarClient';

export async function GlassNavbar() {
  const isAuth = await isAuthenticated();
  
  return <GlassNavbarClient isAuth={isAuth} />;
}
