'use server';

import { login } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function loginAction(formData: FormData) {
  const password = formData.get('password') as string;
  const success = await login(password);
  
  if (success) {
    redirect('/');
  } else {
    return { error: 'Invalid password' };
  }
}
