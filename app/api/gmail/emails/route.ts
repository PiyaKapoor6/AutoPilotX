import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { Buffer } from 'buffer';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('google_access_token')?.value;
  let accessToken = token;
  const isProd = process.env.NODE_ENV === 'production';

  // Try to refresh the access token if missing
  if (!accessToken) {
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
          accessToken = tokenJson.access_token;
        }
      } catch (err) {
        console.error('Failed to refresh Google access token', err);
      }
    }
  }

  if (!accessToken) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  try {
    let listRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=5&q=in:inbox', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    // If token was invalid, try refreshing once
    if (listRes.status === 401) {
      const refreshToken = cookieStore.get('google_refresh_token')?.value;
      if (refreshToken && process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
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
          accessToken = tokenJson.access_token;
          listRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=5&q=in:inbox', {
            headers: { Authorization: `Bearer ${accessToken}` }
          });
        }
      }
    }
    const listData = await listRes.json();
    
    if (!listData.messages) return NextResponse.json({ emails: [] });

    const emails = await Promise.all(listData.messages.map(async (msg: any) => {
      const msgRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=full`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const msgData = await msgRes.json();
      
      const headers = msgData.payload.headers || [];
      const subject = headers.find((h: any) => h.name === 'Subject')?.value || 'No Subject';
      const from = headers.find((h: any) => h.name === 'From')?.value || 'Unknown';
      const date = headers.find((h: any) => h.name === 'Date')?.value || '';
      
      let body = '';
      if (msgData.payload.parts) {
        const textPart = msgData.payload.parts.find((p: any) => p.mimeType === 'text/plain');
        if (textPart && textPart.body.data) {
          body = Buffer.from(textPart.body.data.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf-8');
        }
      } else if (msgData.payload.body && msgData.payload.body.data) {
        body = Buffer.from(msgData.payload.body.data.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf-8');
      }

      return { id: msg.id, subject, from, date, body, snippet: msgData.snippet };
    }));

    return NextResponse.json({ emails });
  } catch (error) {
    console.error('Gmail API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch emails' }, { status: 500 });
  }
}
