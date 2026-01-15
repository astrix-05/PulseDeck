
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { kv } from '@vercel/kv';

// Define the key for the waitlist set
const WAITLIST_KEY = 'waitlist_emails';

// Helper for checking KV connection
const isKvConfigured = () => {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
};

// GET handler to return the count
export async function GET() {
  console.log('[API] GET /api/waitlist - Fetching count');
  
  if (!isKvConfigured()) {
    console.warn('[API] KV not configured. Returning 0 count.');
    return NextResponse.json({ count: 0 });
  }

  try {
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
    const { email } = await request.json();
    console.log('[API] Received email:', email);

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      console.warn('[API] Invalid email format');
      return NextResponse.json({ success: false, error: 'Invalid email address' }, { status: 400 });
    }

    // Check if KV is configured
    if (!isKvConfigured()) {
      console.error('[API] KV environment variables missing');
      // For local dev without KV, we can mock success or return error
      // Let's return error to prompt configuration, or mock if you prefer
      // For now, let's log error and return 500
      return NextResponse.json({ success: false, error: 'Database configuration missing' }, { status: 500 });
    }

    // Check if email already exists
    console.log('[API] Checking for duplicates in KV...');
    const isMember = await kv.sismember(WAITLIST_KEY, email);
    
    // Get total count (for rank)
    let count = await kv.scard(WAITLIST_KEY);

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

    // Send emails using Nodemailer
    if (process.env.GMAIL_EMAIL && process.env.GMAIL_PASSWORD) {
      console.log('[API] Attempting to send emails...');
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.GMAIL_EMAIL,
            pass: process.env.GMAIL_PASSWORD,
          },
        });

        // 1. Send confirmation to user
        await transporter.sendMail({
          from: process.env.GMAIL_EMAIL,
          to: email,
          subject: 'Welcome to the PulseDeck Waitlist! 🚀',
          text: `Thanks for joining the PulseDeck Presenter waitlist!\n\nYou are #${rank} in line.\n\nWe'll let you know as soon as we launch.\n\n- The PulseDeck Team`,
          html: `
            <div style="font-family: sans-serif; color: #333;">
              <h1>Welcome to PulseDeck! 🚀</h1>
              <p>Thanks for joining the PulseDeck Presenter waitlist.</p>
              <p>You are <strong>#${rank}</strong> in line.</p>
              <p>We're building the fastest way to turn briefs into on-brand decks, and we can't wait for you to try it.</p>
              <br/>
              <p>Best,</p>
              <p>The PulseDeck Team</p>
            </div>
          `,
        });

        // 2. Send notification to admin (yourself)
        await transporter.sendMail({
          from: process.env.GMAIL_EMAIL,
          to: process.env.GMAIL_EMAIL, // Send to self
          subject: `New Waitlist Signup: ${email}`,
          text: `New user joined the waitlist:\n\nEmail: ${email}\nRank: #${rank}\nTotal Count: ${count}`,
        });

        console.log(`[API] Emails sent successfully for ${email}`);
      } catch (emailError) {
        console.error('[API] Failed to send email:', emailError);
        // Don't fail the request if email sending fails
      }
    } else {
      console.warn('[API] GMAIL_EMAIL or GMAIL_PASSWORD not set. Skipping email send.');
    }

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
