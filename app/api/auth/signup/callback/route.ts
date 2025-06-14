import { NextRequest, NextResponse } from 'next/server';

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  // Your POST handler logic
  return NextResponse.json({ message: 'Success' });
}

export async function GET(request: NextRequest) {
  // Your GET handler logic
  return NextResponse.json({ message: 'Success' });
}