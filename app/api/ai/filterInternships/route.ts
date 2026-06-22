import { NextResponse } from 'next/server';
import { generateJSON } from '@/lib/aiService';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { internships, query } = body;

    if (!internships || !query) {
      return NextResponse.json(
        { success: false, error: 'Internships and query are required' },
        { status: 400 }
      );
    }

    const systemPrompt = `You are a precise data filtering agent. You are given a list of internship listings (each having an id, company, role, location, and tags) and a user query in natural language.
Analyze the user query and identify which of the internships match the search query (be flexible: check company names, roles, tags, and work mode locations).
Return ONLY a JSON object in the format: { "matchingIds": ["id1", "id2", ...] } containing the IDs of all matching internships.`;

    const userPrompt = `Listings: ${JSON.stringify(internships)}
User Query: "${query}"`;

    let result;
    try {
      result = await generateJSON(systemPrompt, userPrompt);
    } catch (aiError) {
      console.warn("AI filtering failed or key not configured. Using fallback local search.", aiError);
      
      // Fallback local keyword parsing
      const keywords = String(query).toLowerCase().split(/\s+/).filter((w) => w.length > 2);
      const matchingIds = internships.filter((item: any) => {
        const itemText = `${item.company} ${item.role} ${item.location} ${(item.tags || []).join(' ')}`.toLowerCase();
        // Match word queries or simple terms
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
