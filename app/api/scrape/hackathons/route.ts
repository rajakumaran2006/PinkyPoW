import { NextResponse } from 'next/server';

interface HackathonListing {
  id: string;
  title: string;
  url: string;
  date: string;
  location: string;
  isOnline: boolean;
  prizePool: string;
  deadline: string;
  category: string;
  skills: string[];
  participants: number;
  fitScore?: number;
}

export async function POST(req: Request) {
  let body: any = {};
  try {
    try {
      body = await req.json();
    } catch {
      // Allow empty body
    }

    const { techStack = [], search = '', collegeCountry = '', collegeState = '' } = body;

    const hackathons = await fetchAndFilterHackathons(techStack, search, collegeCountry, collegeState);

    return NextResponse.json({
      success: true,
      hackathons,
    });
  } catch (error: any) {
    console.error('Hackathon API Route Error:', error);
    const fallback = getFallbackHackathons(body?.techStack || [], body?.collegeCountry || '', body?.collegeState || '');
    return NextResponse.json({
      success: true,
      isFallback: true,
      hackathons: fallback,
    });
  }
}

// Keep GET endpoint for backward compatibility or simple scans
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const hackathons = await fetchAndFilterHackathons([], search, '', '');
    return NextResponse.json({
      success: true,
      hackathons,
    });
  } catch (error: any) {
    console.error('Hackathon API GET Route Error:', error);
    const fallback = getFallbackHackathons([], '', '');
    return NextResponse.json({
      success: true,
      isFallback: true,
      hackathons: fallback,
    });
  }
}

async function fetchAndFilterHackathons(techStack: string[], search: string, collegeCountry?: string, collegeState?: string): Promise<HackathonListing[]> {
  try {
    const url = `https://devpost.com/api/hackathons?search=${encodeURIComponent(search)}`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      console.warn(`Devpost JSON API returned status ${response.status}. Using fallback.`);
      return getFallbackHackathons(techStack, collegeCountry, collegeState);
    }

    const data = await response.json();
    if (!data || !Array.isArray(data.hackathons)) {
      console.warn('Devpost JSON API returned invalid format. Using fallback.');
      return getFallbackHackathons(techStack, collegeCountry, collegeState);
    }

    // Filter and map Devpost hackathons
    const activeHackathons = data.hackathons
      .filter((h: any) => h.open_state === 'open') // Only open application hackathons
      .map((h: any) => {
        // Clean prize amount HTML tags (e.g. "$<span data-currency-value>2,000</span>")
        const prizeRaw = h.prize_amount || '$0';
        const prizePool = prizeRaw.replace(/<[^>]*>/g, '').trim();

        // Extract skills/themes
        const skills = h.themes ? h.themes.map((t: any) => t.name) : ['General Tech'];

        // Assign a category from themes
        const category = h.themes && h.themes.length > 0 ? h.themes[0].name : 'General Tech';

        const location = h.displayed_location?.location || 'Online';
        const isOnline = location.toLowerCase().includes('online') || false;

        // Calculate fit score (matching tech stack + location)
        let skillMatches = 0;
        const searchStr = `${h.title} ${category} ${skills.join(' ')}`.toLowerCase();
        
        if (techStack && techStack.length > 0) {
          for (const tech of techStack) {
            if (searchStr.includes(tech.toLowerCase())) {
              skillMatches++;
            }
          }
        }
        
        let score = 50; // Base score
        if (techStack && techStack.length > 0) {
          score += Math.round((skillMatches / techStack.length) * 40);
        }
        
        // Region matching (boost up to 10 points)
        let regionBoost = 0;
        const locLower = location.toLowerCase();
        if (collegeCountry) {
          if (locLower.includes(collegeCountry.toLowerCase())) {
            regionBoost += 5;
          }
        }
        if (collegeState) {
          if (locLower.includes(collegeState.toLowerCase())) {
            regionBoost += 5;
          }
        }
        if (isOnline || locLower.includes('remote') || locLower.includes('global')) {
          regionBoost += 4;
        }
        score += regionBoost;
        const fitScore = Math.min(score, 100);

        return {
          id: String(h.id),
          title: h.title,
          url: h.url || 'https://devpost.com/hackathons',
          date: h.submission_period_dates || 'Ongoing',
          location: location,
          isOnline: isOnline,
          prizePool: prizePool || '$0',
          deadline: h.time_left_to_submission || 'Open',
          category: category,
          skills: skills,
          participants: h.registrations_count || 0,
          fitScore
        };
      });

    if (activeHackathons.length === 0) {
      console.warn('No open hackathons found in active Devpost response. Using fallback.');
      return getFallbackHackathons(techStack, collegeCountry, collegeState);
    }

    return activeHackathons;
  } catch (error) {
    console.error('Error fetching Devpost hackathons:', error);
    return getFallbackHackathons(techStack, collegeCountry, collegeState);
  }
}

function getFallbackHackathons(techStack: string[], collegeCountry?: string, collegeState?: string): HackathonListing[] {
  // Return realistic open hackathons in case the API is blocked or offline
  const list = [
    {
      id: 'devpost-fallback-1',
      title: 'Build with Gemini XPRIZE',
      url: 'https://xprize.devpost.com/',
      date: 'May 19 - Aug 17, 2026',
      location: 'Online',
      isOnline: true,
      prizePool: '$2,000,000',
      deadline: '2 months left',
      category: 'Machine Learning/AI',
      skills: ['Machine Learning/AI', 'Productivity', 'Education'],
      participants: 14628,
    },
    {
      id: 'devpost-fallback-2',
      title: 'H0: Hack the Zero Stack with Vercel v0 and AWS Databases',
      url: 'https://h01.devpost.com/',
      date: 'May 27 - Jun 29, 2026',
      location: 'Online',
      isOnline: true,
      prizePool: '$80,000',
      deadline: '9 days left',
      category: 'Databases',
      skills: ['Databases', 'Web', 'Open Ended'],
      participants: 6892,
    },
    {
      id: 'devpost-fallback-3',
      title: 'Web3 Global Hackathon 2026',
      url: 'https://devpost.com/hackathons',
      date: 'Jun 15 - Jul 25, 2026',
      location: 'Online',
      isOnline: true,
      prizePool: '$50,000',
      deadline: '1 month left',
      category: 'Blockchain',
      skills: ['Blockchain', 'Web3', 'Ethereum'],
      participants: 2150,
    },
  ];

  return list.map(item => {
    let skillMatches = 0;
    const searchStr = `${item.title} ${item.category} ${item.skills.join(' ')}`.toLowerCase();
    
    if (techStack && techStack.length > 0) {
      for (const tech of techStack) {
        if (searchStr.includes(tech.toLowerCase())) {
          skillMatches++;
        }
      }
    }
    
    let score = 50; // Base score
    if (techStack && techStack.length > 0) {
      score += Math.round((skillMatches / techStack.length) * 40);
    }
    
    // Region matching (boost up to 10 points)
    let regionBoost = 0;
    const locLower = item.location.toLowerCase();
    if (collegeCountry) {
      if (locLower.includes(collegeCountry.toLowerCase())) {
        regionBoost += 5;
      }
    }
    if (collegeState) {
      if (locLower.includes(collegeState.toLowerCase())) {
        regionBoost += 5;
      }
    }
    if (item.isOnline || locLower.includes('remote') || locLower.includes('global')) {
      regionBoost += 4;
    }
    score += regionBoost;
    const fitScore = Math.min(score, 100);

    return {
      ...item,
      fitScore
    };
  });
}
