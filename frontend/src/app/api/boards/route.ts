import { getCookie } from '@/lib/cookies';

export async function GET() {
  const tokenCookie = await getCookie('token');
  const token = tokenCookie!.value;

  const res = await fetch('http://localhost:3500/api/userBoards', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    return Response.json({ error: errorData.error }, { status: res.status });
  }
  const data = await res.json();
  return Response.json(data.boardsWithUsers);
}
