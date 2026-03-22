/**
 * @file app/api/evaluate/route.ts
 * @description Evaluates the user's performance using Meta's Llama 3 via Groq.
 * Uses the already-separated frontend transcript to prevent AI/User voice mixing.
 */

import { NextResponse } from "next/server";

export const maxDuration = 60; 

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const scenario = body.scenario || "General conversation.";
    const transcripts = body.transcripts || [];

    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) throw new Error("Missing GROQ_API_KEY");

    // 1. Format the frontend transcript array into a clear script for Llama 3
    const chatLog = transcripts
      .filter((t: any) => !t.isInterim && !t.isTranscribing)
      .map((t: any) => `${t.role === 'partner' ? 'Partner (AI)' : 'User'}: ${t.text}`)
      .join('\n');

    // 2. SAFETY CHECK: Did the user actually say anything?
    const userSpoke = transcripts.some((t: any) => t.role === 'user' && t.text.trim().length > 0);

    // If they were completely silent, bypass the AI and return a hardcoded failure scorecard.
    if (!userSpoke) {
        return NextResponse.json({
            metrics: [
                { name: "Active Participation", score: 0, reasoning: "No speech was detected from the user during the session." },
                { name: "Vocal Confidence", score: 0, reasoning: "Unable to evaluate due to silence." },
                { name: "Engagement", score: 0, reasoning: "The user did not respond to the partner's prompts." }
            ],
            strengths: "You successfully initiated the scenario and listened to the partner.",
            weaknesses: "There was no audio input or spoken dialogue detected from your side.",
            actionable_advice: "Ensure your microphone is connected, and try to speak up and engage with the partner's prompts next time."
        }, { status: 200 });
    }

    // 3. Evaluate using Llama 3
    const evaluationPrompt = `
    You are an expert communication coach. Read the transcript of the roleplay scenario: "${scenario}".
    
    Here is the exact transcript of the conversation:
    """
    ${chatLog}
    """
    
    CRITICAL INSTRUCTIONS:
    1. Evaluate ONLY the "User"'s responses. Completely ignore the "Partner (AI)"'s text when scoring.
    2. Evaluate their delivery based on the transcript text. Look for filler words (um, uh), stuttering, or awkward phrasing which indicate their confidence level.
    3. DYNAMIC METRICS: Generate EXACTLY 3 evaluation metrics that are highly relevant to this specific scenario. 
       - AT LEAST ONE metric MUST evaluate their presumed vocal delivery/tone based on their word choice and filler words.

    Return ONLY a valid JSON object with exactly this structure:
    {
      "metrics": [
        {
          "name": "<Custom Metric 1 Name>",
          "score": <number 1-10>,
          "reasoning": "<1 sentence analyzing ONLY the User's delivery, tone, or word choice>"
        },
        {
          "name": "<Custom Metric 2 Name>",
          "score": <number 1-10>,
          "reasoning": "<1 sentence explaining why the User got this score>"
        },
        {
          "name": "<Custom Metric 3 Name>",
          "score": <number 1-10>,
          "reasoning": "<1 sentence explaining why the User got this score>"
        }
      ],
      "strengths": "<1-2 sentences on what the User did well logically or structurally>",
      "weaknesses": "<1-2 sentences on where the User failed, struggled, or used too many filler words>",
      "actionable_advice": "<2 specific, practical tips the User can use next time to improve>"
    }
    `;

    const chatRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${groqApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL_VERSATILE || "llama-3.3-70b-versatile", 
        messages: [
          { role: "system", content: "You are an API that outputs strictly formatted JSON." },
          { role: "user", content: evaluationPrompt }
        ],
        response_format: { type: "json_object" }, 
        temperature: 0.2
      })
    });

    if (!chatRes.ok) {
       const errText = await chatRes.text();
       throw new Error(`Groq Llama Error: ${errText}`);
    }

    const chatData = await chatRes.json();
    const aiResponseText = chatData.choices?.[0]?.message?.content || "{}";
    
    const evaluationData = JSON.parse(aiResponseText);
    return NextResponse.json(evaluationData, { status: 200 });
    
  } catch (error) {
    console.error("[API/Evaluate] Error:", error);
    return NextResponse.json({ error: "Failed to evaluate session" }, { status: 500 });
  }
}