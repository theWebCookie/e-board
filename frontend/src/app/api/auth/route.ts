import { errorDictionary, passwordLength } from '@config';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const validateData = (email: string, password: string) => {
  if (!email || !password) {
    return Response.json({ error: errorDictionary['invalid-data'] }, { status: 400 });
  }

  if (!email || !email.includes('@')) {
    return Response.json({ error: errorDictionary['invalid-email'] }, { status: 400 });
  }

  if (!password || password.length < passwordLength) {
    return Response.json({ error: errorDictionary['weak-password'] }, { status: 400 });
  }
};

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { type } = body;
  if (type === 'register') {
    const { email, password, name } = body.values;

    if (!name) {
      return Response.json({ error: errorDictionary['invalid-data'] }, { status: 400 });
    }

    const validationError = validateData(email, password);

    if (validationError) {
      return validationError;
    }

    const res = await fetch('http://localhost:3500/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return Response.json({ error: errorData.error }, { status: res.status });
    }

    const data = await res.json();
    cookies().set('token', data.token);
    return Response.json(data.user);
  }

  const { email, password } = body.values;

  const validationError = validateData(email, password);

  if (validationError) {
    return validationError;
  }

  const res = await fetch('http://localhost:3500/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    return Response.json({ error: errorData.error }, { status: res.status });
  }

  const data = await res.json();
  cookies().set('token', data.token);
  return Response.json(data.user);
}
