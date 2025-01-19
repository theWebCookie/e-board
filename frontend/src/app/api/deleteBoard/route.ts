import { getCookie } from '@/lib/cookies';

export async function DELETE(request: Request) {
  const tokenCookie = await getCookie('token');
  const token = tokenCookie!.value;
  const body = await request.json();

  const res = await fetch('http://localhost:3500/api/board', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  console.log(res);

  if (!res.ok) {
    const errorData = await res.json();
    return Response.json({ error: errorData.error }, { status: res.status });
  }
  return Response.json({ success: true });
}
