/**
 * @file app/api/transcribe-user/route.ts
 * @description Transcribes the user's microphone WebM blob using Groq Whisper.
 */

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as Blob;

    if (!file) {
      return NextResponse.json({ text: "" }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error("Missing GROQ_API_KEY in environment variables.");

    const groqFormData = new FormData();
    groqFormData.append("file", file, "user-audio.webm");
    groqFormData.append("model", "whisper-large-v3");
    // FIX 1: Lower temperature to 0 to prevent creative hallucinations
    groqFormData.append("temperature", "0"); 
    groqFormData.append("language", "en"); 
    // FIX 2: Explicit prompt to stop it from adding trailing words or locations
    groqFormData.append("prompt", "Transcribe the spoken English dialogue exactly as said. Do not add any extra words, locations, or commentary. If it is silent, output nothing.");

    const response = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}` },
      body: groqFormData,
    });

    if (!response.ok) {
      throw new Error(`Groq Error: ${await response.text()}`);
    }

    const data = await response.json();
    return NextResponse.json({ text: data.text?.trim() || "" }, { status: 200 });

  } catch (error) {
    console.error("[API/Transcribe-User] Error:", error);
    return NextResponse.json({ text: "" }, { status: 500 });
  }
}