import { getCookie } from '@/lib/cookies';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const params = new URLSearchParams(url.search);
  const tokenCookie = await getCookie('token');
  const token = tokenCookie!.value;

  const backendUrl = new URL('http://localhost:3500/api/load');
  params.forEach((value, key) => {
    backendUrl.searchParams.append(key, value);
  });

  const response = await fetch(backendUrl.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    return Response.json({ error: errorData.error }, { status: response.status });
  }
  const data = await response.json();
  return Response.json(data);
}
