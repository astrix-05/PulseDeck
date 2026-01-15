
import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

// Define the key for the waitlist set
const WAITLIST_KEY = 'waitlist_emails';

// Helper for checking KV connection
const isKvConfigured = () => {
  const isConfigured = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
  console.log('[API] Checking KV Config:', { 
    hasUrl: !!process.env.KV_REST_API_URL, 
    hasToken: !!process.env.KV_REST_API_TOKEN,
    isConfigured 
  });
  return isConfigured;
};

// GET handler to return the count
export async function GET() {
  console.log('[API] GET /api/waitlist - Fetching count');
  
  if (!isKvConfigured()) {
    console.warn('[API] KV not configured. Returning 0 count.');
    return NextResponse.json({ count: 0 });
  }

  try {
    console.log('[API] Connecting to Redis to fetch scard...');
    const count = await kv.scard(WAITLIST_KEY);
    console.log('[API] Count fetched successfully:', count);
    return NextResponse.json({ count });
  } catch (error) {
    console.error('[API] Failed to get waitlist count:', error);
    // Fallback to 0 if KV fails
    return NextResponse.json({ count: 0 });
  }
}

// POST handler to add email
export async function POST(request: Request) {
  console.log('[API] POST /api/waitlist - New submission');
  
  try {
    const body = await request.json();
    console.log('[API] Request body:', body);
    
    const { email } = body;
    console.log('[API] Received email:', email);

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      console.warn('[API] Invalid email format');
      return NextResponse.json({ success: false, error: 'Invalid email address' }, { status: 400 });
    }

    // Check if KV is configured
    if (!isKvConfigured()) {
      console.error('[API] KV environment variables missing');
      return NextResponse.json({ success: false, error: 'Database configuration missing' }, { status: 500 });
    }

    // Check if email already exists
    console.log('[API] Checking for duplicates in KV...');
    const isMember = await kv.sismember(WAITLIST_KEY, email);
    
    // Get total count (for rank)
    let count = await kv.scard(WAITLIST_KEY);
    console.log('[API] Current count before add:', count);

    if (isMember) {
      console.log('[API] Email already exists. Returning current rank.');
      return NextResponse.json({ 
        success: true,
        message: 'You are already on the list!', 
        rank: count, 
        count: count 
      });
    }

    // Add new email to KV Set
    console.log('[API] Adding new email to KV...');
    await kv.sadd(WAITLIST_KEY, email);
    
    // Increment count locally for the response
    count++;
    const rank = count;
    console.log('[API] Email added. New count:', count);

    // REMOVED EMAIL SENDING LOGIC FOR DEBUGGING
    console.log('[API] Email sending skipped for debugging.');

    return NextResponse.json({ 
      success: true,
      message: 'Successfully joined!', 
      rank, 
      count: rank 
    });

  } catch (error) {
    console.error('[API] Critical Error in waitlist API:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
