# 🧠 PinkyPoW: Advanced AI Workflow & Architecture

PinkyPoW is **not an AI wrapper**. It is a stateful, adaptive developer-placement accelerator that merges user history, real-time audio analytics, and a multi-model fallback router into a closed-loop system.

---

## 🗺️ System Architecture & Data Flow

Below is the workflow showing how client interactions, state databases, and the LLM routing orchestrator interact:

```mermaid
graph TD
    %% User Inputs & UI Interaction
    User([Developer / Candidate]) -->|Interacts with Next.js UI| Frontend[React & Tailwind Frontend]
    
    %% API Routing Layer
    Frontend -->|POST /api/ai/projects| ProjectAPI[Project Planner Endpoint]
    Frontend -->|POST /api/ai/dsa| DsaAPI[DSA Coach Endpoint]
    Frontend -->|POST /api/ai/evaluate-speech| SpeechAPI[Speech Analytics Endpoint]
    Frontend -->|POST /api/ai/generate-roadmap| RoadmapAPI[Placement Roadmap Endpoint]

    %% AI Orchestrator / Unified Interface
    ProjectAPI & DsaAPI & SpeechAPI & RoadmapAPI -->|Request JSON Payload| AIService[Unified AI Service / lib/ai-service.ts]

    %% Multi-Model Router & Fallback System
    subgraph Multi-LLM Router & Fallback
        AIService -->|Check Env Config & Provider| Router{Provider Router}
        Router -->|Primary: Groq API Key| GroqModel[Groq: llama-3.3-70b-versatile]
        Router -->|Secondary/Fallback: Gemini Key| GeminiModel[Google Gemini: gemini-1.5-flash]
    end

    %% Database & State Management
    ProjectAPI & DsaAPI -->|Save Progress, Scores & Roadmap State| MongoDB[(MongoDB Database)]

    %% Speech Analytics Pipeline
    SpeechAPI -.->|Computes Fluency Metrics| SpeechModel[Speech Coach Agent]
    
    style User fill:#a5f3fc,stroke:#0891b2,stroke-width:2px
    style Frontend fill:#c084fc,stroke:#7e22ce,stroke-width:2px
    style AIService fill:#fef08a,stroke:#ca8a04,stroke-width:2px
    style Multi-LLM Router & Fallback fill:#bbf7d0,stroke:#15803d,stroke-width:1px
    style MongoDB fill:#fed7aa,stroke:#ea580c,stroke-width:2px
```

---

## ⚡ What Makes This Unique? (Judges' Cheat Sheet)

### 1. Stateful Feedback Loops (Not a Static Wrapper)
* **The Problem with Wrappers**: Most AI apps send a single query to ChatGPT, return text, and immediately forget the user existed.
* **Our Solution**: Every AI prompt is grounded in database state (powered by **MongoDB & Mongoose**). The AI knows the candidate's exact placement score, their track length, and the list of problems they have already completed. It uses this context to dynamically filter, calibrate, and generate challenges.

### 2. Dual-Engine LLM Router with Fallback
* The unified orchestrator (`lib/ai-service.ts`) detects environment configurations dynamically.
* It routes requests to **Groq (`llama-3.3-70b-versatile`)** for ultra-fast, sub-second responses with strict JSON formatting.
* If Groq rates limit or go down, it automatically cascades to **Google Gemini (`gemini-1.5-flash`)**, providing reliable enterprise-grade failover.

### 3. Interactive Multi-Step Prompt Workflows
* Rather than asking a user what project they want and immediately generating a plan, the **AI Project Planner** performs an architectural interview. 
* It takes their initial tech stack preference, creates a tailored follow-up question (e.g., asking about scalability trade-offs like WebSockets vs WebRTC), and only builds the final roadmap once the candidate answers.

### 4. Real-time Speech Analytics
* Leverages client-side browser recording APIs to feed transcription text and audio cadence metrics to an LLM evaluator, scoring fluency, grammar, and vocabulary while providing targeted communications tips.

---

## 🛠️ Stack & Open-Source Tools Used
* **Frontend**: Next.js 15, React, Tailwind CSS
* **Database**: MongoDB (via Mongoose ODM)
* **SDKs**: `@google/generative-ai` & `groq-sdk`
* **Speech Integration**: Native HTML5 Web Audio API
