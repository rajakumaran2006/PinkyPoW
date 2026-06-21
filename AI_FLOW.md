# 🧠 How PinkyPoW's AI Engine Actually Works (Not a Wrapper!)

Unlike standard "wrappers" that just send user inputs straight to an LLM, PinkyPoW runs a **Stateful, Feedback-Driven AI Loop**. The system remembers your history, scores your progress, and modifies future prompts dynamically based on database state.

---

## ⚡ The AI Workflow Loop

```mermaid
graph TD
    %% User Action
    User([User Solves/Speaks]) -->|Trigger Event| Frontend[Client Frontend]
    
    %% Stateful Context Fetching
    Frontend -->|1. Request API| API[API Routing Layer]
    API -->|2. Pull History & Scores| DB[(MongoDB State Database)]
    
    %% Adaptive Prompt Assembly
    DB -->|3. Feed Historical Context| Orchestrator[AI Orchestrator]
    Note[LLM knows completed tasks + current placement score] -.-> Orchestrator
    
    %% Resilient Multi-LLM Execution
    Orchestrator -->|4. Primary Route| Groq[Groq Llama 3.3]
    Orchestrator -->|5. Fallback Failover| Gemini[Google Gemini 1.5]
    
    %% State Mutation & Closed Feedback Loop
    Groq & Gemini -->|6. Strict Structured JSON| API
    API -->|7. Mutate Streak & Recalculate Placement Score| DB
    API -->|8. Render Adaptive Plan| Frontend
    
    style User fill:#a5f3fc,stroke:#0891b2,stroke-width:2px
    style DB fill:#fed7aa,stroke:#ea580c,stroke-width:2px
    style Orchestrator fill:#fef08a,stroke:#ca8a04,stroke-width:2px
    style Groq fill:#bbf7d0,stroke:#15803d,stroke-width:1px
    style Gemini fill:#bbf7d0,stroke:#15803d,stroke-width:1px
```

---

## 💎 Why This Wins Points with Judges

| Feature | Standard Wrapper | **PinkyPoW Stateful Engine** |
| :--- | :--- | :--- |
| **User Context** | Static prompt (forgotten next turn). | **Stateful Memory**: AI remembers all solved problems, tech stack preferences, and placement history. |
| **Resilience** | Fails if the primary API is down. | **Multi-Model Router**: Groq primary for speed with an automatic failover fallback to Google Gemini. |
| **Adaptation** | Shows the same difficulty to everyone. | **Dynamic Calibration**: The system adjusts problem difficulties (Easy/Medium/Hard) automatically based on the user's live DB score. |
| **Data Format** | Freeform text (unreliable formatting). | **Guaranteed JSON Schema Enforcement**: Strictly parsed schemas mapped directly to database mutations. |
