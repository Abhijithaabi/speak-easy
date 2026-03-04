/**
 * @file app/api/tts/route.ts
 * @description Converts text to realistic speech audio using the ElevenLabs API.
 */

import { NextResponse } from "next/server";

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || "";
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || "";

/**
 * Handles POST requests to convert text to an audio stream.
 * @param {Request} request - The HTTP request containing the text to speak.
 * @returns {Promise<Response>} An audio/mpeg stream or an error response.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const text = body.text;

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    if (!ELEVENLABS_API_KEY || !VOICE_ID) {
      console.error("[API/TTS] Missing ElevenLabs credentials in environment variables.");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: "POST",
        headers: {
          "Accept": "audio/mpeg",
          "xi-api-key": ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text,
          // Updated to the current model supported on the free tier
          model_id: "eleven_turbo_v2_5",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("[API/TTS] ElevenLabs API Error:", errorData);
      throw new Error("Failed to generate audio from TTS provider");
    }

    const audioBuffer = await response.arrayBuffer();

    // Return the raw audio buffer directly to the client browser
    return new Response(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });
  } catch (error) {
    console.error("[API/TTS] Error:", error);
    return NextResponse.json({ error: "TTS Generation Failed" }, { status: 500 });
  }
}