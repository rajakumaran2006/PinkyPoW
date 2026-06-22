# PinkyPoW Documentation Index

This directory contains the engineering specifications, prompt portfolios, and design documents for the PinkyPoW platform. All files are written in standard markdown format, avoiding extraneous decorative clutter to maintain professional clarity.

---

## Document Index

1.  **[Project Structure and Feature Specification](file:///Users/raja/Desktop/ClientProjects/Hackathons/PinkyPoW/docs/projectStructure.md)**
    *   Detailed listing of application pages, serverless API endpoints, Mongoose schema fields, and helper modules.
    *   Contains the file mapping tree and core feature specifications.
2.  **[AI Workflow Loop Diagram](file:///Users/raja/Desktop/ClientProjects/Hackathons/PinkyPoW/docs/aiFlow.md)**
    *   Stateful routing diagram mapped in Mermaid format.
    *   Detailed comparison between standard API wrappers and PinkyPoW's feedback-driven state orchestrator.
3.  **[Prompt Portfolio and AI Decisions](file:///Users/raja/Desktop/ClientProjects/Hackathons/PinkyPoW/docs/aiPromptWorkflow.md)**
    *   Comprehensive list of 30 prompts categorized by build phases (Scaffolding, System Router, Stateful Routes, Sandboxes, Pipelines).
    *   Explains tools selection, developer decisions, and corrective actions taken during prompt compilation.
4.  **[DSA Problem Generator Instructions](file:///Users/raja/Desktop/ClientProjects/Hackathons/PinkyPoW/docs/dsaProblemInstructions.md)**
    *   Specific instructions and output constraints defined for the DSA agent, detailing topic alignment, skill calibration, and templates.

---

## Architectural Summary

PinkyPoW implements stateful context grounding to generate personalized study plans, interview questions, and speech coaching feedback. By pulling context from MongoDB prior to prompt assembly, the system prevents context loss across sessions. Resilience is achieved by utilizing Groq (Llama 3.3) for rapid processing, with an automated fallback handler that reroutes failed executions to Google Gemini 1.5. Response structures are constrained to application/json format to prevent validation issues.
