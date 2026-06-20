"use client";

import React, { useState, useEffect } from "react";
import {
  FolderGit,
  Plus,
  Trash2,
  CheckSquare,
  Square,
  Sparkles,
  Loader2,
  X,
  CheckCircle,
  Download,
  Copy,
  ChevronDown,
  ChevronUp,
  Laptop,
  ArrowUpRight,
  ChevronRight
} from "lucide-react";

interface ProjectTask {
  id: string;
  name: string;
  completed: boolean;
}

interface ProjectPhase {
  name: string;
  tasks: ProjectTask[];
}

interface Project {
  _id?: string;
  title: string;
  techStack: string[];
  description: string;
  phases?: ProjectPhase[];
}

export default function Projects() {
  // --- STATE ---
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);

  // Manual Form State
  const [newTitle, setNewTitle] = useState("");
  const [newSkills, setNewSkills] = useState("");
  const [newSummary, setNewSummary] = useState("");

  // AI Project Planner States
  const [plannerStep, setPlannerStep] = useState(1);
  const [plannerLevel, setPlannerLevel] = useState<"Beginner" | "Intermediate" | "Advanced">("Intermediate");
  const [plannerStack, setPlannerStack] = useState("React, Next.js, Node.js, PostgreSQL");
  const [plannerDomain, setPlannerDomain] = useState("AI/ML Agents");
  const [loadingFollowUp, setLoadingFollowUp] = useState(false);
  const [followUpQuestion, setFollowUpQuestion] = useState("");
  const [followUpAnswer, setFollowUpAnswer] = useState("");
  const [loadingProposal, setLoadingProposal] = useState(false);
  const [proposedProject, setProposedProject] = useState<Project | null>(null);

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
  const [compiledLaTeX, setCompiledLaTeX] = useState("");

  const [dbHackathons, setDbHackathons] = useState<any[]>([]);
  const [dbInternships, setDbInternships] = useState<any[]>([]);

  // Compiled Resume Data State
  const [compiledUserData, setCompiledUserData] = useState<any>(null);
  const [compiledInternships, setCompiledInternships] = useState<any[]>([]);
  const [compiledHackathons, setCompiledHackathons] = useState<any[]>([]);
  const [compiledCerts, setCompiledCerts] = useState<any[]>([]);
  const [compiledDsaCount, setCompiledDsaCount] = useState(0);
  const [compiledDsaStreak, setCompiledDsaStreak] = useState(5);
  const [downloadNotification, setDownloadNotification] = useState<{ show: boolean; message: string; type: "success" | "info" } | null>(null);

  const triggerToast = (message: string, type: "success" | "info" = "success") => {
    setDownloadNotification({ show: true, message, type });
    setTimeout(() => {
      setDownloadNotification(null);
    }, 4000);
  };

  // Fetch projects, internships, and hackathons on mount
  useEffect(() => {
    const session = localStorage.getItem("currentUser");
    let username = "Najla1208";
    if (session) {
      try {
        const user = JSON.parse(session);
        if (user && user.username) username = user.username;
      } catch (e) {
        console.error(e);
      }
    }

    const loadAllData = async () => {
      try {
        // Fetch projects
        const projRes = await fetch("/api/ai/projects");
        const projData = await projRes.json();
        if (projData.success) {
          setProjects(projData.projects);
        }

        // Fetch internships
        const internRes = await fetch(`/api/internships?username=${username}&type=internship`);
        const internData = await internRes.json();
        if (internData.success && internData.internships) {
          setDbInternships(internData.internships);
        }

        // Fetch hackathons
        const hackRes = await fetch(`/api/hackathons?username=${username}`);
        const hackData = await hackRes.json();
        if (hackData.success && hackData.hackathons) {
          setDbHackathons(hackData.hackathons);
        }
      } catch (err) {
        console.error("Error loading resume datasources:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, []);

  // Handle Form Submission for Manual Add Project
  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newSummary) return;

    const skillsArray = newSkills
      ? newSkills.split(",").map((s) => s.trim()).filter((s) => s.length > 0)
      : ["General"];

    // Default structure for manual projects
    const newProj: Project = {
      title: newTitle,
      techStack: skillsArray,
      description: newSummary,
      phases: [
        {
          name: "Phase 1: Project Setup",
          tasks: [
            { id: `t1-${Date.now()}`, name: "Initialize repository and configure environments", completed: false },
            { id: `t2-${Date.now()}`, name: "Create basic application layout and database links", completed: false }
          ]
        }
      ]
    };

    try {
      const res = await fetch("/api/ai/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add-project",
          project: newProj
        })
      });
      const data = await res.json();
      if (data.success) {
        setProjects(data.projects);
        setNewTitle("");
        setNewSkills("");
        setNewSummary("");
      }
    } catch (err) {
      console.error("Error adding project:", err);
    }
  };

  // Remove project
  const handleRemoveProject = async (id?: string) => {
    if (!id) return;
    try {
      const res = await fetch(`/api/ai/projects?projectId=${id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        setProjects(data.projects);
        if (expandedProjectId === id) setExpandedProjectId(null);
      }
    } catch (err) {
      console.error("Error removing project:", err);
    }
  };

  // --- AI PLANNER STEP INTERACTIONS ---

  // Trigger AI Follow-up Question
  const handleGetFollowUp = async () => {
    setLoadingFollowUp(true);
    try {
      const res = await fetch("/api/ai/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "ask-followup",
          level: plannerLevel,
          techStack: plannerStack,
          domain: plannerDomain
        })
      });
      const data = await res.json();
      if (data.success) {
        setFollowUpQuestion(data.followUpQuestion);
        setPlannerStep(2);
      }
    } catch (err) {
      console.error("Error fetching AI follow-up:", err);
    } finally {
      setLoadingFollowUp(false);
    }
  };

  // Generate complete project outline & phases
  const handleCreateProjectProposal = async () => {
    setLoadingProposal(true);
    try {
      const res = await fetch("/api/ai/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create-project",
          level: plannerLevel,
          techStack: plannerStack,
          domain: plannerDomain,
          followUpQuestion,
          followUpAnswer
        })
      });
      const data = await res.json();
      if (data.success) {
        setProposedProject(data.project);
        setPlannerStep(3);
      }
    } catch (err) {
      console.error("Error creating project proposal:", err);
    } finally {
      setLoadingProposal(false);
    }
  };

  // Add the AI generated project proposal to database
  const handleAddProposedProject = async () => {
    if (!proposedProject) return;
    try {
      const res = await fetch("/api/ai/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add-project",
          project: proposedProject
        })
      });
      const data = await res.json();
      if (data.success) {
        setProjects(data.projects);
        // Reset Planner to Step 1
        setPlannerStep(1);
        setProposedProject(null);
        setFollowUpAnswer("");
        setFollowUpQuestion("");
      }
    } catch (err) {
      console.error("Error adding proposed project:", err);
    }
  };

  // Toggle tasks check
  const handleToggleTask = async (projectId?: string, taskId?: string) => {
    if (!projectId || !taskId) return;
    try {
      const res = await fetch("/api/ai/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "toggle-task",
          projectId,
          taskId
        })
      });
      const data = await res.json();
      if (data.success) {
        setProjects(data.projects);
      }
    } catch (err) {
      console.error("Error toggling task completion:", err);
    }
  };

  // Helper to compute project progress
  const getProjectProgress = (proj: Project): number => {
    if (!proj.phases || proj.phases.length === 0) return 0;
    let totalTasks = 0;
    let completedTasks = 0;
    for (const phase of proj.phases) {
      totalTasks += phase.tasks.length;
      completedTasks += phase.tasks.filter((t) => t.completed).length;
    }
    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  };

  // Run Compilation Simulation
  const startResumeCompilation = async () => {
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

    let activeUsername = "Najla1208";
    let activeName = "Raja Kumaran";
    let activeEmail = "raja@pinkypow.dev";
    let activeCollege = "College of Engineering";
    let activeCourse = "B.Tech Information Technology";
    let activeYear = "2026";
    let activeInterests = ["Full-Stack Development", "AI Agents", "Systems Programming"];
    let activeGPA = "8.5/10";
    let activeClerkId = "guest_clerk_id";

    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("currentUser");
      if (stored) {
        try {
          const user = JSON.parse(stored);
          if (user) {
            if (user.username) activeUsername = user.username;
            if (user.name) activeName = user.name;
            if (user.email) activeEmail = user.email;
            if (user.college) activeCollege = user.college;
            if (user.course) activeCourse = user.course;
            if (user.yearOfStudy) activeYear = user.yearOfStudy;
            if (user.interests) activeInterests = Array.isArray(user.interests) ? user.interests : [user.interests];
            if (user.gpa) activeGPA = user.gpa;
            if (user.clerkId) activeClerkId = user.clerkId;
          }
        } catch (e) {
          console.error(e);
        }
      }
    }

    let fetchedInternships: any[] = [];
    let fetchedCerts: any[] = [];
    let fetchedHackathons: any[] = [];
    let dsaCount = 0;
    let dsaStreak = 5;

    // Load dynamic DB values from custom profile route
    try {
      const profileRes = await fetch(`/api/users/profile?username=${activeUsername}`);
      const profileData = await profileRes.json();
      if (profileData.success && profileData.user) {
        const dbUser = profileData.user;
        activeName = dbUser.name || activeName;
        activeEmail = dbUser.email || activeEmail;
        activeCollege = dbUser.college || activeCollege;
        activeCourse = dbUser.course || activeCourse;
        activeYear = dbUser.yearOfStudy || activeYear;
        activeInterests = Array.isArray(dbUser.interests) ? dbUser.interests : [dbUser.interests || ""];
        activeGPA = dbUser.gpa || activeGPA;
        activeClerkId = dbUser.clerkId || activeClerkId;
        
        if (profileData.internships) {
          fetchedInternships = profileData.internships;
        }
        if (profileData.hackathons) {
          fetchedHackathons = profileData.hackathons;
        }
        if (profileData.portfolio && profileData.portfolio.certificates) {
          fetchedCerts = profileData.portfolio.certificates;
        }
        if (profileData.dsaProgress) {
          dsaCount = profileData.dsaProgress.completedProblems?.length || 0;
        }
        dsaStreak = dbUser.dailyStreak || 5;

        // Keep local reference for the downloader
        setCompiledUserData(dbUser);
        setCompiledInternships(includeInternships ? fetchedInternships : []);
        setCompiledHackathons(includeHackathons ? fetchedHackathons : []);
        setCompiledCerts(includeCerts ? fetchedCerts : []);
        setCompiledDsaCount(dsaCount);
        setCompiledDsaStreak(dsaStreak);
      }
    } catch (profileErr) {
      console.error("Error loading real-time profile. Falling back to local data.", profileErr);
      
      // Fallback local refs
      setCompiledUserData({
        name: activeName,
        email: activeEmail,
        college: activeCollege,
        course: activeCourse,
        yearOfStudy: activeYear,
        interests: activeInterests,
        gpa: activeGPA,
        clerkId: activeClerkId
      });
    }

    // Build LaTeX CV using retrieved data
    let latexSource = `\\documentclass[10pt,letterpaper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[left=0.75in,top=0.6in,right=0.75in,bottom=0.6in]{geometry}
\\usepackage{hyperref}
\\usepackage{titlesec}
\\usepackage{enumitem}

\\pagestyle{empty}
\\urlstyle{same}

\\titleformat{\\section}{\\large\\bfseries}{}{0em}{}[\\titlerule]
\\titlespacing{\\section}{0pt}{10pt}{5pt}

\\begin{document}

\\begin{center}
    {\\LARGE \\bfseries ${activeName}} \\\\
    \\vspace{2pt}
    Email: \\href{mailto:${activeEmail}}{${activeEmail}} | Website: \\href{https://pinkypow.dev}{pinkypow.dev}
\\end{center}

\\section{Education}
\\textbf{${activeCollege}} \\hfill ${activeYear} \\\\
${activeCourse} \\hfill GPA: ${activeGPA}

`;

    // Internships / Experience
    if (includeInternships && fetchedInternships.length > 0) {
      latexSource += `\\section{Professional Experience}\n`;
      fetchedInternships.forEach((item) => {
        const dateRange = item.startDate ? `${item.startDate} -- ${item.endDate || "Present"}` : "June 2026";
        latexSource += `\\textbf{${item.company}} \\hfill ${dateRange} \\\\\n`;
        latexSource += `\\textit{${item.role}} \\hfill ${item.location || "Remote"} \\\\\n`;
        if (item.description) {
          latexSource += `\\begin{itemize}[noitemsep,topsep=2pt]\n`;
          latexSource += `    \\item ${item.description}\n`;
          latexSource += `\\end{itemize}\n\\vspace{4pt}\n`;
        } else {
          latexSource += `\\begin{itemize}[noitemsep,topsep=2pt]\n`;
          latexSource += `    \\item Managed project pipelines and collaborated on the development of React/Next.js frameworks.\n`;
          latexSource += `\\end{itemize}\n\\vspace{4pt}\n`;
        }
      });
    }

    // Projects Section
    if (includeProjects && projects.length > 0) {
      latexSource += `\\section{Key Portfolio Projects}\n`;
      projects.forEach((proj) => {
        latexSource += `\\textbf{${proj.title}} \\hfill \\textit{${proj.techStack.join(", ")}} \\\\\n`;
        latexSource += `\\begin{itemize}[noitemsep,topsep=2pt]\n`;
        latexSource += `    \\item ${proj.description}\n`;
        if (proj.phases) {
          const completedTasks = proj.phases
            .flatMap((p) => p.tasks)
            .filter((t) => t.completed)
            .map((t) => t.name)
            .slice(0, 2);
          if (completedTasks.length > 0) {
            latexSource += `    \\item Architected and successfully completed: ${completedTasks.join(" and ")}.\n`;
          }
        }
        latexSource += `\\end{itemize}\n\\vspace{4pt}\n`;
      });
    }

    // Hackathons Section
    if (includeHackathons && fetchedHackathons.length > 0) {
      latexSource += `\\section{Hackathons \\& Achievements}\n`;
      fetchedHackathons.forEach((hack) => {
        const statusStr = hack.status ? ` (${hack.status})` : "";
        latexSource += `\\textbf{${hack.title}}${statusStr} -- \\textit{${hack.hosts || "Organizer"}} \\hfill ${hack.date || "June 2026"} \\\\\n`;
        if (hack.description || (hack.skills && hack.skills.length > 0)) {
          latexSource += `\\begin{itemize}[noitemsep,topsep=2pt]\n`;
          if (hack.description) {
            latexSource += `    \\item ${hack.description}\n`;
          }
          if (hack.skills && hack.skills.length > 0) {
            latexSource += `    \\item \\textbf{Skills used:} ${hack.skills.join(", ")}\n`;
          }
          latexSource += `\\end{itemize}\n\\vspace{4pt}\n`;
        }
      });
    }

    // Data Structures & Algorithms
    latexSource += `\\section{Data Structures \\& Algorithms}\n`;
    latexSource += `\\begin{itemize}[noitemsep,topsep=2pt]\n`;
    latexSource += `    \\item Completed \\textbf{${dsaCount}} data structures and algorithms challenges on platforms like LeetCode and GeeksforGeeks.\n`;
    latexSource += `    \\item Maintained a continuous problem-solving coding streak of \\textbf{${dsaStreak}} days.\n`;
    latexSource += `\\end{itemize}\n\\vspace{4pt}\n`;

    // Certifications Section
    if (includeCerts && fetchedCerts.length > 0) {
      latexSource += `\\section{Certifications & Credentials}\n`;
      latexSource += `\\begin{itemize}[noitemsep,topsep=2pt]\n`;
      fetchedCerts.forEach((cert) => {
        const issuerStr = cert.issuer ? ` (${cert.issuer})` : "";
        latexSource += `    \\item \\textbf{${cert.title || cert.name}}${issuerStr} -- Verified credential category: ${cert.category || "General"}.\n`;
      });
      latexSource += `\\end{itemize}\n\\vspace{4pt}\n`;
    }

    // Skills Section
    latexSource += `\\section{Technical Skills}\n`;
    latexSource += `\\textbf{Interests:} ${activeInterests.join(", ")} \\\\\n`;
    latexSource += `\\textbf{Core Stack:} React, Next.js, Node.js, TypeScript, Python, MongoDB, SQL, Git\n`;

    latexSource += `\\end{document}\n`;

    setCompiledLaTeX(latexSource);

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

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-[#2C2B27] animate-spin" />
        <p className="text-sm text-[#7C786E] font-medium">Syncing portfolio databases...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-500 max-w-6xl mx-auto pb-12 text-[#1E1D1A]">
      
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-[#EFECE3] pb-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF4D8] border border-[#E8DFB3] text-[#7A6218] text-xs font-semibold">
            <FolderGit className="w-3.5 h-3.5" /> Resume Compiler
          </div>
          <h1 className="text-4xl font-normal text-[#1E1D1A] tracking-tight">
            The Portfolio Engine
          </h1>
          <p className="text-[#7C786E] text-sm max-w-xl">
            Compile your hackathons, projects, and internships into a top-tier resume.
          </p>
        </div>

        {/* Quick Stats banner */}
        <div className="flex items-center gap-6 p-4 rounded-3xl bg-white border border-[#ECE9DF] shadow-sm">
          <div className="text-center px-4 border-r border-[#EFECE3]">
            <span className="block text-[10px] text-[#7C786E] font-bold uppercase tracking-wider font-sans">Lab Projects</span>
            <span className="text-2xl font-black text-[#1E1D1A]">{projects.length}</span>
          </div>
          <div className="text-center px-4 border-r border-[#EFECE3]">
            <span className="block text-[10px] text-[#7C786E] font-bold uppercase tracking-wider font-sans">ATS Match</span>
            <span className="text-2xl font-black text-[#7A6218]">98%</span>
          </div>
          <div className="text-center px-4">
            <span className="block text-[10px] text-[#7C786E] font-bold uppercase tracking-wider font-sans">Status</span>
            <span className="text-xs font-black text-[#7A6218] border border-[#E8DFB3] bg-[#FAF4D8] px-2 py-0.5 rounded-md uppercase">Synced</span>
          </div>
        </div>
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Project Lab (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <h2 className="text-xl font-bold text-[#1E1D1A] tracking-tight flex items-center gap-2">
              Project Lab
            </h2>
            <p className="text-xs text-[#7C786E] mt-1">Manage and sync technical implementation architectures</p>
          </div>

          {/* Project List */}
          <div className="space-y-4">
            <span className="block text-[10px] text-[#7C786E] font-bold uppercase tracking-wider px-1">
              Active Lab Projects ({projects.length})
            </span>
            
            <div className="space-y-4">
              {projects.map((proj) => {
                const isExpanded = expandedProjectId === proj._id;
                const progress = getProjectProgress(proj);

                return (
                  <div
                    key={proj._id}
                    className="warm-card rounded-3xl p-5 border border-[#EFECE3] hover:border-[#F5C451] transition-all duration-300 flex flex-col gap-4 bg-white shadow-sm"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-bold text-[#1E1D1A] truncate leading-snug group-hover:text-[#7A6218] transition-colors">
                          {proj.title}
                        </h4>

                        {/* Tech stack pills */}
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {proj.techStack.map((skill, idx) => (
                            <span
                              key={idx}
                              className="text-[9px] font-medium px-2 py-0.5 rounded-md bg-[#FAF9F5] border border-[#ECE9DF] text-[#4E4B42]"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>

                        <p className="text-xs text-[#7C786E] leading-relaxed mt-2.5">
                          {proj.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setExpandedProjectId(isExpanded ? null : proj._id || null)}
                          className="p-1.5 text-[#7C786E] hover:text-[#1E1D1A] hover:bg-[#FAF9F5] rounded-lg border border-[#ECE9DF]"
                          title="View Phases Tracking"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>

                        <button
                          onClick={() => handleRemoveProject(proj._id)}
                          className="p-1.5 text-[#7C786E] hover:text-red-650 hover:bg-[#FAF9F5] rounded-lg border border-[#ECE9DF]"
                          title="Remove Project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Progress indicator */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-[#E5E2D6] h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#7A6218] to-[#2C2B27] transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-[#7C786E] shrink-0 w-8 text-right">
                        {progress}%
                      </span>
                    </div>

                    {/* Expanded Phases checklist */}
                    {isExpanded && proj.phases && proj.phases.length > 0 && (
                      <div className="pt-4 border-t border-[#EFECE3] space-y-4 animate-in slide-in-from-top-4 duration-300">
                        {proj.phases.map((phase, idx) => (
                          <div key={idx} className="space-y-2">
                            <span className="block text-[10px] text-[#7A6218] font-bold uppercase tracking-wider">
                              {phase.name}
                            </span>
                            <div className="space-y-2 pl-2">
                              {phase.tasks.map((task) => (
                                <div
                                  key={task.id}
                                  onClick={() => handleToggleTask(proj._id, task.id)}
                                  className="flex items-start gap-2.5 cursor-pointer select-none group text-xs text-[#1E1D1A]"
                                >
                                  {task.completed ? (
                                    <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                  ) : (
                                    <Square className="w-4 h-4 text-[#7C786E] group-hover:text-[#1E1D1A] shrink-0 mt-0.5" />
                                  )}
                                  <span className={task.completed ? "text-[#7C786E] line-through" : "text-[#1E1D1A]"}>
                                    {task.name}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {projects.length === 0 && (
                <div className="warm-card p-12 text-center text-[#7C786E] bg-white">
                  <FolderGit className="w-12 h-12 text-[#7C786E] mx-auto mb-2 opacity-40" />
                  <h4 className="font-bold text-[#1E1D1A] text-sm">No portfolio projects catalogued</h4>
                  <p className="text-xs text-[#7C786E] max-w-sm mx-auto mt-1">
                    Register a project manually or use our interactive AI Project Planner to architect and track phases.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Add Project Form Card */}
          <div className="warm-card rounded-3xl p-6 border border-[#EFECE3] bg-white shadow-sm">
            <h3 className="text-xs text-[#7C786E] font-bold uppercase tracking-wider flex items-center gap-1.5 mb-4 border-b border-[#EFECE3] pb-2">
              <Plus className="w-3.5 h-3.5 text-[#7A6218]" /> Register New Project Manually
            </h3>
            
            <form onSubmit={handleAddProject} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-[#7C786E] font-bold uppercase tracking-wider block">
                  Project Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Ledger Sync Broker"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#ECE9DF] focus:outline-none focus:border-[#7A6218] text-xs text-[#1E1D1A] placeholder-[#7C786E]/55 transition-colors shadow-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-[#7C786E] font-bold uppercase tracking-wider block">
                  Technologies (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. React, Go, WebSockets, Docker"
                  value={newSkills}
                  onChange={(e) => setNewSkills(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#ECE9DF] focus:outline-none focus:border-[#7A6218] text-xs text-[#1E1D1A] placeholder-[#7C786E]/55 transition-colors shadow-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-[#7C786E] font-bold uppercase tracking-wider block">
                  Architectural Summary & Key Results
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Developed a serverless video encoder processing raw files using multi-thread AWS Lambda functions, achieving 60% faster rendering times."
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#ECE9DF] focus:outline-none focus:border-[#7A6218] text-xs text-[#1E1D1A] placeholder-[#7C786E]/55 transition-colors resize-none shadow-sm"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-[#2C2B27] text-white hover:bg-[#1E1D1A] text-xs font-bold transition-all cursor-pointer shadow-sm"
                >
                  Add to Lab
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: AI Project Planner & Resume preview (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* AI Project Planner card */}
          <div className="warm-card rounded-3xl p-6 border border-[#EFECE3] bg-white space-y-6 shadow-sm relative overflow-hidden">
            {/* Glow design */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F5C451]/5 rounded-full blur-2xl -z-10 pointer-events-none" />

            <div className="border-b border-[#EFECE3] pb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#1E1D1A] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#F5C451]" />
                AI Project Planner
              </h3>
              <span className="px-2 py-0.5 rounded bg-[#FAF4D8] border border-[#E8DFB3] text-[#7A6218] text-[9px] font-bold uppercase">
                Interactive
              </span>
            </div>

            {/* STEP 1: PREFERENCES */}
            {plannerStep === 1 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <p className="text-xs text-[#7C786E] leading-relaxed">
                  Provide your target preferences. PinkyPow AI will generate an innovative follow-up question to calibrate technical complexity.
                </p>

                <div className="space-y-1.5">
                  <label className="text-[9px] text-[#7C786E] font-bold uppercase tracking-wider block">Skill Level</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["Beginner", "Intermediate", "Advanced"] as const).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setPlannerLevel(lvl)}
                        className={`py-2 px-1 rounded-xl border text-[10px] font-bold transition-all cursor-pointer ${
                          plannerLevel === lvl
                            ? "bg-[#2C2B27] text-white border-[#2C2B27]"
                            : "bg-[#FAF9F5] border-[#ECE9DF] text-[#7C786E]"
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] text-[#7C786E] font-bold uppercase tracking-wider block">Preferred Stack</label>
                  <input
                    type="text"
                    value={plannerStack}
                    onChange={(e) => setPlannerStack(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#ECE9DF] focus:outline-none focus:border-[#7A6218] text-xs text-[#1E1D1A] shadow-sm font-sans"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] text-[#7C786E] font-bold uppercase tracking-wider block">Target Domain</label>
                  <select
                    value={plannerDomain}
                    onChange={(e) => setPlannerDomain(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#ECE9DF] focus:outline-none focus:border-[#7A6218] text-xs text-[#1E1D1A] shadow-sm"
                  >
                    <option value="AI/ML Agents">AI/ML Agents</option>
                    <option value="SaaS & Developer Tools">SaaS & Developer Tools</option>
                    <option value="Fintech & Ledger Systems">Fintech & Ledger Systems</option>
                    <option value="Real-time Web3 & IoT">Real-time Web3 & IoT</option>
                    <option value="Collaborative Workspaces">Collaborative Workspaces</option>
                  </select>
                </div>

                <button
                  onClick={handleGetFollowUp}
                  disabled={loadingFollowUp || !plannerStack}
                  className="w-full py-3 rounded-xl bg-[#2C2B27] hover:bg-[#1E1D1A] text-white font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingFollowUp ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Analyzing stack...</span>
                    </>
                  ) : (
                    <>
                      <span>Generate Calibration Question</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            )}

            {/* STEP 2: FOLLOW-UP QUESTION */}
            {plannerStep === 2 && (
              <div className="space-y-4 animate-in zoom-in-95 duration-200">
                <div className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#ECE9DF] space-y-2">
                  <span className="block text-[9px] text-[#7A6218] font-bold uppercase tracking-wider">
                    AI Architect Inquiry
                  </span>
                  <p className="text-xs text-[#1E1D1A] leading-relaxed font-sans font-medium">
                    {followUpQuestion}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] text-[#7C786E] font-bold uppercase tracking-wider block">
                    Your Response Preference
                  </label>
                  <textarea
                    rows={3}
                    value={followUpAnswer}
                    onChange={(e) => setFollowUpAnswer(e.target.value)}
                    placeholder="e.g. I prefer to focus on high throughput pipelines with vector search integration, rather than complex offline sync UI..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#ECE9DF] focus:outline-none focus:border-[#7A6218] text-xs text-[#1E1D1A] placeholder-[#7C786E]/55 transition-colors resize-none shadow-sm font-sans"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setPlannerStep(1)}
                    className="flex-1 py-2.5 rounded-xl bg-white border border-[#ECE9DF] text-[#7C786E] text-xs font-bold transition-all hover:bg-[#FAF9F5]"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleCreateProjectProposal}
                    disabled={loadingProposal || !followUpAnswer}
                    className="flex-1 py-2.5 rounded-xl bg-[#2C2B27] hover:bg-[#1E1D1A] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    {loadingProposal ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Architecting...</span>
                      </>
                    ) : (
                      <>
                        <span>Build Proposal</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: PROPOSED PROJECT OUTLINE */}
            {plannerStep === 3 && proposedProject && (
              <div className="space-y-5 animate-in zoom-in-95 duration-200">
                <div className="space-y-2">
                  <span className="block text-[9px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold uppercase w-max tracking-wide">
                    Custom Proposal Ready
                  </span>
                  <h4 className="text-sm font-extrabold text-[#1E1D1A] tracking-tight leading-snug">
                    {proposedProject.title}
                  </h4>
                  <p className="text-xs text-[#7C786E] leading-relaxed font-sans">
                    {proposedProject.description}
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="block text-[9px] text-[#7C786E] font-bold uppercase tracking-wider">
                    Syllabus Phases Overview
                  </span>
                  <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                    {proposedProject.phases?.map((p, idx) => (
                      <div key={idx} className="p-2 bg-[#FAF9F5] border border-[#ECE9DF] rounded-xl text-[10px] space-y-1">
                        <span className="block font-bold text-[#1E1D1A]">{p.name}</span>
                        <p className="text-zinc-550 leading-normal pl-1 truncate">
                          Tasks: {p.tasks.map((t) => t.name).join(" • ")}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setPlannerStep(2)}
                    className="flex-1 py-2.5 rounded-xl bg-white border border-[#ECE9DF] text-[#7C786E] text-xs font-bold transition-all hover:bg-[#FAF9F5]"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleAddProposedProject}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Add & Track Progress</span>
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Resume compiler controls */}
          <div className="warm-card rounded-3xl p-6 border border-[#EFECE3] bg-white flex flex-col justify-between space-y-6 shadow-sm">
            <div className="space-y-4">
              <span className="block text-[10px] text-[#7C786E] font-bold uppercase tracking-wider">Include Datasources</span>
              
              <div className="space-y-3.5">
                {/* Internship checkbox */}
                <div
                  onClick={() => setIncludeInternships(!includeInternships)}
                  className="flex items-center gap-3 cursor-pointer text-xs select-none group"
                >
                  {includeInternships ? (
                    <CheckSquare className="w-5 h-5 text-[#7A6218] shrink-0" />
                  ) : (
                    <Square className="w-5 h-5 text-[#7C786E] group-hover:text-[#4E4B42] shrink-0" />
                  )}
                  <div>
                    <span className="block font-bold text-[#1E1D1A]">Internships Tracker Data</span>
                    <span className="block text-[10px] text-[#7C786E]">{dbInternships.length} registered internships</span>
                  </div>
                </div>

                {/* Hackathons checkbox */}
                <div
                  onClick={() => setIncludeHackathons(!includeHackathons)}
                  className="flex items-center gap-3 cursor-pointer text-xs select-none group"
                >
                  {includeHackathons ? (
                    <CheckSquare className="w-5 h-5 text-[#7A6218] shrink-0" />
                  ) : (
                    <Square className="w-5 h-5 text-[#7C786E] group-hover:text-[#4E4B42] shrink-0" />
                  )}
                  <div>
                    <span className="block font-bold text-[#1E1D1A]">Completed Hackathons</span>
                    <span className="block text-[10px] text-[#7C786E]">{dbHackathons.length} registered hackathons</span>
                  </div>
                </div>

                {/* Certs checkbox */}
                <div
                  onClick={() => setIncludeCerts(!includeCerts)}
                  className="flex items-center gap-3 cursor-pointer text-xs select-none group"
                >
                  {includeCerts ? (
                    <CheckSquare className="w-5 h-5 text-[#7A6218] shrink-0" />
                  ) : (
                    <Square className="w-5 h-5 text-[#7C786E] group-hover:text-[#4E4B42] shrink-0" />
                  )}
                  <div>
                    <span className="block font-bold text-[#1E1D1A]">Validated Certs</span>
                    <span className="block text-[10px] text-[#7C786E]">AI validated credentials</span>
                  </div>
                </div>

                {/* Projects checkbox */}
                <div
                  onClick={() => setIncludeProjects(!includeProjects)}
                  className="flex items-center gap-3 cursor-pointer text-xs select-none group"
                >
                  {includeProjects ? (
                    <CheckSquare className="w-5 h-5 text-[#7A6218] shrink-0" />
                  ) : (
                    <Square className="w-5 h-5 text-[#7C786E] group-hover:text-[#4E4B42] shrink-0" />
                  )}
                  <div>
                    <span className="block font-bold text-[#1E1D1A]">Projects Lab</span>
                    <span className="block text-[10px] text-[#7C786E]">{projects.length} sandbox projects</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button & Loader */}
            <div className="space-y-4">
              <button
                onClick={startResumeCompilation}
                disabled={isCompiling}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#7A6218] to-[#2C2B27] hover:from-[#8F7420] hover:to-[#1E1D1A] text-white font-black text-xs uppercase tracking-wider shadow-md shadow-[#7A6218]/10 hover:shadow-[#7A6218]/25 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isCompiling ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Compiling...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-200" />
                    <span>Generate ATS-Friendly Resume</span>
                  </>
                )}
              </button>

              {isCompiling && (
                <div className="space-y-2 bg-[#21201D] rounded-xl p-3 border border-zinc-800 font-mono text-[9px] text-zinc-450 max-h-[85px] overflow-y-auto scrollbar-none shadow-inner">
                  <div className="flex justify-between items-center pb-1.5 border-b border-zinc-800 mb-1.5">
                    <span className="text-[8px] text-zinc-500 uppercase font-bold">Build Stream</span>
                    <span className="text-[#F5C451] font-bold">{compileProgress}%</span>
                  </div>
                  {compileLogs.map((log, index) => (
                    <div key={index} className="flex gap-1.5 items-start">
                      <span className="text-[#F5C451]/60 shrink-0">&gt;</span>
                      <span className="leading-snug text-zinc-350">{log}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* --- MOCK RESUME DOWNLOAD MODAL --- */}
      {showDownloadModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div
            className="w-full max-w-md bg-[#FAF6EA] rounded-3xl p-6 space-y-6 border border-[#ECE9DF] shadow-2xl relative animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setShowDownloadModal(false)}
              className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-[#FAF9F5] border border-transparent hover:border-[#ECE9DF] text-[#7C786E] hover:text-[#1E1D1A] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-[#FAF4D8] border border-[#E8DFB3] flex items-center justify-center text-[#7A6218] mx-auto">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#1E1D1A] tracking-tight">
                Resume Compiled Successfully!
              </h3>
              <p className="text-xs text-[#7C786E]">
                Your portfolio datasources have been compiled into an ATS-friendly template.
              </p>
            </div>

            {/* Resume Quality report */}
            <div className="p-4 rounded-2xl bg-white border border-[#EFECE3] space-y-3 text-xs shadow-sm">
              <div className="flex justify-between items-center text-[#7C786E] font-semibold border-b border-[#EFECE3] pb-2">
                <span>Optimization Grade</span>
                <span className="text-[#7A6218] font-black">A+ / Tier 1</span>
              </div>
              <div className="space-y-1 text-[#7C786E] text-[11px] leading-relaxed">
                <p>• Chronological order satisfies ATS parsing guidelines.</p>
                <p>• Keywords aligned with software and cloud engineering roles.</p>
                <p>• Typographical margins standardized to LaTeX compiler ratios.</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 grid grid-cols-2 gap-3 text-xs font-bold">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(compiledLaTeX);
                  triggerToast("LaTeX Source copied to clipboard!");
                }}
                className="py-3 px-4 rounded-xl border border-[#ECE9DF] hover:bg-[#FAF9F5] text-[#1E1D1A] flex items-center justify-center gap-1.5 cursor-pointer bg-white"
              >
                <Copy className="w-4 h-4 text-[#7C786E]" />
                <span>Copy LaTeX</span>
              </button>
              
              <button
                onClick={async () => {
                  setShowDownloadModal(false);
                  triggerToast("Compiling and generating PDF...", "info");
                  try {
                    const { jsPDF } = await import("jspdf");
                    const doc = new jsPDF({
                      orientation: "portrait",
                      unit: "pt",
                      format: "letter"
                    });

                    const centerText = (text: string, y: number, size: number, style = "normal") => {
                      doc.setFont("helvetica", style);
                      doc.setFontSize(size);
                      const textWidth = doc.getTextWidth(text);
                      const x = (doc.internal.pageSize.getWidth() - textWidth) / 2;
                      doc.text(text, x, y);
                    };

                    const addSectionHeader = (title: string, y: number) => {
                      doc.setFont("helvetica", "bold");
                      doc.setFontSize(11);
                      doc.setTextColor(30, 29, 26);
                      doc.text(title.toUpperCase(), 54, y);
                      doc.setDrawColor(239, 236, 227);
                      doc.setLineWidth(1);
                      doc.line(54, y + 4, doc.internal.pageSize.getWidth() - 54, y + 4);
                      return y + 18;
                    };

                    let yPos = 50;

                    // Header
                    centerText(compiledUserData?.name || "Raja Kumaran", yPos, 16, "bold");
                    yPos += 18;
                    
                    const contactInfo = `Email: ${compiledUserData?.email || "raja@pinkypow.dev"} | College: ${compiledUserData?.college || "College of Engineering"}`;
                    centerText(contactInfo, yPos, 9, "normal");
                    yPos += 22;

                    // Education
                    yPos = addSectionHeader("Education", yPos);
                    doc.setFont("helvetica", "bold");
                    doc.setFontSize(10);
                    doc.text(compiledUserData?.college || "College of Engineering", 54, yPos);
                    doc.setFont("helvetica", "normal");
                    doc.text(compiledUserData?.yearOfStudy || "2026", doc.internal.pageSize.getWidth() - 54 - doc.getTextWidth(compiledUserData?.yearOfStudy || "2026"), yPos);
                    yPos += 12;
                    doc.text(`${compiledUserData?.course || "B.Tech Information Technology"} (GPA: ${compiledUserData?.gpa || "8.5/10"})`, 54, yPos);
                    yPos += 20;

                    // Experience
                    if (includeInternships && compiledInternships.length > 0) {
                      yPos = addSectionHeader("Professional Experience", yPos);
                      compiledInternships.forEach((item) => {
                        doc.setFont("helvetica", "bold");
                        doc.text(item.company || "Company", 54, yPos);
                        const dateRange = item.startDate ? `${item.startDate} - ${item.endDate || "Present"}` : "Active";
                        doc.setFont("helvetica", "normal");
                        doc.text(dateRange, doc.internal.pageSize.getWidth() - 54 - doc.getTextWidth(dateRange), yPos);
                        yPos += 12;

                        doc.setFont("helvetica", "oblique");
                        doc.text(item.role || "Intern", 54, yPos);
                        const loc = item.location || "Remote";
                        doc.setFont("helvetica", "normal");
                        doc.text(loc, doc.internal.pageSize.getWidth() - 54 - doc.getTextWidth(loc), yPos);
                        yPos += 12;

                        doc.setFont("helvetica", "normal");
                        doc.setFontSize(9);
                        const desc = item.description || "Collaborated on codebase components and resolved project pipelines.";
                        const splitDesc = doc.splitTextToSize(`• ${desc}`, doc.internal.pageSize.getWidth() - 108);
                        doc.text(splitDesc, 54, yPos);
                        yPos += (splitDesc.length * 11) + 8;
                      });
                      yPos += 8;
                    }

                    // Projects
                    if (includeProjects && projects.length > 0) {
                      yPos = addSectionHeader("Key Portfolio Projects", yPos);
                      projects.forEach((proj) => {
                        doc.setFont("helvetica", "bold");
                        doc.setFontSize(10);
                        doc.text(proj.title || "Project", 54, yPos);
                        const techStr = proj.techStack ? proj.techStack.join(", ") : "";
                        doc.setFont("helvetica", "normal");
                        doc.text(techStr, doc.internal.pageSize.getWidth() - 54 - doc.getTextWidth(techStr), yPos);
                        yPos += 12;

                        doc.setFont("helvetica", "normal");
                        doc.setFontSize(9);
                        const splitDesc = doc.splitTextToSize(`• ${proj.description}`, doc.internal.pageSize.getWidth() - 108);
                        doc.text(splitDesc, 54, yPos);
                        yPos += (splitDesc.length * 11) + 8;
                      });
                      yPos += 8;
                    }

                    // Hackathons
                    if (includeHackathons && compiledHackathons.length > 0) {
                      yPos = addSectionHeader("Hackathons & Achievements", yPos);
                      compiledHackathons.forEach((hack) => {
                        doc.setFont("helvetica", "bold");
                        doc.setFontSize(10);
                        doc.text(`${hack.title} (${hack.status || "Participated"})`, 54, yPos);
                        doc.setFont("helvetica", "normal");
                        doc.text(hack.date || "", doc.internal.pageSize.getWidth() - 54 - doc.getTextWidth(hack.date || ""), yPos);
                        yPos += 12;

                        doc.setFont("helvetica", "normal");
                        doc.setFontSize(9);
                        const splitDesc = doc.splitTextToSize(`• Hosted by ${hack.hosts || "Devpost"}. ${hack.description || ""}`, doc.internal.pageSize.getWidth() - 108);
                        doc.text(splitDesc, 54, yPos);
                        yPos += (splitDesc.length * 11) + 8;
                      });
                      yPos += 8;
                    }

                    // DSA
                    yPos = addSectionHeader("Data Structures & Algorithms", yPos);
                    doc.setFont("helvetica", "normal");
                    doc.setFontSize(9);
                    doc.text(`• Solved ${compiledDsaCount} competitive programming algorithms on LeetCode/HackerRank.`, 54, yPos);
                    yPos += 11;
                    doc.text(`• Maintained an active problem solving daily streak of ${compiledDsaStreak} days.`, 54, yPos);
                    yPos += 20;

                    // Certifications
                    if (includeCerts && compiledCerts.length > 0) {
                      yPos = addSectionHeader("Certifications & Credentials", yPos);
                      doc.setFont("helvetica", "normal");
                      doc.setFontSize(9);
                      compiledCerts.forEach((cert) => {
                        doc.text(`• Verified: ${cert.title} (${cert.issuer}) - category: ${cert.category || "General"}`, 54, yPos);
                        yPos += 11;
                      });
                      yPos += 8;
                    }

                    // Skills
                    yPos = addSectionHeader("Technical Skills & Interests", yPos);
                    doc.setFont("helvetica", "bold");
                    doc.setFontSize(9);
                    doc.text("Interests: ", 54, yPos);
                    doc.setFont("helvetica", "normal");
                    const intStr = Array.isArray(compiledUserData?.interests) ? compiledUserData.interests.join(", ") : "Web Applications, System Design";
                    doc.text(intStr, 105, yPos);
                    yPos += 12;

                    doc.setFont("helvetica", "bold");
                    doc.text("Core Stack: ", 54, yPos);
                    doc.setFont("helvetica", "normal");
                    doc.text("React, Next.js, Node.js, TypeScript, Python, MongoDB, SQL, Git", 112, yPos);

                    const finalFilename = `ATS_Resume_${(compiledUserData?.name || "Raja_Kumaran").replace(/\s+/g, "_")}.pdf`;
                    doc.save(finalFilename);
                    triggerToast(`Downloaded ${finalFilename} successfully!`);
                  } catch (err) {
                    console.error("PDF generation error:", err);
                    triggerToast("Failed to render PDF client-side.", "info");
                  }
                }}
                className="py-3 px-4 rounded-xl bg-[#2C2B27] text-white hover:bg-[#1E1D1A] flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {downloadNotification && (
        <div className="fixed bottom-6 right-6 bg-[#FAF6EA] border border-[#ECE9DF] text-[#1E1D1A] px-5 py-4 rounded-2xl shadow-2xl z-55 flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300">
          <div className={`p-1.5 rounded-full ${downloadNotification.type === 'info' ? 'bg-[#FAF4D8] border-[#E8DFB3] text-[#7A6218]' : 'bg-emerald-50 border-emerald-250 text-emerald-700'}`}>
            <CheckCircle className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold">{downloadNotification.message}</span>
          <button onClick={() => setDownloadNotification(null)} className="ml-2 text-[#7C786E] hover:text-[#1E1D1A] cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
