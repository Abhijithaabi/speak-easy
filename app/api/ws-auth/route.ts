/**
 * @file app/api/ws-auth/route.ts
 * @description Securely provides the Gemini API key and model ID to the client for the WebSocket connection.
 */

import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;
  // Fallback to the known Live API model if not explicitly set
  const model = process.env.GEMINI_LIVE_MODEL || "models/gemini-2.5-flash-native-audio-preview-12-2025";

  if (!apiKey) {
    return NextResponse.json({ error: "Missing API Key" }, { status: 500 });
  }

  return NextResponse.json({ apiKey, model }, { status: 200 });
}