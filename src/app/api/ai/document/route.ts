import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { z } from 'zod';

export const runtime = 'nodejs';

const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;
const model = process.env.GROQ_MODEL || 'openai/gpt-oss-20b';

const documentSchema = z.object({
  pet: z.object({
    name: z.string().optional(),
    species: z.string().optional(),
    breed: z.string().optional(),
    age: z.string().optional()
  }).optional(),
  documentType: z.string(),
  reportedFacts: z.array(z.string()),
  labResults: z.array(z.object({
    test: z.string(),
    value: z.string(),
    unit: z.string(),
    referenceRange: z.string(),
    status: z.enum(['within_range', 'above_range', 'below_range', 'unknown'])
  })).optional(),
  medications: z.array(z.object({
    name: z.string(),
    dose: z.string(),
    frequency: z.string(),
    duration: z.string()
  })).optional(),
  symptoms: z.array(z.string()).optional(),
  followUpItems: z.array(z.string()).optional(),
  aiExplanation: z.array(z.string()).optional(),
  questionsForVet: z.array(z.string()).optional()
});

export async function POST(req: Request) {
  if (!groq) {
    console.log("Groq unavailable — using mock AI fallback.");
    return NextResponse.json({ error: 'Groq API Key not found' }, { status: 503 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const textParam = formData.get('text') as string | null;

    let extractedText = textParam || '';

    if (file && !textParam) {
      const buffer = Buffer.from(await file.arrayBuffer());
      if (file.type === 'application/pdf') {
        const { PDFParse } = await import('pdf-parse');
        const parser = new PDFParse({ data: buffer });
        try {
          const data = await parser.getText();
          extractedText = data.text;
        } finally {
          await parser.destroy();
        }
      } else if (file.type.startsWith('image/')) {
        const Tesseract = await import('tesseract.js');
        const result = await Tesseract.recognize(buffer, 'eng');
        extractedText = result.data.text;
      } else {
        return NextResponse.json({ error: 'Unsupported file type. Please use PDF, JPG, or PNG.' }, { status: 400 });
      }
    }

    if (!extractedText.trim()) {
      return NextResponse.json({ error: 'No readable text found in the document' }, { status: 400 });
    }

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are an AI Medical Document Assistant for animal healthcare. Your job is to extract structured information from veterinary reports.
          Do NOT diagnose, treat, or invent facts. Only extract information present in the document.
          If the document does not contain enough information, extract what you can and leave the rest empty.
          Output strictly in JSON format matching this schema exactly:
          {
            "pet": { "name": "", "species": "", "breed": "", "age": "" },
            "documentType": "",
            "reportedFacts": [""],
            "labResults": [{"test": "", "value": "", "unit": "", "referenceRange": "", "status": "within_range" | "above_range" | "below_range" | "unknown"}],
            "medications": [{"name": "", "dose": "", "frequency": "", "duration": ""}],
            "symptoms": [""],
            "followUpItems": [""],
            "aiExplanation": [""],
            "questionsForVet": [""]
          }
          Clearly separate REPORTED FACTS from AI EXPLANATION. AI EXPLANATION should only explain medical terms neutrally, do not diagnose.
          CRITICAL: Output ONLY valid JSON. Do not use markdown code blocks like \`\`\`json. Do not include any conversational text.`
        },
        {
          role: 'user',
          content: extractedText
        }
      ],
      model: model,
      temperature: 0,
      max_tokens: 4096
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('Empty response from Groq');

    // Robust JSON parsing (strip markdown code blocks if LLM added them)
    const cleanContent = content.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '').trim();
    
    const json = JSON.parse(cleanContent);
    const validated = documentSchema.parse(json);

    return NextResponse.json(validated);
  } catch (error: unknown) {
    console.error("Document API Error:", error);
    const message = error instanceof Error ? error.message : 'Failed to process document';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
