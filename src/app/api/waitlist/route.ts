
export async function GET() {
  try {
    // Import dynamically to ensure fresh KV instance
    const { kv } = await import('@vercel/kv');
    
    if (!kv) {
      return Response.json({ count: 0, message: 'KV not available' });
    }
    
    const count = await kv.scard('waitlist');
    return Response.json({ count: count || 0 });
  } catch (error) {
    console.error('[GET Error]', error);
    return Response.json({ count: 0, error: 'Failed' }, { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return Response.json({ error: 'Email required' }, { status: 400 });
    }

    // Import dynamically
    const { kv } = await import('@vercel/kv');
    
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
