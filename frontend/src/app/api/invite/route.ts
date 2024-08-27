import { NextRequest } from 'next/server';
import { inviteCodeLength, inviteFormDictionary, tokenDictionary } from '@config';
import { getCookie } from '@/lib/cookies';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { code } = body;
  const tokenCookie = await getCookie('token');
  const token = tokenCookie!.value;

  if (!code || code.length !== inviteCodeLength) {
    return Response.json({ error: inviteFormDictionary['invite-code-is-invalid'] }, { status: 400 });
  }

  if (!token) {
    return Response.json({ error: tokenDictionary['token-is-required'] }, { status: 400 });
  }

  const res = await fetch('http://localhost:3500/api/handleInviteCode', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ code }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    return Response.json({ error: errorData.error }, { status: res.status });
  }
  const data = await res.json();
  return Response.json(data);
}
