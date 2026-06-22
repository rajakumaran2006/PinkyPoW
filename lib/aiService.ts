import { Groq } from "groq-sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Calls Groq API to generate structured JSON.
 */
async function generateJSONWithGroq(systemPrompt: string, userPrompt: string): Promise<any> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not defined in environment variables.");
  }
  const groq = new Groq({ apiKey });
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.2,
    response_format: { type: "json_object" },
  });
  
  const text = response.choices[0]?.message?.content || "{}";
  return JSON.parse(text);
}

/**
 * Calls Google Gemini API to generate structured JSON.
 */
async function generateJSONWithGemini(systemPrompt: string, userPrompt: string): Promise<any> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined in environment variables.");
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: systemPrompt,
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.2,
    },
  });
  
  const result = await model.generateContent(userPrompt);
  const response = await result.response;
  const text = response.text();
  return JSON.parse(text);
}

/**
 * Unified entry point to call Groq or Gemini based on environment configuration.
 */
export async function generateJSON(systemPrompt: string, userPrompt: string): Promise<any> {
  const provider = process.env.AI_PROVIDER?.toLowerCase();

  // If a provider is explicitly configured, use it.
  if (provider === "groq") {
    return generateJSONWithGroq(systemPrompt, userPrompt);
  }
  if (provider === "gemini") {
    return generateJSONWithGemini(systemPrompt, userPrompt);
  }

  // Fallback: Auto-detect based on defined API keys.
  if (process.env.GROQ_API_KEY) {
    console.log("AI Auto-detection: Using Groq");
    return generateJSONWithGroq(systemPrompt, userPrompt);
  }
  if (process.env.GEMINI_API_KEY) {
    console.log("AI Auto-detection: Using Gemini");
    return generateJSONWithGemini(systemPrompt, userPrompt);
  }

  throw new Error(
    "No AI provider configured. Please set either GROQ_API_KEY or GEMINI_API_KEY in your environment, or configure AI_PROVIDER."
  );
}
