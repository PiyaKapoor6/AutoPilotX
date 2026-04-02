import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const origin = process.env.APP_URL || new URL(req.url).origin;
  const clientId = process.env.GOOGLE_CLIENT_ID || '884897766273-emb6v1vvjdvipl6s9jlspgvcedpc676v.apps.googleusercontent.com';
  
  if (!clientId) {
    return NextResponse.json({ error: 'GOOGLE_CLIENT_ID not configured' }, { status: 500 });
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${origin}/api/auth/google/callback`,
    response_type: 'code',
    scope: 'https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send',
    access_type: 'offline',
    prompt: 'consent'
  });

  return NextResponse.json({ url: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}` });
}
