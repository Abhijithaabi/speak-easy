/**
 * @file app/api/evaluate/route.ts
 * @description Generates deep, contextual feedback using Groq JSON mode.
 */

import { Groq } from "groq-sdk";
import { NextResponse } from "next/server";

const apiKey = process.env.GROQ_API_KEY || "";
const groqModel = process.env.GROQ_MODEL || "llama-3.1-8b-instant";
const groq = new Groq({ apiKey });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const messages = body.messages || [];
    const scenario = body.scenario || "General conversation.";

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "No transcript provided" }, { status: 400 });
    }

    const transcript = messages.map((msg: any) => 
      `${msg.role === "user" ? "User" : "AI Persona"}: ${msg.content}`
    ).join("\n");

    const evaluationPrompt = `
    You are an expert communication coach. Review this transcript for the scenario: "${scenario}".
    Evaluate the user's performance.

    Return ONLY a valid JSON object with exactly these keys:
    {
      "metrics": [
        {
          "name": "<Name of metric 1 highly relevant to this specific scenario, e.g., 'De-escalation', 'Technical Clarity', etc.>",
          "score": <number 1-10>,
          "reasoning": "<1 sentence explaining exactly why they got this score based on their words>"
        },
        // Must contain exactly 3 metric objects
      ],
      "strengths": "<1-2 sentences on what they did well>",
      "weaknesses": "<1-2 sentences on where they failed or struggled>",
      "actionable_advice": "<2 specific, practical tips they can use next time to improve>"
    }
    `;

    const messagesForGroq = [
      { role: "system" as const, content: evaluationPrompt },
      { role: "user" as const, content: `Transcript:\n${transcript}` }
    ];

    const chatCompletion = await groq.chat.completions.create({
      messages: messagesForGroq,
      model: groqModel,
      response_format: { type: "json_object" },
      temperature: 0.2, 
    });

    const aiResponseText = chatCompletion.choices[0]?.message?.content || "{}";
    const evaluationData = JSON.parse(aiResponseText);
    
    return NextResponse.json(evaluationData, { status: 200 });
  } catch (error) {
    console.error("[API/Evaluate] Error:", error);
    return NextResponse.json({ error: "Failed to evaluate" }, { status: 500 });
  }
}