import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { Buffer } from 'buffer';

export async function POST(req: Request) {
  const cookieStore = await cookies();
  let token = cookieStore.get('google_access_token')?.value;
  const isProd = process.env.NODE_ENV === 'production';

  // If access token missing/expired, try to refresh using stored refresh token
  if (!token) {
    const refreshToken = cookieStore.get('google_refresh_token')?.value;
    if (refreshToken && process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
      try {
        const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            refresh_token: refreshToken,
            grant_type: 'refresh_token'
          })
        });

        const tokenJson = await tokenRes.json();
        if (tokenJson.access_token) {
          cookieStore.set('google_access_token', tokenJson.access_token, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? 'none' : 'lax',
            maxAge: tokenJson.expires_in,
            path: '/',
          });
          token = tokenJson.access_token;
        }
      } catch (err) {
        console.error('Failed to refresh Google access token', err);
      }
    }
  }

  if (!token) return NextResponse.json({ error: 'Not authenticated with Gmail' }, { status: 401 });

  try {
    const { to, subject, body } = await req.json();
    
    if (!to || !subject || !body) {
      return NextResponse.json({ error: 'Missing required fields (to, subject, body)' }, { status: 400 });
    }

    // Construct the email according to RFC 2822
    const emailLines = [
      `To: ${to}`,
      `Subject: ${subject}`,
      'Content-Type: text/plain; charset="UTF-8"',
      'MIME-Version: 1.0',
      '',
      body
    ];
    const email = emailLines.join('\r\n');
    
    // Base64url encode the email
    const encodedEmail = Buffer.from(email)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const sendRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ raw: encodedEmail })
    });

    const sendData = await sendRes.json();
    
    if (!sendRes.ok) {
      console.error('Gmail Send Error:', sendData);
      return NextResponse.json({ error: sendData.error?.message || 'Failed to send email' }, { status: sendRes.status });
    }

    return NextResponse.json({ success: true, messageId: sendData.id });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
