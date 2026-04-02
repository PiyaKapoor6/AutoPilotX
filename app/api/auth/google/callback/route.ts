import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const origin = process.env.APP_URL || url.origin;

  if (!code) {
    return new NextResponse('Missing code', { status: 400 });
  }

  try {
    const clientId = process.env.GOOGLE_CLIENT_ID || '884897766273-emb6v1vvjdvipl6s9jlspgvcedpc676v.apps.googleusercontent.com';
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!clientSecret) {
      console.error('Missing GOOGLE_CLIENT_SECRET');
      return new NextResponse('Server configuration error: Missing Client Secret', { status: 500 });
    }

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: `${origin}/api/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.access_token) {
      const cookieStore = await cookies();
      const isProd = process.env.NODE_ENV === 'production';

      cookieStore.set('google_access_token', tokenData.access_token, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        maxAge: tokenData.expires_in,
        path: '/',
      });

      // Persist refresh token when available (first consent)
      if (tokenData.refresh_token) {
        cookieStore.set('google_refresh_token', tokenData.refresh_token, {
          httpOnly: true,
          secure: isProd,
          sameSite: isProd ? 'none' : 'lax',
          // Keep refresh token long-lived
          maxAge: 60 * 60 * 24 * 365,
          path: '/',
        });
      }
    } else {
      console.error('Token exchange failed:', tokenData);
      return new NextResponse('Authentication failed during token exchange', { status: 500 });
    }

    return new NextResponse(`
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'OAUTH_SUCCESS' }, '*');
              window.close();
            } else {
              window.location.href = '/agents/email-manager';
            }
          </script>
          <p>Authentication successful. You can close this window.</p>
        </body>
      </html>
    `, { headers: { 'Content-Type': 'text/html' } });
  } catch (error) {
    console.error('OAuth Error:', error);
    return new NextResponse('Authentication failed', { status: 500 });
  }
}
