import { getCookie } from '@/lib/cookies';
import { decodeJwt } from 'jose';

export async function POST(request: Request) {
  const tokenCookie = await getCookie('token');
  const token = tokenCookie?.value;
  const body = await request.json();

  const res = await fetch('http://localhost:3500/api/notification', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorData = await res.json();
    return Response.json({ error: errorData.message }, { status: res.status });
  }

  const data = await res.json();
  return Response.json(data);
}

export async function GET() {
  const tokenCookie = await getCookie('token');
  const token = tokenCookie?.value;
  if (!token) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const decoded = decodeJwt(token);
  const userId = decoded.id;

  const res = await fetch(`http://localhost:3500/api/notification?userId=${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    const errorData = await res.json();
    return Response.json({ error: errorData.message }, { status: res.status });
  }

  const data = await res.json();
  return Response.json(data);
}
