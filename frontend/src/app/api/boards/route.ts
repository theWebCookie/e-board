import { getCookie } from '@/lib/cookies';

export async function GET() {
  const userId = await getCookie('userId');
  const res = await fetch(`http://localhost:3500/api/userBoards/${userId!.value}`);

  if (!res.ok) {
    const errorData = await res.json();
    return Response.json({ error: errorData.error }, { status: res.status });
  }
  const data = await res.json();
  return Response.json(data.boardsWithUsers);
}
