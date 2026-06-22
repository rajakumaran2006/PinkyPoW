# PinkyPoW Project Structure and Feature Specification

This document provides a clean, detailed breakdown of PinkyPoW's features, architectural components, directory structure, and technical workflow decisions.

---

## 1. Feature Specification

PinkyPoW is a stateful developer onboarding and placement preparation platform. It accelerates readiness through several core modules:

*   **Stateful Diagnostic Calibration**: Evaluates user profiles, connects with coding profiles (LeetCode, CodeChef, HackerRank), and initializes placement readiness metrics.
*   **Targeted DSA Sandbox**: Custom code environment offering topic-focused problem sets scaled by placement score. Intercepts tab keys for proper indenting and grades code using logic validation.
*   **Speech Coaching and Communications Prep**: Captures spoken user responses using browser-based media recording, performs speech-to-text, and analyzes linguistics, filler words, grammar, and vocabulary.
*   **Projects and Resume Engine**: Generates system design questions based on user tech stacks and scores architectural trade-offs.
*   **Placement-Linked Hackathons & Internships Filter**: Dynamically matches candidate scores and skill profiles with active postings.
*   **Automated Certification Roadmap**: Analyzes skill deficits to recommend tailored preparation targets.

---

## 2. Directory Structure

```
PinkyPoW/
├── app/                              # Next.js App Router root
│   ├── (dashboard)/                  # Authenticated layout group
│   │   ├── certifications/           # Certification tracking UI
│   │   ├── communication/            # Audio recording and speech coach UI
│   │   ├── dashboard/                # Main dashboard page
│   │   ├── dsa/                      # Coding playground and logic checker
│   │   ├── hackathons/               # Event listing and application tracker
│   │   ├── internships/              # Job recommendation list
│   │   ├── profile/                  # User settings and developer stats
│   │   ├── projects/                 # Architecture sandbox and review UI
│   │   └── layout.tsx                # Dashboard navigation frame
│   ├── api/                          # Next.js Serverless API endpoints
│   │   ├── ai/                       # AI-based routing routes
│   │   │   ├── certifications/       # Generates credentials paths
│   │   │   ├── dsa/                  # AI-assisted code syntax and logic validator
│   │   │   ├── evaluateSpeech/       # Linguistic analytics and feedback parser
│   │   │   ├── filterCertifications/ # Cert matching filters
│   │   │   ├── filterHackathons/     # Custom event recommendations
│   │   │   ├── filterInternships/    # Opportunities score matcher
│   │   │   ├── generateRoadmap/      # Custom preparation path builder
│   │   │   └── projects/             # Architecture evaluator
│   │   ├── auth/                     # Session handler routes
│   │   ├── dashboard/                # Summary context puller
│   │   ├── hackathons/               # Event fetcher
│   │   ├── internships/              # Job posting database interface
│   │   ├── scrape/                   # LeetCode statistics scraper
│   │   ├── upload/                   # Resume and asset uploader
│   │   └── users/                    # Profile manager
│   ├── globals.css                   # Main styles, theme tokens, and typography
│   ├── layout.tsx                    # Root HTML wrapper
│   └── page.tsx                      # Login and signup wizard
├── components/                       # Shared React UI components
│   └── Sidebar.tsx                   # Desktop and mobile navigation menu
├── docs/                             # Engineering and workflow documentation
│   ├── aiFlow.md                     # Flow chart of the AI processing cycle
│   ├── aiPromptWorkflow.md           # Page-by-page prompt portfolio
│   ├── dsaProblemInstructions.md     # Code instruction specs
│   └── projectStructure.md           # Spec sheet and directory map
├── hooks/                            # Custom React state hooks
├── lib/                              # Shared backend utilities
│   ├── aiService.ts                  # Unified Groq and Gemini API connector
│   ├── db.ts                         # Mongoose caching connection manager
│   └── modelHelper.ts                # General schema utilities
└── models/                           # MongoDB data schemas
    ├── Certification.ts              # Cert details database schema
    ├── Hackathon.ts                  # Hackathon details database schema
    ├── Internship.ts                 # Jobs details database schema
    ├── Problem.ts                    # DSA problems database schema
    └── User.ts                       # Candidate account and stats schema
```

---

## 3. Database Schema Mapping

User state is persisted using MongoDB via Mongoose. The User schema records essential context that is passed to the AI models:

```typescript
const UserSchema = new Schema({
  clerkId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  placementScore: { type: Number, default: 400 },
  track: { type: String, enum: ['SWE', 'Frontend', 'DevOps'] },
  dsaProgress: [{
    problemId: String,
    status: { type: String, enum: ['unstarted', 'attempted', 'solved'] },
    score: Number,
    solvedAt: Date
  }],
  commScore: { type: Number, default: 0 },
  roadmaps: { type: Schema.Types.Mixed, default: {} }
}, { timestamps: true });
```

---

## 4. Technical Workflow Decisions

1.  **Multi-Model Router**: Minimizes service interruption. Groq handles sub-second evaluations, while Gemini acts as a secondary endpoint if limits or keys fail.
2.  **Stateful Prompts**: Every prompt includes context about the user's current progress, avoiding generic answers and ensuring personalized recommendations.
3.  **Enforced JSON Structures**: Avoids regex cleaning code. Schema types are validated immediately after LLM execution.
