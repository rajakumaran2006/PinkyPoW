# PinkyPoW — AI Engine & Architecture

## 1. System Architecture Overview

```
+------------------------------------------------------------------+
|                        PINKYPOW PLATFORM                         |
+------------------------------------------------------------------+
|                                                                  |
|   +------------------+        +----------------------------+     |
|   |   NEXT.JS CLIENT |        |     MONGODB DATABASE       |     |
|   |   (React/TSX)    | <----> |                            |     |
|   |                  |        |  Collections:              |     |
|   |  - Dashboard     |        |  - users                   |     |
|   |  - DSA Tracker   |        |  - dsaprogress             |     |
|   |  - Certifications|        |  - portfolios              |     |
|   |  - Hackathons    |        |  - hackathons              |     |
|   |  - Internships   |        |  - internships             |     |
|   |  - Portfolio     |        +----------------------------+     |
|   +--------+---------+                   ^                       |
|            |                             |                       |
|            v                             |                       |
|   +------------------+        +----------+------------------+    |
|   |  NEXT.JS API     |        |     AI SERVICE LAYER        |    |
|   |  ROUTE LAYER     +------> |     (lib/aiService.ts)      |    |
|   |                  |        |                             |    |
|   |  /api/ai/dsa     |        |  [PRIMARY]  Groq            |    |
|   |  /api/ai/certs   |        |  llama-3.3-70b-versatile   |    |
|   |  /api/ai/speech  |        |                             |    |
|   |  /api/ai/roadmap |        |  [FALLBACK] Gemini          |    |
|   |  /api/ai/filters |        |  gemini-1.5-flash          |    |
|   |  /api/scrape     |        |                             |    |
|   |  /api/upload     |        |  JSON Schema Enforcement    |    |
|   +------------------+        +-----------------------------+    |
|                                                                  |
+------------------------------------------------------------------+
```


## 2. Core AI Decision Engine

The AI inside PinkyPoW is NOT a simple wrapper. It operates as a
Stateful, Context-Aware Orchestrator. Before any LLM call is made,
the system retrieves the user's entire history from MongoDB and
injects that state into the prompt.

### The Core Loop (Step-by-Step)

```
USER ACTION (clicks "Generate Problem", "Scan Certs", etc.)
     |
     v
[1] CLIENT sends HTTP request to Next.js API Route
     |
     v
[2] API ROUTE: Pull User State from MongoDB
     |
     +-- User.placementScore   (0–1000 range)
     +-- User.dailyStreak      (consecutive days solved)
     +-- User.techStack        (preferred languages/frameworks)
     +-- DSA.completedProblems (full list of solved titles)
     +-- DSA.planRoadmap       (day-by-day schedule)
     +-- DSA.currentDayIndex   (where the user is today)
     |
     v
[3] AI ORCHESTRATOR: Build Contextual Prompt
     |
     +-- systemPrompt: Role, JSON schema, constraints
     +-- userPrompt:   Live DB state injected dynamically
     |
     v
[4] ROUTE DECISION
     |
     +-- AI_PROVIDER env var = "groq"?  --> Groq Llama 3.3 70B
     +-- AI_PROVIDER env var = "gemini"?--> Google Gemini 1.5 Flash
     +-- No env var?  Auto-detect by checking which API key exists
     |
     v
[5] LLM CALL (temperature=0.2, response_format=json_object)
     |
     v
[6] JSON RESPONSE PARSED & VALIDATED
     |
     v
[7] DATABASE MUTATION
     |
     +-- placementScore updated (+ or -)
     +-- dailyStreak incremented
     +-- completedProblems list appended
     +-- dsaProgress saved
     |
     v
[8] RESPONSE returned to CLIENT
     |
     v
USER sees updated UI with new score, problems, and recommendations
```


## 3. Multi-Model Provider Router

```
                        generateJSON()
                             |
                    Check AI_PROVIDER env
                             |
            +----------------+----------------+
            |                                 |
      provider="groq"                  provider="gemini"
            |                                 |
    No env var set?               No env var set?
            |                                 |
            v                                 v
   Auto-detect:                      Auto-detect:
   GROQ_API_KEY?  --> Groq           GEMINI_API_KEY? --> Gemini
            |
            v
   Both missing? --> throw Error (no provider configured)


GROQ PATH:
  Model : llama-3.3-70b-versatile
  Temp  : 0.2
  Format: json_object (enforced at API level)
  Speed : ~300ms (ultra-fast inference)

GEMINI PATH:
  Model : gemini-1.5-flash
  Temp  : 0.2
  Format: responseMimeType="application/json"
  Speed : ~800ms (fallback path)
```


## 4. DSA AI Sub-Engine — Full Flow

This is the most complex AI module. It has 5 distinct actions:

```
ACTION: "create-plan"
---------------------
  Input:  level, totalDays, problemsPerDay, topics[]
  AI Job: Generate day-by-day roadmap
  Output: planRoadmap[] = [{day, topic, description}]
  Saved:  DSA.planRoadmap, DSA.hasCustomPlan = true

ACTION: "generate-problem"
---------------------------
  Input:  dayNumber
  AI Job: Create brand-new coding problem for that day's topic
  Context injected into prompt:
    - dayPlan.topic (from roadmap)
    - user.interests
    - dsaProgress.completedProblems (AVOID duplicates)
    - solvedHistory from all previous days
  Output: problems[] with id, title, description, difficulty,
          category, platform, url, codeTemplate
  Saved:  DSA.dailyProblems[dayNumber]

ACTION: "toggle-problem"
-------------------------
  Input:  problemId, completed (boolean)
  Logic:
    - Find problem in dailyProblems
    - Update completed flag + solvedAt timestamp
    - Recalculate placementScore:
        Easy  = +15 / -15
        Medium= +30 / -30
        Hard  = +55 / -55
    - If all problems for current day are solved: dailyStreak++
  No LLM call. Pure DB logic.

ACTION: "submit-solution"
--------------------------
  Input:  problemId
  Logic:
    - Mark problem completed permanently
    - Calculate score delta by difficulty
    - Increment dailyStreak if day is fully done
    - Cap placementScore at 1000 max
  No LLM call. Pure DB mutation.

ACTION: "advance-day"
----------------------
  Input:  (none, inferred from currentDayIndex)
  Logic:
    - Increment currentDayIndex by 1
    - Increment dailyStreak
    - Stop if currentDayIndex >= totalDays
  No LLM call. Pure state transition.
```


## 5. Certifications AI Sub-Engine

```
ACTION: "scan"
---------------
  Input:  user.techStack (from DB)
  AI Job: Search knowledge base for free industry certifications
          (Google, AWS, GitHub Student Pack, Reddit/CS career,
           NVIDIA Deep Learning Institute, Harvard CS50, freeCodeCamp)
  Output: recommendations[] with id, title, provider, platform,
          category, duration, valueScore (1–100), skills[], link
  Saved:  Not saved. Returned live for user to choose.

ACTION: "add-cert"
-------------------
  Input:  title, issuer, date, link, category, cloudinaryImageUrl
  Logic:
    - Append certificate to Portfolio.certificates[]
    - Award user.placementScore += 25
  No LLM call.

ACTION: "complete-cert"
------------------------
  Input:  certId
  Logic:
    - Set cert.isAiValidated = true
  No LLM call.
```


## 6. Speech Evaluation AI Sub-Engine

```
USER speaks or types answer to HR/mock interview question
     |
     v
POST /api/ai/evaluateSpeech
     |
     v
AI receives:
  - The original interview question
  - The candidate's spoken/typed answer (transcript)
  - User context (techStack, placementScore, etc.)
     |
     v
LLM evaluates on:
  - Clarity of communication
  - Technical accuracy
  - Confidence indicators
  - Structure (STAR method if applicable)
     |
     v
Returns JSON:
  - score (0–100)
  - feedback (string)
  - improvementTips[]
     |
     v
Score contributes to overall placementScore in DB
```


## 7. Roadmap Generator AI Sub-Engine

```
POST /api/ai/generateRoadmap
     |
     v
Input: user.techStack, user.interests, user.placementScore,
       user.yearOfStudy, user.preferredRole
     |
     v
AI generates personalized learning roadmap:
  - Phase 1: Foundation skills (based on current level)
  - Phase 2: Domain-specific path (based on preferredRole)
  - Phase 3: Placement-ready milestones
     |
     v
Output: structured JSON roadmap with weeks, milestones, resources
```


## 8. Filter AI Sub-Engines (Hackathons / Internships / Certifications)

```
POST /api/ai/filterHackathons
POST /api/ai/filterInternships
POST /api/ai/filterCertifications
     |
     v
Input: user profile (techStack, interests, location, preferredRole)
       + raw scraped data from /api/scrape
     |
     v
AI ranks and filters items by relevance score
     |
     v
Returns: sorted, curated list with match scores
```


## 9. Placement Score System

```
Score Range: 0 — 1000 (hard capped)

+------------------------------------+----------+
| Action                             | Delta    |
+------------------------------------+----------+
| Solve Easy DSA Problem             | +15      |
| Solve Medium DSA Problem           | +30      |
| Solve Hard DSA Problem             | +55      |
| Add a Certificate to Portfolio     | +25      |
| Unmark Easy DSA Problem            | -15      |
| Unmark Medium DSA Problem          | -30      |
| Unmark Hard DSA Problem            | -55      |
| Score floor (minimum)              | 100      |
| Score ceiling (maximum)            | 1000     |
+------------------------------------+----------+

Score is used by AI to calibrate:
  - DSA problem difficulty distribution
  - Certification recommendation ranking
  - Roadmap phase determination
```


## 10. Data Models & State

```
USER (MongoDB: users)
+-------------------+-----------------------------+
| Field             | Purpose in AI               |
+-------------------+-----------------------------+
| techStack[]       | Certification relevance     |
| placementScore    | Difficulty calibration      |
| dailyStreak       | Progress tracking           |
| interests[]       | Problem topic targeting     |
| preferredRole     | Roadmap and filter context  |
| certInterests[]   | Certification scan filter   |
| isProfileCalibrated| First-run calibration flag |
+-------------------+-----------------------------+

DSA PROGRESS (MongoDB: dsaprogress)
+-------------------+-----------------------------+
| Field             | Purpose in AI               |
+-------------------+-----------------------------+
| currentTrack      | 30/60/90 day plan type      |
| planRoadmap[]     | Day-by-day schedule from AI |
| dailyProblems[]   | AI-generated problems cache |
| completedProblems | Injected into prompts to    |
|                   | prevent duplicate questions |
| currentDayIndex   | Current position in plan    |
| level             | Beginner/Intermediate/Adv   |
+-------------------+-----------------------------+

PORTFOLIO (MongoDB: portfolios)
+-------------------+-----------------------------+
| Field             | Purpose in AI               |
+-------------------+-----------------------------+
| certificates[]    | AI-validated credentials    |
| projects[]        | Portfolio context for AI    |
| isAiValidated     | Cert verification flag      |
+-------------------+-----------------------------+
```


## 11. What Makes This Different From a Standard AI Wrapper

```
+---------------------------+--------------------+------------------------+
| Feature                   | Standard Wrapper   | PinkyPoW AI Engine     |
+---------------------------+--------------------+------------------------+
| User Memory               | None. Every call   | Full history from DB   |
|                           | is a fresh chat.   | injected each request. |
+---------------------------+--------------------+------------------------+
| Duplicate Prevention      | None.              | completedProblems list |
|                           |                    | passed to LLM as AVOID.|
+---------------------------+--------------------+------------------------+
| Provider Resilience       | Single model.      | Groq primary + Gemini  |
|                           | Fails if API down. | fallback auto-switch.  |
+---------------------------+--------------------+------------------------+
| Difficulty Calibration    | Static difficulty. | Adjusts based on live  |
|                           |                    | placementScore (0-1000)|
+---------------------------+--------------------+------------------------+
| Output Reliability        | Freeform text.     | Forced JSON schema at  |
|                           | Parsing breaks.    | LLM level (not regex). |
+---------------------------+--------------------+------------------------+
| Score-Driven Adaptation   | None.              | Every solved problem   |
|                           |                    | mutates DB + changes   |
|                           |                    | future AI context.     |
+---------------------------+--------------------+------------------------+
| Problem Personalization   | Generic problems.  | Topics from roadmap,   |
|                           |                    | user interests, level. |
+---------------------------+--------------------+------------------------+
```


## 12. End-to-End Request Lifecycle (Single Example)

User clicks "Generate Problem" for Day 3 of their DSA Plan:

```
CLIENT
  |-- POST /api/ai/dsa { action: "generate-problem", dayNumber: 3 }
  |
  v
API ROUTE (app/api/ai/dsa/route.ts)
  |-- connectDB()
  |-- getOrCreateUser(clerkId)              --> pull user from MongoDB
  |-- DSA.findOne({ userId })               --> pull dsaProgress
  |-- dayPlan = planRoadmap.find(day === 3) --> "Binary Trees - BFS"
  |-- Check if dailyProblems[day=3] exists  --> No, generate fresh
  |-- Build solvedHistory from all prev days
  |
  v
PROMPT CONSTRUCTION
  systemPrompt = dsa_problem_instructions.md (read from disk)
  userPrompt   = "Generate 2 problems for Day 3:
                  - Topic: Binary Trees - BFS
                  - Level: Intermediate
                  - Interests: [React, Node.js]
                  - AVOID: [Two Sum, Reverse Linked List, ...]
                  - Solved History Days 1-2: [...]"
  |
  v
aiService.generateJSON(systemPrompt, userPrompt)
  |-- Check AI_PROVIDER env
  |-- GROQ_API_KEY present --> call Groq llama-3.3-70b
  |-- response_format: json_object enforced
  |-- temperature: 0.2 (low randomness for consistency)
  |
  v
GROQ RESPONSE
  {
    "problems": [
      {
        "id": "p-bfs-001",
        "title": "Level Order Traversal",
        "description": "Given a binary tree root, return node values level by level...",
        "difficulty": "Medium",
        "category": "Binary Trees - BFS",
        "platform": "LeetCode",
        "url": "https://leetcode.com/problems/binary-tree-level-order-traversal/",
        "codeTemplate": "function levelOrder(root) {\n  // write solution\n}"
      },
      { ... second problem ... }
    ]
  }
  |
  v
DB SAVE
  dsaProgress.dailyProblems.push({ dayNumber: 3, problems: [...] })
  dsaProgress.save()
  |
  v
HTTP RESPONSE to CLIENT
  { success: true, problems: [...], dsaProgress: {...}, dailyStreak: 5 }
  |
  v
UI RENDERS the two problems with code editor + submit button
```
