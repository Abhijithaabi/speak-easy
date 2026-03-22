/**
 * @file app/api/transcribe/route.ts
 * @description Transcribes a raw PCM16 audio turn using the open-source 
 * Whisper-large-v3 model via the ultra-fast Groq API.
 */

import { NextResponse } from "next/server";

// Lightweight helper to wrap raw PCM16 data in a valid WAV file header
function createWavHeader(pcmLength: number, sampleRate: number = 24000) {
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + pcmLength, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16); // Subchunk1Size
  header.writeUInt16LE(1, 20);  // AudioFormat (1 for PCM)
  header.writeUInt16LE(1, 22);  // NumChannels (1 for Mono)
  header.writeUInt32LE(sampleRate, 24); // SampleRate
  header.writeUInt32LE(sampleRate * 2, 28); // ByteRate
  header.writeUInt16LE(2, 32);  // BlockAlign
  header.writeUInt16LE(16, 34); // BitsPerSample
  header.write("data", 36);
  header.writeUInt32LE(pcmLength, 40);
  return header;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const audioChunks: string[] = body.audioChunks;

    if (!audioChunks || audioChunks.length === 0) {
      return NextResponse.json({ text: "" }, { status: 200 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error("Missing GROQ_API_KEY in environment variables.");

    // 1. Reconstruct the raw PCM Buffer
    const pcmBuffers = audioChunks.map((b64) => Buffer.from(b64, "base64"));
    const combinedPcm = Buffer.concat(pcmBuffers);

    // 2. Generate a WAV header and prepend it to the raw PCM data
    const wavHeader = createWavHeader(combinedPcm.length, 24000);
    const completeWavBuffer = Buffer.concat([wavHeader, combinedPcm]);

    console.log(`[API/Transcribe] Sending ${completeWavBuffer.length} byte WAV file to Groq (Whisper)`);

    // 3. Package as FormData (Required by Whisper/Groq API)
    const formData = new FormData();
    const blob = new Blob([completeWavBuffer], { type: "audio/wav" });
    formData.append("file", blob, "audio.wav");
    formData.append("model", "whisper-large-v3");
    formData.append("temperature", "0.2"); // Keep transcription deterministic
    formData.append("language", "en"); // Optional: Speeds up processing slightly

    // 4. Send to Groq's insanely fast Whisper API
    const response = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`
      },
      body: formData,
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("[API/Transcribe] Groq Whisper error:", err);
      return NextResponse.json({ text: "" }, { status: 200 }); // Soft-fail to leave badge in UI
    }

    const data = await response.json();
    const text = data.text?.trim() || "";
    
    //console.log(`[API/Transcribe] Transcribed text: "${text}"`);

    return NextResponse.json({ text }, { status: 200 });
  } catch (error) {
    console.error("[API/Transcribe] Error:", error);
    return NextResponse.json({ text: "" }, { status: 200 });
  }
}