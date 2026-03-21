/**
 * @file app/api/evaluate/route.ts
 * @description Evaluates the user's performance using Gemini, generating dynamic metrics based on the scenario context.
 */

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const audioBase64 = body.audioBase64;
    const mimeType = body.mimeType || "audio/webm";
    const scenario = body.scenario || "General conversation.";

    if (!audioBase64) {
      return NextResponse.json({ error: "No audio provided" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Missing GEMINI_API_KEY");

    const evaluationPrompt = `
    You are an expert communication coach. Listen to the attached audio recording of the user. 
    They were participating in a roleplay scenario: "${scenario}".
    
    CRITICAL INSTRUCTIONS:
    1. Evaluate their PHYSICAL delivery. Listen for stuttering, awkward pauses, filler words, and the confidence in their tone.
    2. DYNAMIC METRICS: Generate EXACTLY 3 evaluation metrics that are highly relevant to this specific scenario. 
       - For example, if it's a formal interview, use metrics like "Technical Clarity" or "Professionalism". 
       - If it's a casual chat with a friend, use metrics like "Empathy", "Active Listening", or "De-escalation".
       - AT LEAST ONE metric MUST evaluate their physical vocal delivery and tone.

    Return ONLY a valid JSON object with exactly this structure:
    {
      "metrics": [
        {
          "name": "<Custom Metric 1 Name>",
          "score": <number 1-10>,
          "reasoning": "<1 sentence explicitly analyzing their audio delivery, tone, or word choice>"
        },
        {
          "name": "<Custom Metric 2 Name>",
          "score": <number 1-10>,
          "reasoning": "<1 sentence explaining why they got this score>"
        },
        {
          "name": "<Custom Metric 3 Name>",
          "score": <number 1-10>,
          "reasoning": "<1 sentence explaining why they got this score>"
        }
      ],
      "strengths": "<1-2 sentences on what they did well vocally or logically>",
      "weaknesses": "<1-2 sentences on where they failed, struggled, or stuttered>",
      "actionable_advice": "<2 specific, practical tips they can use next time to improve>"
    }
    `;

    // Standard Gemini 2.5 REST API call
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: evaluationPrompt },
            { inline_data: { mime_type: mimeType, data: audioBase64 } }
          ]
        }],
        generationConfig: { 
          responseMimeType: "application/json",
          temperature: 0.4 // Slightly higher temperature so it can be creative with the metric names
        }
      })
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      throw new Error(`Gemini API Error: ${errorText}`);
    }

    const data = await geminiResponse.json();
    const aiResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    
    const evaluationData = JSON.parse(aiResponseText);
    return NextResponse.json(evaluationData, { status: 200 });
    
  } catch (error) {
    console.error("[API/Evaluate] Error:", error);
    return NextResponse.json({ error: "Failed to evaluate audio" }, { status: 500 });
  }
}