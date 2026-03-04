/**
 * @file app/api/chat/route.ts
 * @description Handles dynamic scenarios using Groq.
 */

import { Groq } from "groq-sdk";
import { NextResponse } from "next/server";

const apiKey = process.env.GROQ_API_KEY || "";
const groqModel = process.env.GROQ_MODEL || "llama-3.1-8b-instant";
const groq = new Groq({ apiKey });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const userMessages = body.messages || [];
    const scenario = body.scenario || "Having a casual conversation.";

    if (!userMessages || userMessages.length === 0) {
      return NextResponse.json({ error: "Messages array is required" }, { status: 400 });
    }

    const formattedMessages = userMessages.map((msg: any) => ({
      role: (msg.role === "model" ? "assistant" : "user") as "assistant" | "user",
      content: msg.content,
    }));

    // Dynamically inject the scenario into the system prompt
    const systemPrompt = `You are playing a role in the following scenario: "${scenario}". 
    Fully embody the opposing character. Be realistic, push back, and do not immediately agree. 
    Keep your responses concise (1-3 sentences) and conversational.
    CRITICAL INSTRUCTION: NEVER include stage directions, actions, or tone indicators in parentheses or brackets. Do not output things like "(skeptical)" or "[sighs]". Output ONLY the spoken words.`;

    const messagesForGroq = [
      { role: "system" as const, content: systemPrompt },
      ...formattedMessages,
    ];

    const chatCompletion = await groq.chat.completions.create({
      messages: messagesForGroq,
      model: groqModel,
      max_tokens: 150,
      temperature: 0.7,
    });

    const aiResponseText = chatCompletion.choices[0]?.message?.content || "";
    return NextResponse.json({ reply: aiResponseText }, { status: 200 });
  } catch (error) {
    console.error("[API/Chat] Error:", error);
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
  }
}