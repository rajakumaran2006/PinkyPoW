"use client";

import React, { useState, useMemo } from "react";
import {
  FolderGit,
  Plus,
  Trash2,
  FileText,
  CheckSquare,
  Square,
  Sparkles,
  Loader2,
  X,
  CheckCircle,
  Download,
  Copy,
  ArrowRight,
  ExternalLink,
  Laptop,
  Briefcase,
  Trophy,
  Award,
  Users
} from "lucide-react";

interface Project {
  id: string;
  title: string;
  skills: string[];
  summary: string;
}

export default function Projects() {
  // --- STATE ---
  
  // Projects State
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "proj-1",
      title: "AI-Powered Recruitment Analytics Dashboard",
      skills: ["React", "Next.js", "Python", "FastAPI", "OpenAI API", "PostgreSQL"],
      summary: "Built a placement evaluation pipeline analyzing speech transcripts & coding velocity with 92% evaluation alignment."
    },
    {
      id: "proj-2",
      title: "Distributed Real-time Messaging Broker",
      skills: ["Go", "WebSockets", "Redis", "Docker", "gRPC"],
      summary: "Architected a zero-loss message distribution bus handling 10k messages/second with end-to-end encryption."
    }
  ]);

  // Form State
  const [newTitle, setNewTitle] = useState("");
  const [newSkills, setNewSkills] = useState("");
  const [newSummary, setNewSummary] = useState("");

  // Resume Compiler Selection State
  const [includeInternships, setIncludeInternships] = useState(true);
  const [includeHackathons, setIncludeHackathons] = useState(true);
  const [includeCerts, setIncludeCerts] = useState(true);
  const [includeProjects, setIncludeProjects] = useState(true);

  // Compile Progress State
  const [isCompiling, setIsCompiling] = useState(false);
  const [compileProgress, setCompileProgress] = useState(0);
  const [compileLogs, setCompileLogs] = useState<string[]>([]);
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  // --- ACTIONS ---

  // Add new project
  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newSummary) return;

    // Split skills by comma and trim whitespace
    const skillsArray = newSkills
      ? newSkills.split(",").map((s) => s.trim()).filter((s) => s.length > 0)
      : ["General"];

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      title: newTitle,
      skills: skillsArray,
      summary: newSummary
    };

    setProjects([...projects, newProject]);
    setNewTitle("");
    setNewSkills("");
    setNewSummary("");
  };

  // Remove project
  const handleRemoveProject = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  // Run Compilation Simulation
  const startResumeCompilation = () => {
    setIsCompiling(true);
    setCompileProgress(0);
    setCompileLogs([]);

    const steps = [
      { text: "Extracting verified Git project repositories...", delay: 300 },
      { text: "Fetching internship Kanban experience matrices...", delay: 800 },
      { text: "Aggregating validated cloud and system certifications...", delay: 1400 },
      { text: "Structuring resume layout and keywords for ATS parsers...", delay: 2000 },
      { text: "Optimizing text metrics against 2026 tech-recruitment criteria...", delay: 2600 },
      { text: "Rendering final compiled ATS-compliant PDF document...", delay: 3200 },
      { text: "Compilation successful! Ready for download.", delay: 3800 }
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setCompileLogs((prev) => [...prev, step.text]);
        setCompileProgress(Math.min(Math.round(((idx + 1) / steps.length) * 100), 100));

        if (idx === steps.length - 1) {
          setTimeout(() => {
            setIsCompiling(false);
            setShowDownloadModal(true);
          }, 600);
        }
      }, step.delay);
    });
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500 max-w-6xl mx-auto">
      
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-white/5 pb-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/25 text-pink-400 text-xs font-semibold">
            <FolderGit className="w-3.5 h-3.5" /> Resume Compiler
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
            The Portfolio Engine
          </h1>
          <p className="text-zinc-400 text-sm max-w-xl">
            Compile your hackathons, projects, and internships into a top-tier resume.
          </p>
        </div>

        {/* Quick Stats banner */}
        <div className="flex items-center gap-6 p-4 rounded-3xl bg-white/5 border border-white/5 glass-panel">
          <div className="text-center px-4 border-r border-white/10">
            <span className="block text-[10px] text-zinc-500 font-bold uppercase tracking-wider font-sans">Lab Projects</span>
            <span className="text-2xl font-black text-white">{projects.length}</span>
          </div>
          <div className="text-center px-4 border-r border-white/10">
            <span className="block text-[10px] text-zinc-500 font-bold uppercase tracking-wider font-sans">ATS Match</span>
            <span className="text-2xl font-black text-pink-500">98%</span>
          </div>
          <div className="text-center px-4">
            <span className="block text-[10px] text-zinc-500 font-bold uppercase tracking-wider font-sans">Status</span>
            <span className="text-xs font-black text-emerald-400 border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 rounded-md uppercase">Synced</span>
          </div>
        </div>
      </div>

      {/* Two-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Project Lab (lg:col-span-6) */}
        <div className="lg:col-span-6 space-y-8">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              Project Lab
            </h2>
            <p className="text-xs text-zinc-500 mt-1">Manage and sync technical implementation architectures</p>
          </div>

          {/* Add Project Form Card */}
          <div className="glass-panel rounded-2xl p-6 border border-white/5 bg-white/[0.01]">
            <h3 className="text-xs text-zinc-400 font-bold uppercase tracking-wider flex items-center gap-1.5 mb-4 border-b border-white/5 pb-2">
              <Plus className="w-3.5 h-3.5 text-pink-500" /> Register New Project
            </h3>
            
            <form onSubmit={handleAddProject} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
                  Project Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Ledger Sync Broker"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/5 focus:outline-none focus:border-pink-500/50 text-xs text-white placeholder-zinc-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
                  Technologies (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. React, Go, WebSockets, Docker"
                  value={newSkills}
                  onChange={(e) => setNewSkills(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/5 focus:outline-none focus:border-pink-500/50 text-xs text-white placeholder-zinc-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
                  Architectural Summary & Key Results
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Developed a serverless video encoder processing raw files using multi-thread AWS Lambda functions, achieving 60% faster rendering times."
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/5 focus:outline-none focus:border-pink-500/50 text-xs text-white placeholder-zinc-500 transition-colors resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-bold transition-all cursor-pointer"
                >
                  Add to Lab
                </button>
              </div>
            </form>
          </div>

          {/* Project List */}
          <div className="space-y-4">
            <span className="block text-[10px] text-zinc-500 font-bold uppercase tracking-wider px-1">
              Active Lab Projects ({projects.length})
            </span>
            
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="glass-panel rounded-2xl p-5 border border-white/5 hover:border-pink-500/25 transition-all duration-300 flex justify-between gap-4 group"
                >
                  <div className="space-y-3 flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-white truncate leading-snug group-hover:text-pink-400 transition-colors">
                      {proj.title}
                    </h4>

                    {/* Tech stack pills */}
                    <div className="flex flex-wrap gap-1">
                      {proj.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="text-[9px] font-medium px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-zinc-400"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed font-sans mt-1">
                      {proj.summary}
                    </p>
                  </div>

                  <button
                    onClick={() => handleRemoveProject(proj.id)}
                    className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors self-start shrink-0 hover:bg-white/5 rounded-lg"
                    title="Remove Project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Resume Compiler & Preview (lg:col-span-6) */}
        <div className="lg:col-span-6 space-y-8">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              The Resume Compiler
            </h2>
            <p className="text-xs text-zinc-500 mt-1">Select verified datasources and compile your ATS template</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* Compiler Control Box */}
            <div className="glass-panel rounded-2xl p-6 border border-white/5 bg-white/[0.01] flex flex-col justify-between space-y-6">
              
              {/* Checkboxes Checklist */}
              <div className="space-y-4">
                <span className="block text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Include Datasources</span>
                
                <div className="space-y-3.5">
                  {/* Internship checkbox */}
                  <div
                    onClick={() => setIncludeInternships(!includeInternships)}
                    className="flex items-center gap-3 cursor-pointer text-xs select-none group"
                  >
                    {includeInternships ? (
                      <CheckSquare className="w-5 h-5 text-pink-500 shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-zinc-600 group-hover:text-zinc-400 shrink-0" />
                    )}
                    <div>
                      <span className="block font-bold text-white">Internships Tracker Data</span>
                      <span className="block text-[10px] text-zinc-500">1 active placement, 2 prior</span>
                    </div>
                  </div>

                  {/* Hackathons checkbox */}
                  <div
                    onClick={() => setIncludeHackathons(!includeHackathons)}
                    className="flex items-center gap-3 cursor-pointer text-xs select-none group"
                  >
                    {includeHackathons ? (
                      <CheckSquare className="w-5 h-5 text-pink-500 shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-zinc-600 group-hover:text-zinc-400 shrink-0" />
                    )}
                    <div>
                      <span className="block font-bold text-white">Completed Hackathons</span>
                      <span className="block text-[10px] text-zinc-500">3 verified victories</span>
                    </div>
                  </div>

                  {/* Certs checkbox */}
                  <div
                    onClick={() => setIncludeCerts(!includeCerts)}
                    className="flex items-center gap-3 cursor-pointer text-xs select-none group"
                  >
                    {includeCerts ? (
                      <CheckSquare className="w-5 h-5 text-pink-500 shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-zinc-600 group-hover:text-zinc-400 shrink-0" />
                    )}
                    <div>
                      <span className="block font-bold text-white">Validated Certs</span>
                      <span className="block text-[10px] text-zinc-500">3 AI validated credentials</span>
                    </div>
                  </div>

                  {/* Projects checkbox */}
                  <div
                    onClick={() => setIncludeProjects(!includeProjects)}
                    className="flex items-center gap-3 cursor-pointer text-xs select-none group"
                  >
                    {includeProjects ? (
                      <CheckSquare className="w-5 h-5 text-pink-500 shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-zinc-600 group-hover:text-zinc-400 shrink-0" />
                    )}
                    <div>
                      <span className="block font-bold text-white">Projects Lab</span>
                      <span className="block text-[10px] text-zinc-500">{projects.length} sandbox projects</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button & Loader */}
              <div className="space-y-4">
                <button
                  onClick={startResumeCompilation}
                  disabled={isCompiling}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-pink-500/10 hover:shadow-pink-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isCompiling ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Compiling...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-purple-200" />
                      <span>Generate ATS-Friendly Resume</span>
                    </>
                  )}
                </button>

                {isCompiling && (
                  <div className="space-y-2 bg-black/45 rounded-xl p-3 border border-white/5 font-mono text-[9px] text-zinc-400 max-h-[85px] overflow-y-auto scrollbar-none">
                    <div className="flex justify-between items-center pb-1.5 border-b border-white/5 mb-1.5">
                      <span className="text-[8px] text-zinc-500 uppercase font-bold">Build Stream</span>
                      <span className="text-pink-500 font-bold">{compileProgress}%</span>
                    </div>
                    {compileLogs.map((log, index) => (
                      <div key={index} className="flex gap-1.5 items-start">
                        <span className="text-pink-500/60 shrink-0">&gt;</span>
                        <span className="leading-snug text-zinc-300">{log}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* A4 Minimalist Resume Preview Pane */}
            <div className="glass-panel rounded-2xl p-4 border border-white/5 flex flex-col items-center">
              <span className="block text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-3">A4 Preview Pane</span>
              
              {/* Zoomed out A4 div */}
              <div className="w-full aspect-[1/1.414] bg-white text-zinc-900 shadow-xl rounded-sm p-4 font-sans flex flex-col justify-between overflow-hidden relative border border-zinc-200 select-none">
                {/* Subtle blurred overlay just to simulate zoomed out PDF paper */}
                <div className="space-y-3">
                  {/* Resume Header */}
                  <div className="text-center pb-2 border-b border-zinc-300">
                    <span className="block text-[9px] font-black tracking-tight text-black">RAJA KUMARAN</span>
                    <span className="block text-[5px] text-zinc-500 mt-0.5 font-medium tracking-wide">
                      raja@pinkypow.dev  •  github.com/rajakumaran2006  •  placement-score: 820
                    </span>
                  </div>

                  {/* Education */}
                  <div className="space-y-1">
                    <span className="block text-[6px] font-black uppercase text-zinc-800 tracking-wide border-b border-zinc-200 pb-0.5">Education</span>
                    <div className="flex justify-between items-start text-[5px] leading-tight">
                      <div>
                        <span className="font-bold text-black block">B.Tech in Computer Science and Engineering</span>
                        <span className="text-zinc-500">CGPA: 9.2  •  Placement Calibration Tier 1</span>
                      </div>
                      <span className="text-zinc-500 font-semibold shrink-0">Class of 2027</span>
                    </div>
                  </div>

                  {/* Experience (Internships) Section */}
                  {includeInternships && (
                    <div className="space-y-1 animate-in fade-in zoom-in-95 duration-200">
                      <span className="block text-[6px] font-black uppercase text-zinc-800 tracking-wide border-b border-zinc-200 pb-0.5">Experience</span>
                      <div className="space-y-1.5">
                        <div className="text-[5px] leading-tight">
                          <div className="flex justify-between items-start">
                            <span className="font-bold text-black">Frontend Engineering Intern  •  Vercel Inc.</span>
                            <span className="text-zinc-500 font-semibold">Jan 2026 - Present</span>
                          </div>
                          <p className="text-zinc-600 mt-0.5 font-sans leading-normal scale-y-95 origin-top">
                            • Optimizing server-side rendering routes with Next.js App Router for 32% performance improvements.
                          </p>
                        </div>
                        <div className="text-[5px] leading-tight">
                          <div className="flex justify-between items-start">
                            <span className="font-bold text-black">Full Stack Developer Intern  •  Postman</span>
                            <span className="text-zinc-500 font-semibold">Sept 2025 - Dec 2025</span>
                          </div>
                          <p className="text-zinc-600 mt-0.5 font-sans leading-normal scale-y-95 origin-top">
                            • Supported gRPC endpoint integrations in dashboard, reducing sandbox load time by 150ms.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Projects Section */}
                  {includeProjects && (
                    <div className="space-y-1 animate-in fade-in zoom-in-95 duration-200">
                      <span className="block text-[6px] font-black uppercase text-zinc-800 tracking-wide border-b border-zinc-200 pb-0.5">Projects</span>
                      <div className="space-y-1.5">
                        {projects.slice(0, 3).map((proj, idx) => (
                          <div key={idx} className="text-[5px] leading-tight">
                            <div className="flex justify-between items-start">
                              <span className="font-bold text-black">{proj.title}</span>
                              <span className="text-zinc-500 font-medium">{proj.skills.slice(0, 3).join(", ")}</span>
                            </div>
                            <p className="text-zinc-600 mt-0.5 font-sans leading-normal scale-y-95 origin-top">
                              • {proj.summary}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Hackathons Section */}
                  {includeHackathons && (
                    <div className="space-y-1 animate-in fade-in zoom-in-95 duration-200">
                      <span className="block text-[6px] font-black uppercase text-zinc-800 tracking-wide border-b border-zinc-200 pb-0.5">Hackathons</span>
                      <div className="text-[5px] leading-tight">
                        <div className="flex justify-between items-start font-bold text-black">
                          <span>CalHacks 13.0 Winner  •  Generative AI Track</span>
                          <span className="text-zinc-500 font-medium">June 2026</span>
                        </div>
                        <p className="text-zinc-600 mt-0.5 leading-normal">
                          • Built an automated multi-agent code refactoring hub in 36 hours. Evaluated best in cohort.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Certifications Section */}
                  {includeCerts && (
                    <div className="space-y-1 animate-in fade-in zoom-in-95 duration-200">
                      <span className="block text-[6px] font-black uppercase text-zinc-800 tracking-wide border-b border-zinc-200 pb-0.5">Certifications</span>
                      <p className="text-zinc-600 text-[5px] leading-normal font-sans">
                        • AWS Certified Solutions Architect (Dec 2025)  •  Responsive Web Design Certification (Jan 2026)  •  Stanford Online: ML (May 2026)
                      </p>
                    </div>
                  )}
                </div>

                {/* Tiny Footer */}
                <div className="text-center pt-1 border-t border-zinc-200 text-[4px] text-zinc-400 font-semibold">
                  Compiled dynamically by PinkyPow ATS Optimization Engine
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* --- MOCK RESUME DOWNLOAD MODAL --- */}
      {showDownloadModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div
            className="w-full max-w-md glass-panel rounded-3xl p-6 space-y-6 border border-white/10 bg-[#09090b]/90 shadow-2xl relative animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setShowDownloadModal(false)}
              className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-white/5 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Resume Compiled Successfully!
              </h3>
              <p className="text-xs text-zinc-500">
                Your portfolio datasources have been compiled into an ATS-friendly template.
              </p>
            </div>

            {/* Resume Quality report */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3 text-xs">
              <div className="flex justify-between items-center text-zinc-400 font-semibold border-b border-white/5 pb-2">
                <span>Optimization Grade</span>
                <span className="text-pink-500 font-black">A+ / Tier 1</span>
              </div>
              <div className="space-y-1 text-zinc-500 text-[11px] leading-relaxed">
                <p>• Chronological order satisfies ATS parsing guidelines.</p>
                <p>• Keywords aligned with full-stack and cloud engineering vacancies.</p>
                <p>• Typographical margins standardized to LaTeX compiler ratios.</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 grid grid-cols-2 gap-3 text-xs font-bold">
              <button
                onClick={() => {
                  alert("LaTeX Source copied to clipboard!");
                }}
                className="py-3 px-4 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/5 text-white flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-4 h-4 text-zinc-400" />
                <span>Copy LaTeX</span>
              </button>
              
              <button
                onClick={() => {
                  alert("Downloading ATS_Resume_Raja_Kumaran.pdf...");
                  setShowDownloadModal(false);
                }}
                className="py-3 px-4 rounded-xl bg-white text-black hover:bg-zinc-200 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
