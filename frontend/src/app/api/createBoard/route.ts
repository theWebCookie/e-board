import { NextRequest } from 'next/server';

export async function GET() {
  const res = await fetch('http://localhost:3500/api/inviteCode');

  if (!res.ok) {
    const errorData = await res.json();
    return Response.json({ error: errorData.error }, { status: res.status });
  }
  const data = await res.json();
  return Response.json(data);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name } = body;
  const res = await fetch('http://localhost:3500/api/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    return Response.json({ error: errorData.error }, { status: res.status });
  }

  const data = await res.json();
  return Response.json({ name: data.name, boardId: data.boardId });
}
