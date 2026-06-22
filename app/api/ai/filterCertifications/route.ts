import { NextResponse } from 'next/server';
import { generateJSON } from '@/lib/aiService';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { certifications, query } = body;

    if (!certifications || !query) {
      return NextResponse.json(
        { success: false, error: 'Certifications and query are required' },
        { status: 400 }
      );
    }

    const systemPrompt = `You are a precise data filtering agent. You are given a list of certification listings (each having an id, title, provider, category, and optionally skills) and a user query in natural language.
Analyze the user query and identify which of the certifications match the search query (be flexible: check provider names, titles, categories, and skills).
Return ONLY a JSON object in the format: { "matchingIds": ["id1", "id2", ...] } containing the IDs of all matching certifications.`;

    const userPrompt = `Listings: ${JSON.stringify(certifications)}
User Query: "${query}"`;

    let result;
    try {
      result = await generateJSON(systemPrompt, userPrompt);
    } catch (aiError) {
      console.warn("AI filtering failed or key not configured. Using fallback local search.", aiError);
      
      // Fallback local keyword parsing
      const keywords = String(query).toLowerCase().split(/\s+/).filter((w) => w.length > 2);
      const matchingIds = certifications.filter((item: any) => {
        const skillsText = (item.skills || []).join(' ');
        const itemText = `${item.title} ${item.provider} ${item.category} ${skillsText}`.toLowerCase();
        return keywords.length === 0 || keywords.some((kw) => itemText.includes(kw));
      }).map((item: any) => item.id);

      result = { matchingIds };
    }

    return NextResponse.json({
      success: true,
      matchingIds: result.matchingIds || []
    });
  } catch (error: any) {
    console.error('Filter AI Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
