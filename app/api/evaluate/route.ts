/**
 * @file app/api/evaluate/route.ts
 * @description Evaluates the user's performance using Meta's Llama 3 via Groq.
 * Includes strict "Fatal Criteria" to penalize off-topic or out-of-character behavior.
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

    // 3. Evaluate using Llama 3 with STRICT off-topic penalties
    const evaluationPrompt = `
    You are an expert, strict communication coach. Read the transcript of the roleplay scenario: "${scenario}".
    
    Here is the exact transcript of the conversation:
    """
    ${chatLog}
    """
    
    CRITICAL INSTRUCTIONS (STRICT GRADING):
    1. SCENARIO ALIGNMENT (FATAL CRITERIA): First, determine if the User actually engaged with the assigned scenario ("${scenario}"). If the User went completely off-topic, talked about random things (like changing languages, breaking character, or discussing AI), their scores MUST be harshly penalized (1-3 out of 10 maximum) and this failure must be the primary focus of the weaknesses.
    2. Evaluate ONLY the "User"'s responses. Completely ignore the "Partner (AI)"'s text when scoring.
    3. Evaluate their delivery based on the transcript text. Look for filler words (um, uh), stuttering, or awkward phrasing which indicate their confidence level.
    4. DYNAMIC METRICS: Generate EXACTLY 3 evaluation metrics. 
       - Metric 1 MUST be "Scenario Alignment" evaluating if they stayed on topic and played their role.
       - Metric 2 MUST evaluate their presumed vocal delivery/tone (e.g., Vocal Confidence, Clarity) based on word choice/fillers.
       - Metric 3 should be relevant to the specific scenario's goal (e.g., Negotiation Tactics, Empathy, Persuasion).

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
      "weaknesses": "<1-2 sentences on where the User failed, strayed off-topic, struggled, or used too many filler words>",
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
        temperature: 0.1 // Lowered temperature to make the AI less "creative" and more analytical
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