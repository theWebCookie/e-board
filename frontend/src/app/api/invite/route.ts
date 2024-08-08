import { NextRequest } from 'next/server';
import { inviteCodeLength, inviteFormDictionary } from '@config';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { code } = body;

  if (!code || code.length !== inviteCodeLength) {
    return Response.json({ error: inviteFormDictionary['invite-code-is-invalid'] }, { status: 400 });
  }

  const res = await fetch('http://localhost:3500/api/handleInviteCode', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
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
