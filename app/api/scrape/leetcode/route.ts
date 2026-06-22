import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json(
        { success: false, error: 'Username query parameter is required' },
        { status: 400 }
      );
    }

    return await fetchLeetCodeStats(username);
  } catch (error: any) {
    console.error('LeetCode API GET Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON request body' },
        { status: 400 }
      );
    }

    const { username } = body;
    if (!username) {
      return NextResponse.json(
        { success: false, error: 'Username is required in request body' },
        { status: 400 }
      );
    }

    return await fetchLeetCodeStats(username);
  } catch (error: any) {
    console.error('LeetCode API POST Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

async function fetchLeetCodeStats(username: string) {
  const query = `
    query userProblemsSolved($username: String!) {
      allQuestionsCount {
        difficulty
        count
      }
      matchedUser(username: $username) {
        submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
          }
        }
      }
    }
  `;

  const response = await fetch('https://leetcode.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
      'Referer': 'https://leetcode.com',
    },
    body: JSON.stringify({
      query,
      variables: { username },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('LeetCode GraphQL response not OK:', response.status, errorText);
    return NextResponse.json(
      { success: false, error: `Failed to fetch from LeetCode: ${response.statusText}` },
      { status: response.status }
    );
  }

  const result = await response.json();

  if (result.errors && result.errors.length > 0) {
    console.error('LeetCode GraphQL errors:', result.errors);
    return NextResponse.json(
      { success: false, error: result.errors[0].message || 'LeetCode API returned GraphQL errors' },
      { status: 400 }
    );
  }

  const matchedUser = result?.data?.matchedUser;
  if (!matchedUser) {
    return NextResponse.json(
      { success: false, error: `LeetCode user '${username}' not found` },
      { status: 404 }
    );
  }

  const submissionStats = matchedUser.submitStatsGlobal?.acSubmissionNum || [];
  
  let totalSolved = 0;
  let easySolved = 0;
  let mediumSolved = 0;
  let hardSolved = 0;

  for (const item of submissionStats) {
    const count = Number(item.count) || 0;
    switch (item.difficulty) {
      case 'All':
        totalSolved = count;
        break;
      case 'Easy':
        easySolved = count;
        break;
      case 'Medium':
        mediumSolved = count;
        break;
      case 'Hard':
        hardSolved = count;
        break;
    }
  }

  return NextResponse.json({
    success: true,
    username,
    totalSolved,
    easySolved,
    mediumSolved,
    hardSolved,
  });
}
