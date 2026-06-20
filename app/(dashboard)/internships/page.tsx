"use client";

import React, { useState, useEffect } from "react";
import {
  Briefcase,
  Sparkles,
  Terminal,
  Check,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Building,
  ArrowUpRight,
  TrendingUp,
  RefreshCw,
  FolderPlus
} from "lucide-react";

interface Match {
  id: string;
  company: string;
  role: string;
  location: string;
  matchScore: number;
  tags: string[];
  logoText: string;
  logoBg: string;
  applyUrl: string;
}

interface TrackerCard {
  id: string;
  company: string;
  role: string;
  location: string;
  matchScore: number;
  column: "saved" | "applied" | "interviewing" | "rejected_offer";
  tags: string[];
  logoText: string;
  logoBg: string;
  applyUrl: string;
}

const ALL_MOCK_MATCHES: Match[] = [
  {
    id: "match-stripe",
    company: "Stripe",
    role: "Software Engineer Intern (Backend)",
    location: "San Francisco, CA (Hybrid)",
    matchScore: 94,
    tags: ["Node.js", "Redis", "REST APIs"],
    logoText: "S",
    logoBg: "bg-gradient-to-tr from-indigo-500 to-purple-600",
    applyUrl: "https://stripe.com/jobs"
  },
  {
    id: "match-vercel",
    company: "Vercel",
    role: "Frontend Developer (Next.js)",
    location: "Remote (Global)",
    matchScore: 89,
    tags: ["React 19", "Tailwind CSS", "Next.js"],
    logoText: "V",
    logoBg: "bg-gradient-to-tr from-zinc-800 to-zinc-950 border border-white/10",
    applyUrl: "https://vercel.com/careers"
  },
  {
    id: "match-supabase",
    company: "Supabase",
    role: "Developer Relations Intern",
    location: "Remote (US)",
    matchScore: 91,
    tags: ["PostgreSQL", "TypeScript", "Next.js"],
    logoText: "S",
    logoBg: "bg-gradient-to-tr from-emerald-500 to-teal-600",
    applyUrl: "https://supabase.com/careers"
  },
  {
    id: "match-linear",
    company: "Linear",
    role: "Product Engineer Intern",
    location: "New York, NY (Office)",
    matchScore: 95,
    tags: ["React", "GraphQL", "TypeScript"],
    logoText: "L",
    logoBg: "bg-gradient-to-tr from-zinc-600 to-zinc-800",
    applyUrl: "https://linear.app/careers"
  },
  {
    id: "match-figma",
    company: "Figma",
    role: "UX Engineer Intern",
    location: "London, UK (Hybrid)",
    matchScore: 82,
    tags: ["Figma Plugins", "Canvas", "TypeScript"],
    logoText: "F",
    logoBg: "bg-gradient-to-tr from-orange-500 via-rose-500 to-purple-500",
    applyUrl: "https://figma.com/careers"
  }
];

const ALL_MOCK_FULLTIME_MATCHES: Match[] = [
  {
    id: "match-ft-stripe",
    company: "Stripe",
    role: "Software Engineer (New Grad)",
    location: "San Francisco, CA (Hybrid)",
    matchScore: 94,
    tags: ["Node.js", "Redis", "REST APIs"],
    logoText: "S",
    logoBg: "bg-gradient-to-tr from-indigo-500 to-purple-600",
    applyUrl: "https://stripe.com/jobs"
  },
  {
    id: "match-ft-vercel",
    company: "Vercel",
    role: "Frontend Developer (Next.js)",
    location: "Remote (Global)",
    matchScore: 89,
    tags: ["React 19", "Tailwind CSS", "Next.js"],
    logoText: "V",
    logoBg: "bg-gradient-to-tr from-zinc-800 to-zinc-950 border border-white/10",
    applyUrl: "https://vercel.com/careers"
  },
  {
    id: "match-ft-supabase",
    company: "Supabase",
    role: "Full Stack Developer",
    location: "Remote (Global)",
    matchScore: 91,
    tags: ["PostgreSQL", "TypeScript", "Next.js"],
    logoText: "S",
    logoBg: "bg-gradient-to-tr from-emerald-500 to-teal-600",
    applyUrl: "https://supabase.com/careers"
  }
];

const INITIAL_TRACKER_CARDS: TrackerCard[] = [
  {
    id: "track-notion",
    company: "Notion",
    role: "Software Engineer Intern",
    location: "San Francisco, CA (Office)",
    matchScore: 87,
    column: "saved",
    tags: ["React", "PostgreSQL"],
    logoText: "N",
    logoBg: "bg-gradient-to-tr from-zinc-700 to-zinc-900",
    applyUrl: "https://notion.so/careers"
  },
  {
    id: "track-airbnb",
    company: "Airbnb",
    role: "Frontend Intern",
    location: "San Francisco, CA (Hybrid)",
    matchScore: 92,
    column: "applied",
    tags: ["React Native", "CSS Modules"],
    logoText: "A",
    logoBg: "bg-gradient-to-tr from-rose-500 to-pink-600",
    applyUrl: "https://careers.airbnb.com"
  },
  {
    id: "track-coinbase",
    company: "Coinbase",
    role: "Backend Intern (Crypto)",
    location: "Remote (US)",
    matchScore: 85,
    column: "interviewing",
    tags: ["Go", "Docker", "gRPC"],
    logoText: "C",
    logoBg: "bg-gradient-to-tr from-blue-500 to-indigo-600",
    applyUrl: "https://coinbase.com/careers"
  },
  {
    id: "track-netflix",
    company: "Netflix",
    role: "UI Engineer Intern",
    location: "Los Gatos, CA",
    matchScore: 78,
    column: "rejected_offer",
    tags: ["GraphQL", "Next.js"],
    logoText: "N",
    logoBg: "bg-gradient-to-tr from-red-600 to-red-800",
    applyUrl: "https://jobs.netflix.com"
  }
];

const COLUMNS = [
  { id: "saved", title: "Saved", accent: "border-t-zinc-500/30 text-zinc-400" },
  { id: "applied", title: "Applied", accent: "border-t-pink-500/30 text-pink-400" },
  { id: "interviewing", title: "Interviewing", accent: "border-t-purple-500/30 text-purple-400" },
  { id: "rejected_offer", title: "Offer / Decided", accent: "border-t-emerald-500/30 text-emerald-400" }
] as const;

export default function InternshipRadar() {
  const [isFetching, setIsFetching] = useState(false);
  const [fetchProgress, setFetchProgress] = useState(0);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);
  const [matches, setMatches] = useState<Match[]>([]);
  const [trackerCards, setTrackerCards] = useState<TrackerCard[]>([]);
  const [hasFetched, setHasFetched] = useState(false);
  const [fetchedData, setFetchedData] = useState<Match[] | null>(null);

  // Tabs State
  const [activeTab, setActiveTab] = useState<"internship" | "fulltime">("internship");

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [workModeFilter, setWorkModeFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [customAiQuery, setCustomAiQuery] = useState("");
  const [aiFilteredIds, setAiFilteredIds] = useState<string[] | null>(null);
  const [isAiFiltering, setIsAiFiltering] = useState(false);

  useEffect(() => {
    setMatches([]);
    setHasFetched(false);
    setFetchedData(null);
    setFormType(activeTab);
  }, [activeTab]);

  // Custom Manual Addition Form State
  const [username, setUsername] = useState<string>("Najla1208");
  const [formCompany, setFormCompany] = useState("");
  const [formRole, setFormRole] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formApplyLink, setFormApplyLink] = useState("");
  const [formMatchPercentage, setFormMatchPercentage] = useState(100);
  const [formStatus, setFormStatus] = useState<"Saved" | "Applied" | "Interviewing" | "Decided">("Saved");
  const [formStartDate, setFormStartDate] = useState("");
  const [formEndDate, setFormEndDate] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formType, setFormType] = useState<"internship" | "fulltime">("internship");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("currentUser");
      if (stored) {
        try {
          const user = JSON.parse(stored);
          if (user && user.username) {
            setUsername(user.username);
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const res = await fetch(`/api/internships?username=${username}&type=${activeTab}`);
        const data = await res.json();
        if (data.success && data.internships) {
          const mapped: TrackerCard[] = data.internships.map((item: any) => {
            const logoColors = [
              "bg-gradient-to-tr from-indigo-500 to-purple-600",
              "bg-gradient-to-tr from-emerald-500 to-teal-600",
              "bg-gradient-to-tr from-orange-500 via-rose-500 to-purple-500",
              "bg-gradient-to-tr from-zinc-800 to-zinc-950 border border-white/10",
              "bg-gradient-to-tr from-blue-500 to-indigo-600",
              "bg-gradient-to-tr from-red-600 to-red-800",
              "bg-gradient-to-tr from-zinc-600 to-zinc-800"
            ];
            
            let columnId: "saved" | "applied" | "interviewing" | "rejected_offer" = "saved";
            const s = item.status.toLowerCase();
            if (s === "applied") columnId = "applied";
            else if (s === "interviewing") columnId = "interviewing";
            else if (s === "offer" || s === "decided") columnId = "rejected_offer";
            
            const firstChar = item.company ? item.company.charAt(0).toUpperCase() : "I";
            const colorHash = item.company ? item.company.charCodeAt(0) % logoColors.length : 0;

            return {
              id: item._id,
              company: item.company,
              role: item.role,
              location: item.location || "Remote",
              matchScore: item.matchPercentage || 85,
              column: columnId,
              tags: item.description ? [item.description.substring(0, 15)] : ["React", "TypeScript"],
              logoText: firstChar,
              logoBg: logoColors[colorHash],
              applyUrl: item.applyLink || ""
            };
          });
          setTrackerCards(mapped);
        }
      } catch (err) {
        console.error("Error loading internships:", err);
      }
    };
    fetchInternships();
  }, [username, activeTab]);

  const companiesToScan = ["Stripe", "Vercel", "Supabase", "Linear", "Figma", "Google", "Meta", "Notion", "Github"];

  const handleFetchMatches = () => {
    setIsFetching(true);
    setFetchProgress(0);
    setTerminalLogs([]);
    setMatches([]);
    setFetchedData(null);
    setCurrentSearchIndex(0);
    
    // Reset filters
    setSearchQuery("");
    setWorkModeFilter("all");
    setRegionFilter("all");
    setRoleFilter("all");
    setCustomAiQuery("");
    setAiFilteredIds(null);

    let userTechStack = ["React", "TypeScript", "Node.js", "Python", "Next.js", "AI", "ML"];
    let userCountry = "";
    let userState = "";
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("currentUser");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.techStack && parsed.techStack.length > 0) {
            userTechStack = parsed.techStack;
          }
          userCountry = parsed.collegeCountry || "";
          userState = parsed.collegeState || "";
        } catch (e) {
          console.error(e);
        }
      }
    }

    // Call the dynamic scraper API in the background
    fetch("/api/scrape/internships", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        techStack: userTechStack,
        userLevel: "Entry",
        type: activeTab,
        collegeCountry: userCountry,
        collegeState: userState
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.listings) {
          const logoColors = [
            "bg-gradient-to-tr from-indigo-500 to-purple-600",
            "bg-gradient-to-tr from-emerald-500 to-teal-600",
            "bg-gradient-to-tr from-orange-500 via-rose-500 to-purple-500",
            "bg-gradient-to-tr from-zinc-800 to-zinc-950 border border-white/10",
            "bg-gradient-to-tr from-blue-500 to-indigo-600",
            "bg-gradient-to-tr from-red-600 to-red-800",
            "bg-gradient-to-tr from-zinc-600 to-zinc-800"
          ];
          const mapped: Match[] = data.listings.map((item: any, idx: number) => ({
            id: `scraped-${idx}-${Date.now()}`,
            company: item.companyName,
            role: item.roleTitle,
            location: item.location,
            matchScore: item.matchPercentage || 85,
            tags: item.roleTitle.toLowerCase().includes("frontend")
              ? ["React", "TypeScript", "Next.js"]
              : item.roleTitle.toLowerCase().includes("backend")
              ? ["Node.js", "SQL", "APIs"]
              : item.roleTitle.toLowerCase().includes("ai") || item.roleTitle.toLowerCase().includes("ml") || item.roleTitle.toLowerCase().includes("machine")
              ? ["Python", "PyTorch", "AI/ML"]
              : ["TypeScript", "Next.js", "Tailwind"],
            logoText: item.companyName ? item.companyName.charAt(0).toUpperCase() : "I",
            logoBg: logoColors[idx % logoColors.length],
            applyUrl: item.applyUrl || "https://github.com/SimplifyJobs/Summer2026-Internships"
          }));
          setFetchedData(mapped);
        } else {
          setFetchedData(activeTab === "fulltime" ? ALL_MOCK_FULLTIME_MATCHES : ALL_MOCK_MATCHES);
        }
      })
      .catch((err) => {
        console.error("Scraper fetch error:", err);
        setFetchedData(activeTab === "fulltime" ? ALL_MOCK_FULLTIME_MATCHES : ALL_MOCK_MATCHES);
      });
  };

  // Simulating the scraping log flow
  useEffect(() => {
    if (!isFetching) return;

    const logMessages = activeTab === "fulltime" ? [
      "Initializing PinkyPow scraper nodes...",
      "Calibrating neural match vectors to placement profile score [820]...",
      "Scraping global Greenhouse portals...",
      "Scraping Lever & Workday ATS databases...",
      "Scanning new grad & entry-level job positions...",
      "Applying semantic analysis to job roles...",
      "Calibrating match confidence intervals...",
      "Scrape complete! Synced high-match full-time jobs."
    ] : [
      "Initializing PinkyPow scraper nodes...",
      "Calibrating neural match vectors to placement profile score [820]...",
      "Scraping global Greenhouse portals...",
      "Scraping Lever & Workday ATS databases...",
      "Scanning Developer Experience internship listings...",
      "Applying semantic analysis to job roles...",
      "Calibrating match confidence intervals...",
      "Scrape complete! Synced 5 high-match internships."
    ];

    const interval = setInterval(() => {
      setFetchProgress((prev) => {
        // If data is not loaded yet and we are near the end, hold at 90%
        if (prev >= 90 && !fetchedData) {
          return 90;
        }
        const next = prev + 10;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsFetching(false);
            setMatches(fetchedData || (activeTab === "fulltime" ? ALL_MOCK_FULLTIME_MATCHES : ALL_MOCK_MATCHES));
            setHasFetched(true);
          }, 600);
          return 100;
        }
        return next;
      });

      setTerminalLogs((prev) => {
        const nextLogIndex = Math.min(Math.floor((fetchProgress / 100) * logMessages.length), logMessages.length - 1);
        if (!prev.includes(logMessages[nextLogIndex])) {
          return [...prev, `[${new Date().toLocaleTimeString()}] ${logMessages[nextLogIndex]}`];
        }
        return prev;
      });

      setCurrentSearchIndex((prev) => (prev + 1) % companiesToScan.length);
    }, 300);

    return () => clearInterval(interval);
  }, [isFetching, fetchProgress, fetchedData]);

  // Add Match to Tracker
  const handleAddToTracker = async (match: Match) => {
    // Check if already in tracker
    if (trackerCards.some((c) => c.company === match.company && c.role === match.role)) return;

    try {
      const res = await fetch("/api/internships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          company: match.company,
          role: match.role,
          status: "Saved",
          location: match.location,
          applyLink: match.applyUrl,
          matchPercentage: match.matchScore,
          type: activeTab
        })
      });
      const data = await res.json();
      if (data.success && data.internship) {
        const newCard: TrackerCard = {
          id: data.internship._id,
          company: match.company,
          role: match.role,
          location: match.location,
          matchScore: match.matchScore,
          column: "saved",
          tags: match.tags,
          logoText: match.logoText,
          logoBg: match.logoBg,
          applyUrl: match.applyUrl
        };
        setTrackerCards((prev) => [newCard, ...prev]);
        setMatches((prev) => prev.filter((m) => m.id !== match.id));
      }
    } catch (err) {
      console.error("Error adding to tracker:", err);
    }
  };

  // Move Tracker Card Column
  const handleMoveCard = async (cardId: string, direction: "left" | "right") => {
    const columnsOrder: ("saved" | "applied" | "interviewing" | "rejected_offer")[] = [
      "saved",
      "applied",
      "interviewing",
      "rejected_offer"
    ];

    const card = trackerCards.find((c) => c.id === cardId);
    if (!card) return;

    const currentIndex = columnsOrder.indexOf(card.column);
    let nextIndex = currentIndex;
    if (direction === "left" && currentIndex > 0) {
      nextIndex = currentIndex - 1;
    } else if (direction === "right" && currentIndex < columnsOrder.length - 1) {
      nextIndex = currentIndex + 1;
    }

    if (nextIndex === currentIndex) return;
    const nextColumn = columnsOrder[nextIndex];

    let dbStatus: "Saved" | "Applied" | "Interviewing" | "Decided" = "Saved";
    if (nextColumn === "applied") dbStatus = "Applied";
    else if (nextColumn === "interviewing") dbStatus = "Interviewing";
    else if (nextColumn === "rejected_offer") dbStatus = "Decided";

    try {
      const res = await fetch("/api/internships", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: cardId,
          status: dbStatus
        })
      });
      const data = await res.json();
      if (data.success) {
        setTrackerCards((prev) =>
          prev.map((c) => (c.id === cardId ? { ...c, column: nextColumn } : c))
        );
      }
    } catch (err) {
      console.error("Error updating card column:", err);
    }
  };

  // Remove Card
  const handleRemoveCard = async (cardId: string) => {
    try {
      const res = await fetch(`/api/internships?id=${cardId}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        setTrackerCards((prev) => prev.filter((card) => card.id !== cardId));
      }
    } catch (err) {
      console.error("Error deleting card:", err);
    }
  };

  // Add custom manual internship
  const handleSubmitCustomInternship = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCompany || !formRole) return;

    try {
      const res = await fetch("/api/internships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          company: formCompany,
          role: formRole,
          status: formStatus,
          location: formLocation || "Remote",
          applyLink: formApplyLink,
          matchPercentage: formMatchPercentage,
          startDate: formStartDate,
          endDate: formEndDate,
          description: formDescription,
          type: formType
        })
      });
      const data = await res.json();
      if (data.success && data.internship) {
        const logoColors = [
          "bg-gradient-to-tr from-indigo-500 to-purple-600",
          "bg-gradient-to-tr from-emerald-500 to-teal-600",
          "bg-gradient-to-tr from-orange-500 via-rose-500 to-purple-500",
          "bg-gradient-to-tr from-zinc-800 to-zinc-950 border border-white/10",
          "bg-gradient-to-tr from-blue-500 to-indigo-600",
          "bg-gradient-to-tr from-red-600 to-red-800",
          "bg-gradient-to-tr from-zinc-600 to-zinc-800"
        ];
        
        let columnId: "saved" | "applied" | "interviewing" | "rejected_offer" = "saved";
        if (formStatus === "Applied") columnId = "applied";
        else if (formStatus === "Interviewing") columnId = "interviewing";
        else if (formStatus === "Decided") columnId = "rejected_offer";

        const firstChar = formCompany.charAt(0).toUpperCase();
        const colorHash = formCompany.charCodeAt(0) % logoColors.length;

        const newCard: TrackerCard = {
          id: data.internship._id,
          company: formCompany,
          role: formRole,
          location: formLocation || "Remote",
          matchScore: formMatchPercentage,
          column: columnId,
          tags: formDescription ? [formDescription.substring(0, 15)] : ["Manual"],
          logoText: firstChar,
          logoBg: logoColors[colorHash],
          applyUrl: formApplyLink
        };

        setTrackerCards((prev) => [newCard, ...prev]);
        // Reset form
        setFormCompany("");
        setFormRole("");
        setFormLocation("");
        setFormApplyLink("");
        setFormMatchPercentage(100);
        setFormStatus("Saved");
        setFormStartDate("");
        setFormEndDate("");
        setFormDescription("");
        setFormType("internship");
      }
    } catch (err) {
      console.error("Error submitting manual internship:", err);
    }
  };

  // Custom AI Filter Handler
  const handleAiFilter = async () => {
    if (!customAiQuery.trim()) {
      setAiFilteredIds(null);
      return;
    }
    setIsAiFiltering(true);
    try {
      const res = await fetch("/api/ai/filter-internships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          internships: matches,
          query: customAiQuery
        })
      });
      const data = await res.json();
      if (data.success && data.matchingIds) {
        setAiFilteredIds(data.matchingIds);
      } else {
        setAiFilteredIds([]);
      }
    } catch (err) {
      console.error("AI filter request failed:", err);
      // fallback local search
      const keywords = customAiQuery.toLowerCase().split(/\s+/).filter(w => w.length > 2);
      const matchingIds = matches.filter((item) => {
        const itemText = `${item.company} ${item.role} ${item.location} ${(item.tags || []).join(' ')}`.toLowerCase();
        return keywords.length === 0 || keywords.some((kw) => itemText.includes(kw));
      }).map(item => item.id);
      setAiFilteredIds(matchingIds);
    } finally {
      setIsAiFiltering(false);
    }
  };

  const handleClearAiFilter = () => {
    setCustomAiQuery("");
    setAiFilteredIds(null);
  };

  // Computed Filtered Matches
  const filteredMatches = matches.filter((match) => {
    // 1. AI custom query filter if active
    if (aiFilteredIds !== null && !aiFilteredIds.includes(match.id)) {
      return false;
    }

    // 2. Work Mode Filter
    const locLower = match.location.toLowerCase();
    if (workModeFilter === "remote") {
      if (!locLower.includes("remote") && !locLower.includes("global")) return false;
    } else if (workModeFilter === "hybrid") {
      if (!locLower.includes("hybrid")) return false;
    } else if (workModeFilter === "office") {
      if (locLower.includes("remote") || locLower.includes("global") || locLower.includes("hybrid")) return false;
    }

    // 3. Region Filter
    if (regionFilter !== "all") {
      if (regionFilter === "us" && !locLower.includes("us") && !locLower.includes("san francisco") && !locLower.includes("new york") && !locLower.includes("ca") && !locLower.includes("ny")) return false;
      if (regionFilter === "uk" && !locLower.includes("uk") && !locLower.includes("london")) return false;
      if (regionFilter === "global" && !locLower.includes("global")) return false;
    }

    // 4. Role Filter
    if (roleFilter !== "all") {
      const roleLower = match.role.toLowerCase();
      if (roleFilter === "frontend" && !roleLower.includes("frontend") && !roleLower.includes("ux") && !roleLower.includes("ui")) return false;
      if (roleFilter === "backend" && !roleLower.includes("backend")) return false;
      if (roleFilter === "aiml" && !roleLower.includes("ai") && !roleLower.includes("ml") && !roleLower.includes("machine") && !roleLower.includes("neural")) return false;
    }

    // 5. General Search Query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      const companyMatch = match.company.toLowerCase().includes(query);
      const roleMatch = match.role.toLowerCase().includes(query);
      const locMatch = match.location.toLowerCase().includes(query);
      const tagMatch = match.tags.some(t => t.toLowerCase().includes(query));
      if (!companyMatch && !roleMatch && !locMatch && !tagMatch) return false;
    }

    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-[1360px] mx-auto pb-12 text-[#1E1D1A]">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-2 border-b border-[#EFECE3]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-normal text-[#1E1D1A] tracking-tight">Jobs & Internships Radar</h1>
          </div>
          <p className="text-[#7C786E] text-sm mt-2.5 max-w-xl">
            PinkyPow scans global tech portals in real-time, matching requirements directly to your profile placement score.
          </p>
        </div>

        {/* Score widget */}
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white border border-[#ECE9DF] shadow-sm">
          <div className="w-2.5 h-2.5 rounded-full bg-[#F5C451] animate-ping" />
          <div className="text-xs">
            <span className="text-[#7C786E] block font-semibold uppercase tracking-wider text-[9px]">Calibrated Profile Score</span>
            <span className="text-[#1E1D1A] font-extrabold text-sm">820 / 1000</span>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-[#EFECE3] gap-6 mb-4">
        <button
          onClick={() => setActiveTab("internship")}
          className={`pb-3 font-bold text-sm tracking-wider uppercase transition-all duration-300 relative cursor-pointer ${
            activeTab === "internship"
              ? "text-[#1E1D1A] border-b-2 border-[#2C2B27]"
              : "text-[#7C786E] hover:text-[#1E1D1A]"
          }`}
        >
          Internship Openings
        </button>
        <button
          onClick={() => setActiveTab("fulltime")}
          className={`pb-3 font-bold text-sm tracking-wider uppercase transition-all duration-300 relative cursor-pointer ${
            activeTab === "fulltime"
              ? "text-[#1E1D1A] border-b-2 border-[#2C2B27]"
              : "text-[#7C786E] hover:text-[#1E1D1A]"
          }`}
        >
          Full-Time Offers
        </button>
      </div>

      {/* Scraper / Fetch Dashboard */}
      <div className="warm-card p-8 relative overflow-hidden bg-white">
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F5C451]/5 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <h2 className="text-lg font-bold text-[#1E1D1A] tracking-tight flex items-center justify-center md:justify-start gap-2">
              <Sparkles className="w-5 h-5 text-[#F5C451]" />
              Real-time AI {activeTab === "fulltime" ? "Job" : "Internship"} Fetcher
            </h2>
            <p className="text-xs text-[#7C786E] max-w-md">
              Trigger a live scan across Vercel, Stripe, Linear, Notion, Supabase, Google and 30+ other corporate sites for {activeTab === "fulltime" ? "full-time job offers" : "internships"}.
            </p>
          </div>

          <button
            onClick={handleFetchMatches}
            disabled={isFetching}
            className={`relative py-3 px-8 rounded-2xl font-extrabold text-sm tracking-wide transition-all duration-500 group shadow-sm ${
              isFetching
                ? "bg-[#E5E2D6] text-[#7C786E] border border-[#ECE9DF] cursor-not-allowed"
                : "bg-[#2C2B27] text-white hover:bg-[#1E1D1A] cursor-pointer"
            }`}
          >
            {isFetching ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-[#F5C451]" />
                Scraping Dev Portals...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Fetch AI Matches
                <TrendingUp className="w-4 h-4 text-[#F5C451] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </span>
            )}
          </button>
        </div>

        {/* Live Scraper Terminal Log animation */}
        {isFetching && (
          <div className="mt-6 rounded-2xl bg-[#21201D] border border-[#2D2C28] p-4 space-y-3 font-mono text-[11px] text-zinc-300 shadow-inner">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <div className="flex items-center gap-2 text-zinc-400">
                <Terminal className="w-4 h-4 text-[#F5C451]" />
                <span>pinkypow-scraper.sh</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#F5C451] font-semibold animate-pulse">
                  Scanning: {companiesToScan[currentSearchIndex]}...
                </span>
                <span className="text-zinc-500">{Math.round(fetchProgress)}%</span>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#F5C451] to-[#7A6218] h-full transition-all duration-300"
                style={{ width: `${fetchProgress}%` }}
              />
            </div>

            <div className="space-y-1.5 max-h-32 overflow-y-auto pt-1">
              {terminalLogs.map((log, idx) => (
                <div key={idx} className="flex gap-2">
                  <span className="text-[#F5C451]/70 shrink-0">➔</span>
                  <span className="break-all">{log}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* New Matches Grid (Revealed after fetch) */}
      {(hasFetched || matches.length > 0) && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#7C786E] uppercase tracking-widest flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#2C2B27]" />
              New Matches Found ({filteredMatches.length} / {matches.length})
            </h3>
            {matches.length === 0 && (
              <span className="text-xs text-[#7C786E]">All matches added to tracker. Fetch again to refresh.</span>
            )}
          </div>

          {/* FILTERS PANEL */}
          {matches.length > 0 && (
            <div className="warm-card p-6 bg-white space-y-6 border border-[#ECE9DF] rounded-2xl shadow-sm">
              <div className="flex flex-col lg:flex-row gap-6 items-stretch justify-between">
                {/* Left side: Standard filters */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 flex-1">
                  {/* Search Input */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-[#7C786E] uppercase tracking-wider">Search Matches</label>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Company, role, tag..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#ECE9DF] text-xs text-[#1E1D1A] placeholder-[#7C786E]/60 focus:outline-none focus:border-[#F5C451] transition-all"
                    />
                  </div>

                  {/* Work Mode */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-[#7C786E] uppercase tracking-wider">Work Mode</label>
                    <select
                      value={workModeFilter}
                      onChange={(e) => setWorkModeFilter(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#ECE9DF] text-xs text-[#1E1D1A] focus:outline-none focus:border-[#F5C451] transition-all cursor-pointer"
                    >
                      <option value="all">All Modes</option>
                      <option value="remote">Remote / Global</option>
                      <option value="hybrid">Hybrid</option>
                      <option value="office">Office / Offline</option>
                    </select>
                  </div>

                  {/* Region */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-[#7C786E] uppercase tracking-wider">Region</label>
                    <select
                      value={regionFilter}
                      onChange={(e) => setRegionFilter(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#ECE9DF] text-xs text-[#1E1D1A] focus:outline-none focus:border-[#F5C451] transition-all cursor-pointer"
                    >
                      <option value="all">All Regions</option>
                      <option value="us">United States (US)</option>
                      <option value="uk">United Kingdom (UK)</option>
                      <option value="global">Global Remote</option>
                    </select>
                  </div>

                  {/* Role Domain */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-[#7C786E] uppercase tracking-wider">Role Domain</label>
                    <select
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#ECE9DF] text-xs text-[#1E1D1A] focus:outline-none focus:border-[#F5C451] transition-all cursor-pointer"
                    >
                      <option value="all">All Roles</option>
                      <option value="frontend">Frontend / UI / UX</option>
                      <option value="backend">Backend</option>
                      <option value="aiml">AI / ML / Python</option>
                    </select>
                  </div>
                </div>

                {/* Right side / Custom AI filter */}
                <div className="w-full lg:w-[380px] p-4 rounded-2xl bg-[#FAF9F5] border border-[#ECE9DF] space-y-2.5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-extrabold text-[#7A6218] uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#F5C451]" />
                        Custom AI Semantic Filter
                      </span>
                      {aiFilteredIds !== null && (
                        <button
                          onClick={handleClearAiFilter}
                          className="text-[9px] font-bold text-[#7C786E] hover:text-rose-600 cursor-pointer"
                        >
                          Clear Filter
                        </button>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customAiQuery}
                        onChange={(e) => setCustomAiQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAiFilter()}
                        placeholder="e.g. Stripe roles in California with score > 90..."
                        className="flex-1 px-3 py-2 rounded-xl bg-white border border-[#ECE9DF] text-xs text-[#1E1D1A] placeholder-[#7C786E]/50 focus:outline-none focus:border-[#F5C451]"
                      />
                      <button
                        onClick={handleAiFilter}
                        disabled={isAiFiltering}
                        className="px-4 py-2 bg-[#2C2B27] hover:bg-[#1E1D1A] text-white font-extrabold text-xs rounded-xl transition-all flex items-center gap-1 shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isAiFiltering ? "..." : "Filter"}
                      </button>
                    </div>
                  </div>
                  <p className="text-[9px] text-[#7C786E] leading-tight">
                    Type your custom requirements (e.g., tech, score or region) and let the AI process it.
                  </p>
                </div>
              </div>
            </div>
          )}

          {filteredMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredMatches.map((match) => (
                <div
                  key={match.id}
                  className="warm-card p-5 hover:border-[#F5C451] transition-all duration-300 flex flex-col justify-between group relative overflow-hidden bg-white"
                >
                  {/* Matching Indicator bar */}
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#F5C451]/40 to-[#2C2B27]/40" />

                  <div className="space-y-4">
                    {/* Header: Logo + Match % */}
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-base shadow-md ${match.logoBg}`}>
                          {match.logoText}
                        </div>
                        <div>
                          <h4 className="font-bold text-[#1E1D1A] text-sm tracking-tight leading-tight group-hover:text-[#7A6218] transition-colors duration-300">
                            {match.company}
                          </h4>
                          <span className="text-[10px] text-[#7C786E] flex items-center gap-1 mt-0.5 font-medium">
                            <MapPin className="w-3 h-3 text-[#7C786E]" />
                            {match.location}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[9px] text-[#7C786E] block uppercase font-bold tracking-wider">Fit Score</span>
                        <span className="text-[#7A6218] font-black text-sm">{match.matchScore}% Match</span>
                      </div>
                    </div>

                    {/* Role title */}
                    <p className="text-xs font-semibold text-[#1E1D1A] line-clamp-2 leading-relaxed">
                      {match.role}
                    </p>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-1.5">
                      {match.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-lg bg-[#FAF9F5] border border-[#ECE9DF] text-[9px] text-[#4E4B42] font-semibold"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2.5 mt-5 pt-4 border-t border-[#EFECE3]">
                    <button
                      onClick={() => handleAddToTracker(match)}
                      className="flex-1 py-2 px-3 rounded-xl bg-[#2C2B27] hover:bg-[#1E1D1A] text-white hover:text-[#F5C451] font-bold transition-all duration-300 flex items-center justify-center gap-1.5 text-xs cursor-pointer"
                    >
                      <FolderPlus className="w-3.5 h-3.5" />
                      Add to Tracker
                    </button>
                    <a
                      href={match.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-3 rounded-xl bg-white border border-[#ECE9DF] text-[#1E1D1A] hover:bg-[#FAF9F5] font-bold text-xs transition-colors flex items-center justify-center cursor-pointer shadow-sm"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            hasFetched && (
              <div className="warm-card p-8 text-center text-[#7C786E] bg-white rounded-2xl border border-[#ECE9DF] shadow-sm">
                <Check className="w-8 h-8 text-emerald-600 mx-auto mb-2 animate-bounce" />
                <p className="text-xs font-bold text-[#1E1D1A]">No matches fit current filter criteria.</p>
                <p className="text-[10px] text-[#7C786E] mt-1 max-w-xs mx-auto">
                  Try adjusting your filters, clearing your custom AI search, or clicking 'Fetch AI Matches' again to refresh.
                </p>
              </div>
            )
          )}
        </div>
      )}

      {/* Kanban Tracker Board */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-[#7C786E] uppercase tracking-widest flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-[#2C2B27]" />
            Application Stage Tracker
          </h3>
          <span className="text-[9px] text-[#7C786E] bg-white border border-[#ECE9DF] px-2 py-0.5 rounded-md font-semibold shadow-sm">
            Drag state using controls
          </span>
        </div>

        {/* Board Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {COLUMNS.map((column) => {
            const cardsInCol = trackerCards.filter((card) => card.column === column.id);

            return (
              <div
                key={column.id}
                className="warm-card p-4 flex flex-col h-[520px] bg-white"
                style={{
                  borderTopColor: column.id === "saved"
                    ? "#D4D4D8"
                    : column.id === "applied"
                    ? "#F5C451"
                    : column.id === "interviewing"
                    ? "#2C2B27"
                    : "#10B981",
                  borderTopWidth: "4px"
                }}
              >
                {/* Column Title Header */}
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#EFECE3]">
                  <span className={`text-xs font-bold uppercase tracking-wider ${
                    column.id === "saved"
                      ? "text-zinc-500"
                      : column.id === "applied"
                      ? "text-[#7A6218]"
                      : column.id === "interviewing"
                      ? "text-[#2C2B27]"
                      : "text-emerald-700"
                  }`}>
                    {column.title}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#FAF9F5] border border-[#ECE9DF] text-[10px] font-bold text-[#7C786E]">
                    {cardsInCol.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 scrollbar-none">
                  {cardsInCol.length > 0 ? (
                    cardsInCol.map((card) => (
                      <div
                        key={card.id}
                        className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#ECE9DF] hover:border-[#F5C451] hover:bg-white transition-all duration-300 relative group/card shadow-sm"
                      >
                        <div className="space-y-3">
                          {/* Logo & Close/Trash */}
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                              <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-white text-[10px] shadow-sm ${card.logoBg}`}>
                                {card.logoText}
                              </div>
                              <span className="font-bold text-[#1E1D1A] text-xs truncate max-w-[100px]">
                                {card.company}
                              </span>
                            </div>

                            <div className="flex items-center gap-1">
                              {card.applyUrl && (
                                <a
                                  href={card.applyUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#7C786E] hover:text-[#7A6218] p-1 rounded-md transition-colors cursor-pointer"
                                  title="Open Job Application"
                                >
                                  <ArrowUpRight className="w-3.5 h-3.5" />
                                </a>
                              )}
                              <button
                                onClick={() => handleRemoveCard(card.id)}
                                className="text-[#7C786E] hover:text-rose-600 p-1 rounded-md transition-colors cursor-pointer"
                                title="Remove card"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Role Title */}
                          <p className="text-[11px] font-semibold text-[#1E1D1A] leading-normal line-clamp-2">
                            {card.role}
                          </p>

                          {/* Location & Score */}
                          <div className="flex items-center justify-between text-[9px] text-[#7C786E] font-medium">
                            <span className="truncate max-w-[80px]">{card.location}</span>
                            <span className="text-[#7A6218] font-bold">{card.matchScore}% Match</span>
                          </div>

                          {/* Navigation / Transition buttons */}
                          <div className="flex items-center justify-between pt-2 border-t border-[#EFECE3] mt-1.5">
                            <button
                              onClick={() => handleMoveCard(card.id, "left")}
                              disabled={card.column === "saved"}
                              className={`p-1 rounded-md border border-[#ECE9DF] bg-white transition-all text-[#7C786E] hover:text-[#1E1D1A] cursor-pointer shadow-sm ${
                                card.column === "saved" ? "opacity-30 cursor-not-allowed" : "hover:bg-[#FAF9F5]"
                              }`}
                            >
                              <ChevronLeft className="w-3 h-3" />
                            </button>
                            <span className="text-[8px] text-[#7C786E] font-bold uppercase tracking-widest select-none">
                              Move
                            </span>
                            <button
                              onClick={() => handleMoveCard(card.id, "right")}
                              disabled={card.column === "rejected_offer"}
                              className={`p-1 rounded-md border border-[#ECE9DF] bg-white transition-all text-[#7C786E] hover:text-[#1E1D1A] cursor-pointer shadow-sm ${
                                card.column === "rejected_offer" ? "opacity-30 cursor-not-allowed" : "hover:bg-[#FAF9F5]"
                              }`}
                            >
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 border border-dashed border-[#ECE9DF] rounded-2xl text-[#7C786E] bg-white/40">
                      <Briefcase className="w-5 h-5 mb-1.5 opacity-30 text-[#7C786E]" />
                      <p className="text-[10px] font-bold text-[#1E1D1A] leading-relaxed">No roles at this stage.</p>
                      <p className="text-[9px] mt-0.5 max-w-[120px] leading-tight text-[#7C786E]">Drag or add roles here to begin tracking.</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Manual Add Internship Form */}
      <div className="warm-card p-8 bg-white border border-[#ECE9DF] rounded-3xl shadow-sm space-y-6">
        <div className="border-b border-[#EFECE3] pb-3">
          <h3 className="text-lg font-bold text-[#1E1D1A] flex items-center gap-2">
            <Plus className="w-5 h-5 text-[#7A6218]" />
            Register Completed or External Internship
          </h3>
          <p className="text-xs text-[#7C786E] mt-1">
            Keep track of internships completed outside our website to document them on your timeline and compile them into your resume.
          </p>
        </div>

        <form onSubmit={handleSubmitCustomInternship} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] text-[#7C786E] font-bold uppercase tracking-wider block">
                Company Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Notion"
                value={formCompany}
                onChange={(e) => setFormCompany(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#ECE9DF] focus:outline-none focus:border-[#7A6218] text-xs text-[#1E1D1A] placeholder-[#7C786E]/55 transition-colors shadow-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-[#7C786E] font-bold uppercase tracking-wider block">
                Role Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Software Engineer Intern"
                value={formRole}
                onChange={(e) => setFormRole(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#ECE9DF] focus:outline-none focus:border-[#7A6218] text-xs text-[#1E1D1A] placeholder-[#7C786E]/55 transition-colors shadow-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-[#7C786E] font-bold uppercase tracking-wider block">
                Location
              </label>
              <input
                type="text"
                placeholder="e.g. San Francisco, CA (Hybrid)"
                value={formLocation}
                onChange={(e) => setFormLocation(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#ECE9DF] focus:outline-none focus:border-[#7A6218] text-xs text-[#1E1D1A] placeholder-[#7C786E]/55 transition-colors shadow-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-[#7C786E] font-bold uppercase tracking-wider block">
                Apply Link / Website
              </label>
              <input
                type="url"
                placeholder="e.g. https://notion.so"
                value={formApplyLink}
                onChange={(e) => setFormApplyLink(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#ECE9DF] focus:outline-none focus:border-[#7A6218] text-xs text-[#1E1D1A] placeholder-[#7C786E]/55 transition-colors shadow-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-[#7C786E] font-bold uppercase tracking-wider block">
                Match Score (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                placeholder="e.g. 95"
                value={formMatchPercentage}
                onChange={(e) => setFormMatchPercentage(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#ECE9DF] focus:outline-none focus:border-[#7A6218] text-xs text-[#1E1D1A] placeholder-[#7C786E]/55 transition-colors shadow-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-[#7C786E] font-bold uppercase tracking-wider block">
                Application Stage
              </label>
              <select
                value={formStatus}
                onChange={(e: any) => setFormStatus(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#ECE9DF] focus:outline-none focus:border-[#7A6218] text-xs text-[#1E1D1A] transition-colors shadow-sm"
              >
                <option value="Saved">Saved</option>
                <option value="Applied">Applied</option>
                <option value="Interviewing">Interviewing</option>
                <option value="Decided">Decided / Offer</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-[#7C786E] font-bold uppercase tracking-wider block">
                Start Date
              </label>
              <input
                type="text"
                placeholder="e.g. June 2026"
                value={formStartDate}
                onChange={(e) => setFormStartDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#ECE9DF] focus:outline-none focus:border-[#7A6218] text-xs text-[#1E1D1A] placeholder-[#7C786E]/55 transition-colors shadow-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-[#7C786E] font-bold uppercase tracking-wider block">
                End Date (or 'Present')
              </label>
              <input
                type="text"
                placeholder="e.g. August 2026"
                value={formEndDate}
                onChange={(e) => setFormEndDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#ECE9DF] focus:outline-none focus:border-[#7A6218] text-xs text-[#1E1D1A] placeholder-[#7C786E]/55 transition-colors shadow-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-[#7C786E] font-bold uppercase tracking-wider block">
                Opportunity Type
              </label>
              <select
                value={formType}
                onChange={(e: any) => setFormType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#ECE9DF] focus:outline-none focus:border-[#7A6218] text-xs text-[#1E1D1A] transition-colors shadow-sm"
              >
                <option value="internship">Internship</option>
                <option value="fulltime">Full-Time Job</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] text-[#7C786E] font-bold uppercase tracking-wider block">
              Internship Description / Core Achievements
            </label>
            <textarea
              rows={3}
              placeholder="Describe what you built or accomplished. Highlight any major performance gains or scaling achievements (e.g. Optimized GraphQL queries reducing latencies by 30%)."
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#ECE9DF] focus:outline-none focus:border-[#7A6218] text-xs text-[#1E1D1A] placeholder-[#7C786E]/55 transition-colors resize-none shadow-sm"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#2C2B27] hover:bg-[#1E1D1A] text-white font-extrabold text-xs tracking-wider transition-all cursor-pointer shadow-md"
            >
              Add to Tracker
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
