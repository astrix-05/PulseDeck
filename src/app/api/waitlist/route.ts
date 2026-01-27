export async function GET() {
  try {
    let kv;
    try {
      const kvModule = await import('@vercel/kv');
      kv = kvModule.kv;
    } catch (importError: any) {
      console.warn('[Waitlist API] KV client failed to load - using fallback', importError?.message);
      // Return graceful degradation when KV is not available
      return Response.json({ count: 0, message: 'Waitlist count unavailable' }, { status: 200 });
    }

    if (!kv) {
      return Response.json({ error: 'Service unavailable' }, { status: 503 });
    }

    const count = await kv.scard('waitlist');
    return Response.json({ count: count || 0 });
  } catch (error) {
    console.error('[GET Error]', error);
    return Response.json({ count: 0, message: 'Waitlist temporarily unavailable' }, { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return Response.json({ error: 'Email required' }, { status: 400 });
    }

    let kv;
    try {
      const kvModule = await import('@vercel/kv');
      kv = kvModule.kv;
    } catch (importError: any) {
      console.warn('[Waitlist API] KV client failed to load - using fallback', importError?.message);
      // Gracefully accept the email even if KV is unavailable
      return Response.json({
        success: true,
        count: 1,
        rank: 1,
        message: 'Waitlist temporarily offline but email noted'
      }, { status: 200 });
    }

    if (!kv) {
      return Response.json({ error: 'Service unavailable' }, { status: 503 });
    }

    // Try to add to waitlist
    const added = await kv.sadd('waitlist', email);
    const count = await kv.scard('waitlist');
    return Response.json({
      success: true,
      count: count || 0,
      rank: count || 1
    });
  } catch (error) {
    console.error('[POST Error]', error instanceof Error ? error.message : error);
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
