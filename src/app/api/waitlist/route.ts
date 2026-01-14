
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

// Define the path to the JSON file
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'waitlist.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Helper to read the DB
function readDb() {
  if (!fs.existsSync(DB_PATH)) {
    return [];
  }
  const data = fs.readFileSync(DB_PATH, 'utf-8');
  try {
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Helper to write to the DB
function writeDb(data: any[]) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// GET handler to return the count
export async function GET() {
  const emails = readDb();
  return NextResponse.json({ count: emails.length });
}

// POST handler to add email
export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ success: false, error: 'Invalid email address' }, { status: 400 });
    }

    const emails = readDb();
    
    // Check for duplicates
    let rank = emails.findIndex((e: any) => e.email === email);
    if (rank !== -1) {
      return NextResponse.json({ 
        success: true,
        message: 'You are already on the list!', 
        rank: rank + 1, 
        count: emails.length 
      });
    }

    // Add new email
    const newEntry = {
      email,
      date: new Date().toISOString(),
    };
    
    emails.push(newEntry);
    writeDb(emails);

    rank = emails.length;

    // Send emails using Nodemailer
    if (process.env.GMAIL_EMAIL && process.env.GMAIL_PASSWORD) {
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
          text: `New user joined the waitlist:\n\nEmail: ${email}\nRank: #${rank}\nTotal Count: ${emails.length}`,
        });

        console.log(`Emails sent for ${email}`);
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
        // Don't fail the request if email sending fails
      }
    } else {
      console.warn('GMAIL_EMAIL or GMAIL_PASSWORD not set. Skipping email send.');
    }

    return NextResponse.json({ 
      success: true,
      message: 'Successfully joined!', 
      rank, 
      count: rank 
    });

  } catch (error) {
    console.error('Error in waitlist API:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
