'use server';

import { cookies } from 'next/headers';

export async function getCookies() {
  const cookieStore = await cookies();
  return cookieStore.getAll();
}

export async function getCookie(name: string) {
  const cookieStore = await cookies();
  return cookieStore.get(name);
}

export async function removeCookies() {
  return new Promise<void>(async (resolve) => {
    const cookieStore = await cookies();
    cookieStore.delete('token');
    cookieStore.delete('name');
    cookieStore.delete('email');
    resolve();
  });
}
