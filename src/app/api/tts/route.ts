import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/tts
 * Server-side proxy to ElevenLabs TTS.
 * The API key never leaves the server.
 *
 * Request body: { text: string }
 * Response: audio/mpeg stream
 */
export async function POST(req: NextRequest) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = process.env.ELEVENLABS_VOICE_ID;

  if (!apiKey || !voiceId) {
    return NextResponse.json(
      { error: 'TTS is not configured on this server.' },
      { status: 503 }
    );
  }

  let text: string;
  try {
    const body = await req.json();
    text = body?.text ?? '';
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  if (!text || typeof text !== 'string' || !text.trim()) {
    return NextResponse.json({ error: 'Missing required field: text' }, { status: 400 });
  }

  // Strip markdown / HTML so ElevenLabs reads clean prose
  const clean = stripForTTS(text).slice(0, 4800).trim();

  if (!clean) {
    return NextResponse.json({ error: 'No readable text found.' }, { status: 400 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg',
        },
        body: JSON.stringify({
          text: clean,
          model_id: 'eleven_turbo_v2_5',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: true,
          },
        }),
      }
    );
  } catch (err) {
    console.error('[TTS] network error reaching ElevenLabs:', err);
    return NextResponse.json(
      { error: 'Could not reach TTS service.' },
      { status: 502 }
    );
  }

  if (!upstream.ok) {
    const msg = await upstream.text().catch(() => '');
    console.error('[TTS] ElevenLabs error', upstream.status, msg);
    return NextResponse.json(
      { error: `TTS service error (${upstream.status}).` },
      { status: 502 }
    );
  }

  // Stream audio back to the client
  const headers = new Headers();
  headers.set('Content-Type', 'audio/mpeg');
  headers.set('Cache-Control', 'no-store');

  return new NextResponse(upstream.body, { status: 200, headers });
}

/** Remove markdown syntax and HTML tags so TTS reads clean text. */
function stripForTTS(input: string): string {
  return input
    .replace(/<[^>]+>/g, ' ')          // HTML tags
    .replace(/```[\s\S]*?```/g, '')     // fenced code blocks
    .replace(/`[^`]+`/g, '')            // inline code
    .replace(/^#{1,6}\s+/gm, '')        // headings
    .replace(/\*{1,3}([^*\n]+)\*{1,3}/g, '$1')  // bold/italic
    .replace(/_{1,3}([^_\n]+)_{1,3}/g, '$1')
    .replace(/^>\s+/gm, '')             // blockquotes
    .replace(/^[-*+]\s+/gm, '')         // unordered lists
    .replace(/^\d+\.\s+/gm, '')         // ordered lists
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')  // links → keep text
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}
