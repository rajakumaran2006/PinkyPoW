import { NextResponse } from "next/server";
import { generateJSON } from "@/lib/ai-service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { transcription, promptQuestion } = body;

    // Validation
    if (!transcription || !promptQuestion) {
      return NextResponse.json(
        { error: "Missing required parameters (transcription, promptQuestion)" },
        { status: 400 }
      );
    }

    const systemPrompt = `You are an expert Communications Coach and executive presentation coach. Your job is to analyze a transcription of a candidate's spoken response to an interview question.
You must critically assess the spoken text for vocabulary quality, grammar correctness, and delivery confidence (judged by filler words like "um", "uh", "like", "you know", "basically", "so").

You must return a JSON object containing:
1. "vocabularyScore": an integer from 1 to 10. High scores represent clear, precise vocabulary and proper technical terminology without excessive repetition.
2. "grammarScore": an integer from 1 to 10. High scores represent grammatical correctness and strong sentence structure.
3. "confidenceEstimate": a string, which must be either "Low", "Medium", or "High" depending on filler words and speech flow.
4. "feedback": exactly a two-sentence constructive critique. Highlight one positive element of their delivery or content, and one specific suggestion for improvement.
5. "nextChallenge": exactly a one-sentence speaking prompt for tomorrow's standup, tailored to push their boundaries or introduce a related interview topic.

Do not output any introductory or concluding text. Return ONLY the JSON object.`;

    const userPrompt = `Evaluate the candidate's spoken answer:
- Question Asked: "${promptQuestion}"
- Candidate's Speech Transcript: "${transcription}"`;

    const evaluationData = await generateJSON(systemPrompt, userPrompt);

    return NextResponse.json(evaluationData);
  } catch (error: any) {
    console.error("AI Speech Evaluation Route Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to evaluate speech" },
      { status: 500 }
    );
  }
}
