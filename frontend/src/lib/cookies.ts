'use server';

import { cookies } from 'next/headers';

export async function getCookies() {
  const cookieStore = cookies();
  return cookieStore.getAll();
}

export async function getCookie(name: string) {
  const cookieStore = cookies();
  return cookieStore.get(name);
}

export async function removeCookies() {
  return new Promise<void>((resolve) => {
    const cookieStore = cookies();
    cookieStore.delete('userId');
    cookieStore.delete('sessionId');
    resolve();
  });
}
