# PinkyPoW: AI Workflow, Tool Usage & Prompt Portfolio
**Team Name:** The Deciders  
**Project Link:** [PinkyPoW Repository](https://github.com/rajakumaran2006/PinkyPoW)  
**Demo Video/Screenshot Link:** [PinkyPoW Live App](https://pinkypow.vercel.app)

---

## Summary of AI Workflows & Tool Efficiency
For a high-tier hackathon submission, static prompting is not enough. We utilized a **30-Prompt Pipeline** (divided into 10 Pages/Sections) which transitions from foundational project scaffolding to state-driven AI integration.

### Quick Statistics
* **Total Prompts:** 30 (12 Complex Architecture Prompts + 18 Rapid Development Mini-Prompts)
* **AI Tool Selection:** * **Primary Engine:** Groq API (`llama-3.3-70b-versatile`) - selected for sub-second, highly structured JSON output.
  * **Secondary / Failover Engine:** Google Gemini API (`gemini-1.5-flash`) - selected for high reliability, massive context size, and fallback redundancy.
  * **Development Assistant:** VS Code/Cursor + Next.js Dev Server - selected for instant syntax correction and hot reloading feedback loops.

---

# Page-by-Page Prompt Presentation

---

## Page 1: Welcome, Team Identity & Advanced Prompting Techniques
### The Deciders
* **Project Name:** PinkyPoW
* **Tagline:** A stateful, adaptive developer-placement accelerator combining multi-model AI routing, real-time voice fluency diagnostics, and structured DSA coding roadmaps.
* **Core Philosophy:** Breaking the "AI wrapper" stereotype by grounding all prompts in active database state (MongoDB) to build persistent feedback loops.

### Prompt Engineering Techniques
To maximize LLM reliability, compliance, and velocity, we applied five advanced prompting methodologies:
1. **System Instruction Isolation:** Forcing the LLM to behave strictly as a backend parser by feeding system commands separate from dynamic user prompts.
2. **Chain-of-Thought (CoT) Prompting:** Requiring the model to explain its logical steps *prior* to returning the JSON body, improving response accuracy.
3. **Structured JSON Mode:** Instructing models (Llama/Gemini) to return output matching strict typescript schemas, avoiding string cleaning scripts.
4. **Contextual State Injection:** Injecting the candidate's history (completed tasks, previous scores, track type) into the prompt context to keep AI responses personalized and dynamic.
5. **Few-Shot Prompting:** Demonstrating expected output templates (input -> output mappings) in system prompts to avoid format drift.

---

## Page 2: Project Init & Design Token Setup
### Prompt 1 (Big - Foundations)
> **Role:** Senior Frontend Architect  
> **Context:** Initiating a modern developer onboarding and placement platform named 'PinkyPoW' using Next.js 15, TypeScript, Tailwind CSS, and lucide-react.  
> **Task:** Generate a clean stylesheet for `app/globals.css` and configure the theme variables.  
> **Constraints:** > - Define a custom warm/premium palette: Background `#FFF5F7` (soft warm cream), border `#FCE7F3` (delicate pink), primary dark `#1E1D1A` (rich charcoal).  
> - Implement utility classes for glassmorphic cards: `.warm-card` (border, subtle shadow, light cream background, interactive scale transition on hover) and `.warm-card-dark` (dark charcoal background, white text, clean pink borders).  
> - Ensure all styles are responsive and optimized for Tailwind v4 utility variables.

### Mini-Prompts (Refining)
* **Prompt 2 (Mini):** "Modify the Next.js `app/layout.tsx` to integrate Google Fonts loading for 'Outfit' and 'Inter' dynamically, setting Outfit as the primary heading font and Inter as the body font."
* **Prompt 3 (Mini):** "Extend `tailwind.config` configuration file to include dynamic animations for audio waveform pulses (`pulse-wave`) and custom cubic-bezier transitions for card hovers."

* **Tools Used:** Next.js CLI, VS Code, Tailwind CSS.
* **Why We Used Them:** Next.js provides server-side rendering capability for performance, and Tailwind allows fast, fine-grained UI styling.
* **Mistakes & Improvements:** Standard Tailwind colors looked generic. **Improvement:** Defined a custom warm-palette config inside `globals.css` to build a unique visual identity.

---

## Page 3: Unified Multi-Model Router
### Prompt 4 (Big - AI Orchestration)
> **Role:** Principal Systems Engineer  
> **Context:** Building a bulletproof, high-performance LLM routing orchestration helper in `lib/ai-service.ts` for Next.js.  
> **Task:** Write a TypeScript module exposing `async function generateJSON(systemPrompt: string, userPrompt: string): Promise<any>`.  
> **Execution Logic:** > 1. Read environment variable `AI_PROVIDER`.  
> 2. If `AI_PROVIDER` is 'groq', call the Groq API utilizing model `llama-3.3-70b-versatile`. Configure the request with a low temperature of `0.2` and enforce strict JSON output with `response_format: { type: "json_object" }`.  
> 3. If `AI_PROVIDER` is 'gemini', call the Google Generative AI SDK using model `gemini-1.5-flash`. Configure with `responseMimeType: "application/json"` and set system instructions using the `systemPrompt`.  
> 4. If `AI_PROVIDER` is unspecified, check for key availability (`GROQ_API_KEY` -> fallback to `GEMINI_API_KEY`). Ensure all responses are parsed as native JSON objects. Catch and log errors, providing descriptive debug information.

### Mini-Prompt (Refining)
* **Prompt 5 (Mini):** "Refactor `lib/ai-service.ts` to include runtime API key health validation and export a helper to verify connection status before starting server actions."

* **Tools Used:** Groq SDK, Google Generative AI SDK, TypeScript.
* **Why We Used Them:** Using multiple LLM APIs guarantees 100% uptime for live hackathon pitches, even if one provider goes down.
* **Mistakes & Improvements:** The Gemini API threw parsing errors when the prompt didn't specify JSON format. **Improvement:** Configured `responseMimeType: "application/json"` explicitly in Gemini's generation config.

---

## Page 4: Stateful MongoDB Database Schemas
### Prompt 6 (Big - Database Models)
> **Role:** Database Administrator  
> **Context:** Setting up a stateful user profile system using Mongoose ODM for PinkyPoW.  
> **Task:** Define the User Schema inside `models/User.ts`.  
> **Required Fields & Types:** > - `clerkId`: String, required, unique, indexed  
> - `name`: String, required  
> - `email`: String, required  
> - `placementScore`: Number, default: 400  
> - `track`: String, enum: ['SWE', 'Frontend', 'DevOps']  
> - `dsaProgress`: Array of { `problemId`: String, `status`: String, `score`: Number, `solvedAt`: Date }  
> - `commScore`: Number, default: 0  
> - `roadmaps`: Schema.Types.Mixed, default: {}  
> - `timestamps`: Enabled.  
> Ensure standard connection caching is implemented so the schema connects cleanly without re-declaring in serverless route instances.

### Mini-Prompt (Refining)
* **Prompt 7 (Mini):** "Write a database connection helper in `lib/db.ts` that caches the database connection object to avoid resource leaks during Next.js Hot Module Reloads (HMR)."

* **Tools Used:** MongoDB, Mongoose ODM.
* **Why We Used Them:** Storing state keeps the AI inputs grounded. Mongoose ensures strict typing over MongoDB's loose schema structure.
* **Mistakes & Improvements:** Database connection pool overflow occurred due to rapid client re-rendering. **Improvement:** Implemented a global cached connection model in `lib/db.ts`.

---

## Page 5: Developer Dashboard UI
### Prompt 8 (Big - UI Page)
> **Role:** Senior Frontend Developer  
> **Context:** Building the primary interactive landing dashboard inside `app/(dashboard)/dashboard/page.tsx`.  
> **Task:** Code a high-fidelity React component implementing the layout.  
> **Components to Include:** > - A welcome banner reading "Welcome in, [User Name] " with dynamic progress bar pills representing DSA (60%), Communication Prep (15%), and Internship Applications (15%).  
> - Score displays utilizing clean, rounded dashboard cards with dynamic number animations representing Placement Score, Percentile Rank, and Active Streak.  
> - A 2-column layout: Left column features a responsive Weekly Study Hours bar chart and a speech countdown progress ring (SVG stroke circle). Right column displays verified skill badges, platform sync statuses, and a task checklist with complete toggle interactions.

### Mini-Prompts (Refining)
* **Prompt 9 (Mini):** "Implement a number-incrementing animation using `setInterval` that counts up the Placement Score to its target value on component mount."
* **Prompt 10 (Mini):** "Add an interactive checklist to the dashboard sidebar tasks that dynamically increments the completed task ratio shown at the top."

* **Tools Used:** React, Tailwind CSS, Lucide icons.
* **Why We Used Them:** React hooks allow reactive UI changes (toggling items, animating scores) without full-page reloads.
* **Mistakes & Improvements:** Re-renders reset the countdown speech timer. **Improvement:** Isolated timer side effects inside a dedicated `useEffect` with clean-up functions.

---

## Page 6: Interactive AI Project Planner Engine & API Endpoint
### Prompt 11 (Big - AI System Prompt)
> **System Role:** Expert AI Systems Architect & Interview Examiner  
> **Task:** Evaluate a candidate's preferred tech stack and output an architectural interview question to test their design trade-off capability.  
> **Input Context:** User Preferred Stack: `{techStack}`.  
> **System Guidelines:** > - Formulate exactly ONE challenging question targeting system architecture design decisions (e.g. Scaling WebSockets vs WebRTC, database indexing strategies, serverless concurrency limits).  
> - Output must strictly conform to this JSON schema:  
>   `{ "question": "string", "context": "string", "suggestedTechnologies": ["string"] }`.  
> - Do not write any conversational text, explanations, or code outside the raw JSON object.

### Prompt 14 (Big - Next.js Route Architecture Interview Endpoint)
> **Role:** Backend API Developer  
> **Context:** Constructing the architectural interview API endpoint in `app/api/ai/projects/route.ts`.  
> **Task:** Implement a POST route that manages stateful interview progression.  
> **Route Logic:** > 1. Parse request JSON parameters: `clerkId`, `action` ('initiate' or 'evaluate'), `techStack`, and `userResponse`.  
> 2. If `action` is 'initiate', connect to MongoDB, fetch the user profile, verify credentials, call the unified AI router with the system architect prompt, and return the question.  
> 3. If `action` is 'evaluate', send the candidate's answer to the AI router alongside an evaluation prompt. Enforce output schema: `{ "score": number, "feedback": ["string"] }`.  
> 4. Save the score and feedback directly into the User's MongoDB profile, increment their `placementScore` accordingly, and return the result.

### Mini-Prompts (Refining)
* **Prompt 12 (Mini):** "Inject few-shot examples into the system prompt where input is 'Next.js & PostgreSQL' and the output is a query regarding connection pool limits vs serverless route timeouts in serverless database environments."
* **Prompt 13 (Mini):** "Write user input verification logic to ensure the user does not submit empty fields or malicious scripts before contacting the AI Router."
* **Prompt 15 (Mini):** "Add custom logger statements inside `/app/api/ai/projects/route.ts` that print the execution latency for the AI evaluation process to help optimize sub-second response times."

* **Tools Used:** Groq Playground (Testing), JSON Schema, Next.js Route Handlers, MongoDB.
* **Why We Used Them:** Structured system prompts ensure the AI doesn't output conversational boilerplate, and server-side routes securely sign database requests.
* **Mistakes & Improvements:** The LLM sometimes added markdown triple-backticks around JSON. **Improvement:** Sanitized the response by stripping ````json ... ```` tags before calling `JSON.parse`.

---

## Page 7: Speech Coaching Recording UI & Linguistics Analyst Endpoint
### Prompt 16 (Big - Client Voice)
> **Role:** Frontend Audio Engineer  
> **Context:** Designing the client voice recording interface inside `app/(dashboard)/communication/page.tsx` for real-time speech coaching.  
> **Task:** Implement speech recording utilizing the browser's native HTML5 MediaRecorder API.  
> **Requirements:** > - Provide interactive controls: 'Start Recording' and 'Stop Recording'.  
> - Capture audio chunks in a state array. When recording finishes, compile the chunks into an Audio Blob.  
> - Perform base64 encoding on the audio blob and transmit it via a POST request to `/api/ai/evaluate-speech` as a JSON payload.  
> - Show status loaders: 'Transcribing speech...', 'Analyzing filler words...', and 'Updating Placement Score...'.

### Prompt 18 (Big - Speech AI Processing System Role)
> **System Role:** Elite Speech Coach & Linguistics Analyst  
> **Task:** Analyze an audio transcription and grade the user's verbal delivery.  
> **Input Transcription:** `{transcription}`.  
> **Evaluation Parameters:** > - Grammatical accuracy and sentence complexity.  
> - Cadence and excessive usage of filler words (e.g. 'um', 'like', 'uh', 'so').  
> - Quality and clarity of professional vocabulary.  
> **Enforced Output JSON Format:** > `{ "scores": { "grammar": number, "vocabulary": number, "fluency": number }, "fillerWords": { "word": string, "count": number }[], "feedback": ["string"] }`.  
> - Return ONLY the JSON object. Do not include extra commentary.

### Mini-Prompts (Refining)
* **Prompt 17 (Mini):** "Add a canvas-based dynamic audio visualizer element that reads microphone frequency data from `AudioContext` and draws real-time wave heights during active recordings."
* **Prompt 19 (Mini):** "Refine the system prompt to explicitly define the scoring criteria for grades 1-100 (e.g. 90+ requires advanced technical terminology, zero grammar mistakes, and less than 2 filler words)."
* **Prompt 20 (Mini):** "Add a list of common filler words in the system prompt to guide the AI on what to search for in the transcript text."

* **Tools Used:** HTML5 Web Audio API, MediaRecorder, React State, Groq LLM API.
* **Why We Used Them:** Using native browser APIs avoids installing external audio recording dependencies, and Groq's high processing speed reduces evaluation latency to under a second.
* **Mistakes & Improvements:** The AI graded candidates too leniently. **Improvement:** Injected a grading rubric into the system prompt with strict score ranges for beginner, intermediate, and advanced levels.

---

## Page 8: DSA Code Sandbox UI & Logic Grading API Validator
### Prompt 21 (Big - Code Playground)
> **Role:** Frontend Systems Developer  
> **Context:** Constructing the DSA practice sandbox UI inside `app/(dashboard)/dsa/page.tsx`.  
> **Task:** Design a split-pane layout:  
> - Left panel: Display the dynamic programming problem (Title, Difficulty level, Acceptance rate, detailed description, input/output constraints, example cases).  
> - Right panel: A code editor utilizing a custom styled HTML `<textarea>` supporting tab spaces, line numbering, and a drop-down menu to switch language presets (JavaScript, Python, TypeScript).  
> - Bottom panel: Interactive test console outputs showcasing case results, console logs, and run-times with clean status badges.

### Prompt 23 (Big - Code Grading)
> **Role:** Lead DSA Architect  
> **Context:** Implementing the backend validator route `/api/ai/dsa/route.ts` for candidate code submissions.  
> **Task:** Parse the user's code, language choice, and problem ID.  
> **Route Rules:** > - Retrieve the corresponding test inputs and outputs from MongoDB.  
> - Validate the submitted code structure. For execution safety, utilize the AI router to evaluate logic correctness against constraints by feeding it the code and the target output cases.  
> - Enforce JSON response matching: `{ "compiled": boolean, "passed": boolean, "cases": { "input": string, "expected": string, "received": string, "passed": boolean }[], "timeComplexity": string }`.  
> - Sync the completion status back into the user's database model and update the dashboard score.

### Mini-Prompts (Refining)
* **Prompt 22 (Mini):** "Write the keyboard keydown interceptor code to support standard TAB indentation inside the code editor textarea instead of letting the cursor exit focus."
* **Prompt 24 (Mini):** "Add logic to award dynamic XP points or bonus Placement Score points based on the speed and efficiency of the code submission."

* **Tools Used:** Tailwind Grid, Monaco Editor/Textarea, Next Route Handlers, MongoDB.
* **Why We Used Them:** Split layouts replicate modern, industry-standard interview preparation environments, and Node.js Next handlers secure database operations.
* **Mistakes & Improvements:** Standard textarea didn't support tab indentations. **Improvement:** Intercepted the keydown event to insert spaces when the tab key is pressed.

---

## Page 9: AI Placement Roadmap Generator
### Prompt 25 (Big - Career Generator)
> **System Role:** Career Growth Specialist & Technical Recruiter AI  
> **Task:** Analyze a developer's profile metrics to build a tailored 4-week preparation schedule.  
> **Input Profile State:** User Track: `{track}`, Current DSA Score: `{dsaProgress}`, Speech Grade: `{commScore}`.  
> **Output Constraints:** > - Generate exactly four weeks of sequential study points.  
> - Target the weak areas identified by low database scores.  
> - Force JSON format:  
>   `{ "roadmapId": "string", "weeks": [ { "weekNumber": number, "focusArea": string, "suggestedProblems": ["string"], "speechPracticeTopic": string } ] }`.  
> - Do not include markdown code wrapping blocks, conversational intro, or outro text.

### Mini-Prompt (Refining)
* **Prompt 26 (Mini):** "Ensure the output roadmap does not repeat problems that the user has already marked as successfully solved in MongoDB."

* **Tools Used:** Google Gemini 1.5, JSON Schemas.
* **Why We Used Them:** Gemini's larger context window is ideal for processing the user's entire history and generating dense, multi-week structured text.
* **Mistakes & Improvements:** Roadmaps were too generic and didn't change based on user profile. **Improvement:** Injected the user's targeted career path (e.g. Front-End vs Back-End) directly into the prompting context.

---

## Page 10: Hackathon & Internship Matcher & Production Build Deployment
### Prompt 27 (Big - Scoring Algorithm)
> **Role:** Recruitment Algorithm Engineer  
> **Context:** Constructing the internship and hackathon recommendation endpoints inside `/api/ai/filter-internships` and `/api/ai/filter-hackathons`.  
> **Task:** Match opportunities from the database to candidates.  
> **Algorithm Logic:** > 1. Calculate a fit score (0-100%) by comparing the developer's tech stack matches against required skills.  
> 2. Filter out opportunities whose minimum Placement Score threshold exceeds the candidate's active rating.  
> 3. Send matching profiles to the AI router to generate a one-sentence recommendation string.  
> 4. Sort results descending, placing best fit items first.

### Prompt 29 (Big - Performance & Build)
> **Role:** DevOps & Build Engineer  
> **Context:** Preparing the Next.js application for deployment on Vercel.  
> **Task:** Configure the application files and verify structural soundness.  
> **Execution Steps:** > - Ensure all components using client-side hooks (`useState`, `useEffect`, or audio APIs) are correctly declared with `'use client'`.  
> - Add global React error boundary wrappers around all AI-driven modules.  
> - Run dynamic builds locally to ensure all routes compile without type safety violations or compile-time missing environment key errors.

### Mini-Prompts (Refining)
* **Prompt 28 (Mini):** "Format the recommendation string as a brief call-to-action (e.g., 'Perfect fit! Your DSA rating matches their expectations.')"
* **Prompt 30 (Mini):** "Add custom logger statements inside `/lib/ai-service.ts` that track execution time for each AI prompt to help monitor system latency."

* **Tools Used:** MongoDB Aggregations, Groq, Next.js Build Engine, Vercel, TypeScript.
* **Why We Used Them:** Allows fast filtering/sorting and ensures a flawless deployment pipeline, preventing compile-time crashes.
* **Mistakes & Improvements:** Dynamic API routes crashed during build due to missing environment variables. **Improvement:** Declared fallback checks for API keys to allow the project to build cleanly in CI/CD pipelines.

---

## How AI Helped Us Build This (Judges' Outro)
The PinkyPoW platform was developed in record time because **AI was treated as an active developer-partner rather than a copy-paste utility**:
1. **Accelerated Architecture:** Scaffolding databases, routes, and layout structures took minutes instead of days.
2. **Strict Code Quality:** The AI helped verify TypeScript types, preventing runtime crashes.
3. **Advanced Flow Optimizations:** Real-time routing between Groq (Llama) and Gemini was designed, coded, and debugged through iterative, structured prompt cycles.
