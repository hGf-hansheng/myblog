'use server';

import { isAuthenticated } from '@/lib/auth';
import { getCategories } from '@/lib/posts';
import { GlassNavbarClient } from './GlassNavbarClient';

export async function GlassNavbar() {
  const isAuth = await isAuthenticated();
  const categories = await getCategories();
  
  return <GlassNavbarClient isAuth={isAuth} categories={categories} />;
}
