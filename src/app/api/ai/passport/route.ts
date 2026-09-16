import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;
const model = process.env.GROQ_MODEL || 'openai/gpt-oss-20b';

export async function POST(req: Request) {
  if (!groq) {
    console.log("Groq unavailable — using mock AI fallback.");
    return NextResponse.json({ error: 'Groq API Key not found' }, { status: 503 });
  }

  try {
    const { timeline } = await req.json();

    if (!timeline) {
      return NextResponse.json({ error: 'Timeline data is required' }, { status: 400 });
    }

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are an AI Care Passport assistant. You will be provided with a timeline of medical events for an animal.
          Summarize their health journey chronologically without diagnosing. Use ONLY the facts provided in the timeline.
          Do NOT invent medical history or conditions.
          Return strictly JSON with the following structure:
          {
            "summary": "Concise chronological summary of the timeline",
            "questions": ["array of 2-3 logical follow-up questions for the veterinarian based on the history"]
          }`
        },
        {
          role: 'user',
          content: JSON.stringify(timeline)
        }
      ],
      model: model,
      temperature: 0,
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('Empty response from Groq');

    const json = JSON.parse(content);
    return NextResponse.json(json);
  } catch (error) {
    console.log("Groq unavailable — using mock AI fallback.", error);
    return NextResponse.json({ error: 'Failed to process timeline' }, { status: 500 });
  }
}
