import { NextResponse } from 'next/server';
import { sendMessage } from '@/lib/db/queries';


export async function POST(request: Request) {
  try {
    const { userId, sessionId, content, type } = await request.json();
    
    if (!sessionId || !userId || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await sendMessage(userId, sessionId, content, type);
    
    if (!result) {
      return NextResponse.json(
        { error: 'Failed to send message' },
        { status: 500 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in messages API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}