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
  FolderPlus,
  X
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
  column: "saved" | "applied" | "rejected_offer";
  tags: string[];
  logoText: string;
  logoBg: string;
  applyUrl: string;
  createdAt?: string;
  endDate?: string;
}

const COLUMNS = [
  { id: "saved", title: "Saved", accent: "border-t-zinc-500/30 text-white" },
  { id: "applied", title: "Applied", accent: "border-t-pink-500/30 text-white" },
  { id: "rejected_offer", title: "Got Offer", accent: "border-t-emerald-500/30 text-white" }
] as const;

const CompanyLogo = ({
  company,
  applyUrl,
  logoBg,
  logoText,
  size = "md"
}: {
  company: string;
  applyUrl?: string;
  logoBg: string;
  logoText: string;
  size?: "sm" | "md";
}) => {
  const [imgFailed, setImgFailed] = useState(false);
  const domain = React.useMemo(() => {
    if (applyUrl) {
      try {
        const url = new URL(applyUrl);
        let hostname = url.hostname.toLowerCase();
        hostname = hostname.replace(/^www\./, "");
        const jobBoards = [
          "greenhouse.io",
          "lever.co",
          "myworkdayjobs.com",
          "github.com",
          "simplify.jobs",
          "jobs.ashbyhq.com",
          "ashbyhq.com",
          "jobvite.com",
          "bamboohr.com"
        ];
        if (!jobBoards.some(board => hostname.includes(board))) {
          return hostname;
        }
      } catch (e) {}
    }
    const cleanName = company
      .toLowerCase()
      .replace(/\s+tech(nology)?$/g, "")
      .replace(/\s+inc\.?$/g, "")
      .replace(/\s+corp(oration)?$/g, "")
      .replace(/\s+co\.?$/g, "")
      .replace(/\s+ltd\.?$/g, "")
      .replace(/[^a-z0-9]/g, "");
    return `${cleanName}.com`;
  }, [company, applyUrl]);

  const logoUrl = `https://logo.clearbit.com/${domain}`;

  const sizeClasses = size === "sm" ? "w-6.5 h-6.5 text-[9px]" : "w-10 h-10 text-base";

  if (imgFailed) {
    return (
      <div className={`rounded-full flex items-center justify-center font-bold text-gray-600 bg-gray-200 border border-gray-300 shrink-0 ${sizeClasses}`}>
        {logoText}
      </div>
    );
  }

  return (
    <div className={`rounded-full flex items-center justify-center font-bold text-gray-600 shadow-sm overflow-hidden bg-gray-200 border border-gray-300 shrink-0 ${sizeClasses}`}>
      <img
        src={logoUrl}
        alt={`${company} Logo`}
        className="w-full h-full object-contain p-0.5 rounded-full"
        onError={() => setImgFailed(true)}
      />
    </div>
  );
};


const getDynamicMatchScore = (role: string, company: string, location: string) => {
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

  const searchStr = `${role} ${company}`.toLowerCase();
  let matches = 0;

  for (const tech of userTechStack) {
    const term = tech.toLowerCase();
    if (searchStr.includes(term)) {
      matches++;
      continue;
    }

    // Synonym / Concept matching
    if (term === 'react' || term === 'nextjs' || term === 'typescript' || term === 'javascript') {
      if (searchStr.includes('frontend') || searchStr.includes('web') || searchStr.includes('ui') || searchStr.includes('fullstack') || searchStr.includes('intern')) {
        matches += 0.8;
      }
    } else if (term === 'node' || term === 'nodejs' || term === 'express' || term === 'mongodb' || term === 'sql') {
      if (searchStr.includes('backend') || searchStr.includes('api') || searchStr.includes('fullstack') || searchStr.includes('database')) {
        matches += 0.8;
      }
    } else if (term === 'python' || term === 'pytorch' || term === 'tensorflow' || term === 'ml' || term === 'ai') {
      if (searchStr.includes('machine learning') || searchStr.includes('data') || searchStr.includes('intelligence') || searchStr.includes('scientist')) {
        matches += 0.8;
      }
    }
  }

  // Base score 40, dynamic component up to 50
  let score = 40 + Math.round((matches / Math.max(userTechStack.length, 1)) * 50);

  // Region based fit scoring (up to 10 points boost)
  let regionBoost = 0;
  const locLower = (location || '').toLowerCase();
  if (userCountry) {
    const countryLower = userCountry.toLowerCase();
    if (locLower.includes(countryLower)) {
      regionBoost += 5;
    }
  }
  if (userState) {
    const stateLower = userState.toLowerCase();
    if (locLower.includes(stateLower)) {
      regionBoost += 5;
    }
  }
  if (locLower.includes('remote') || locLower.includes('global')) {
    regionBoost += 4;
  }
  
  score += regionBoost;
  return Math.min(score, 100);
};

const getDeadline = (card: TrackerCard) => {
  if (card.endDate && card.endDate.trim() !== "") {
    return card.endDate;
  }
  if (card.createdAt) {
    const createdDate = new Date(card.createdAt);
    const deadlineDate = new Date(createdDate.getTime() + 30 * 24 * 60 * 60 * 1000);
    return deadlineDate.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  }
  return "TBD";
};

export default function InternshipRadar() {
  const [isFetching, setIsFetching] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fetchProgress, setFetchProgress] = useState(0);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);
  const [matches, setMatches] = useState<Match[]>([]);
  const [trackerCards, setTrackerCards] = useState<TrackerCard[]>([]);
  const [hasFetched, setHasFetched] = useState(false);
  const [fetchedData, setFetchedData] = useState<Match[] | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

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
  const [formStatus, setFormStatus] = useState<"Saved" | "Applied" | "Decided">("Saved");
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
            
            let columnId: "saved" | "applied" | "rejected_offer" = "saved";
            const s = item.status.toLowerCase();
            if (s === "applied" || s === "interviewing") columnId = "applied";
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
              tags: item.description ? [item.description.substring(0, 15)] : [],
              logoText: firstChar,
              logoBg: logoColors[colorHash],
              applyUrl: item.applyLink || "",
              createdAt: item.createdAt,
              endDate: item.endDate || ""
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
          setFetchedData([]);
        }
      })
      .catch((err) => {
        console.error("Scraper fetch error:", err);
        setFetchedData([]);
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
            setMatches(fetchedData || []);
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
          applyUrl: match.applyUrl,
          createdAt: data.internship.createdAt
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
    const columnsOrder: ("saved" | "applied" | "rejected_offer")[] = [
      "saved",
      "applied",
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

    let dbStatus: "Saved" | "Applied" | "Decided" = "Saved";
    if (nextColumn === "applied") dbStatus = "Applied";
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
        
        let columnId: "saved" | "applied" | "rejected_offer" = "saved";
        if (formStatus === "Applied") columnId = "applied";
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
          tags: formDescription ? [formDescription.substring(0, 15)] : [],
          logoText: firstChar,
          logoBg: logoColors[colorHash],
          applyUrl: formApplyLink,
          createdAt: data.internship.createdAt,
          endDate: formEndDate
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
        setIsModalOpen(false);
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
      const res = await fetch("/api/ai/filterInternships", {
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

      {/* Tabs Switcher */}
      <div className="flex border-b border-[#FDF2F8] gap-6 mb-4">
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
      <div className="warm-card p-4 relative overflow-hidden bg-white">
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-50 h-50 bg-[#ec4899]/5 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-center md:text-left">
            <h2 className="text-lg uppercase font-bold text-[#1E1D1A] tracking-tight flex items-center justify-center md:justify-start gap-2">
              Real time AI {activeTab === "fulltime" ? "Job" : "Internship"} Fetcher
            </h2>
          </div>

          <button
            onClick={handleFetchMatches}
            disabled={isFetching}
            className={`relative py-3 px-8 rounded-2xl font-extrabold text-sm tracking-wide transition-all duration-500 group shadow-sm ${
              isFetching
                ? "bg-[#E5E2D6] text-[#7C786E] border border-[#FCE7F3] cursor-not-allowed"
                : "bg-[#2C2B27] text-white hover:bg-[#1E1D1A] cursor-pointer"
            }`}
          >
            {isFetching ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-[#ec4899]" />
                Scraping Dev Portals...
              </span>
            ) : (
              <span className="flex uppercase items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#ec4899] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                Fetch Internships
              </span>
            )}
          </button>
        </div>

        {/* Live Scraper Terminal Log animation */}
        {isFetching && (
          <div className="mt-6 rounded-2xl bg-zinc-950 border border-zinc-800 p-5 space-y-4 font-mono text-[11px] text-zinc-300 shadow-2xl relative overflow-hidden">
            <style>{`
              @keyframes blink {
                50% { opacity: 0; }
              }
              .terminal-cursor {
                animation: blink 1s step-start infinite;
              }
            `}</style>

            {/* Header: OS window style controls */}
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 mr-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <div className="flex items-center gap-2 text-zinc-400">
                  <Terminal className="w-3.5 h-3.5 text-zinc-500" />
                  <span className="text-[10px] text-zinc-400 tracking-wider">pinkypow@scraper:~</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-[9px] bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-md text-emerald-400 font-bold animate-pulse">
                  Scanning: {companiesToScan[currentSearchIndex]}
                </span>
                <span className="text-zinc-500 font-bold">{Math.round(fetchProgress)}%</span>
              </div>
            </div>
            
            {/* Progress bar (glowing design) */}
            <div className="relative w-full bg-zinc-900 h-2.5 rounded-full overflow-hidden border border-zinc-800/80">
              <div
                className="bg-gradient-to-r from-emerald-500 via-teal-400 to-[#ec4899] h-full transition-all duration-300 relative rounded-full shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                style={{ width: `${fetchProgress}%` }}
              />
            </div>

            {/* Active Logs Console */}
            <div className="space-y-2 max-h-40 overflow-y-auto pt-2 pr-2 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
              {terminalLogs.map((log, idx) => {
                let logColor = "text-zinc-400";
                let logIcon = "⚡";
                const lowerLog = log.toLowerCase();
                
                if (lowerLog.includes("complete") || lowerLog.includes("synced")) {
                  logColor = "text-emerald-400 font-bold";
                  logIcon = "✓";
                } else if (lowerLog.includes("scraping") || lowerLog.includes("scan")) {
                  logColor = "text-cyan-400";
                  logIcon = "🔍";
                } else if (lowerLog.includes("calibrating") || lowerLog.includes("vector")) {
                  logColor = "text-indigo-400";
                  logIcon = "🔮";
                } else if (lowerLog.includes("initializing") || lowerLog.includes("node")) {
                  logColor = "text-amber-400";
                  logIcon = "⚙️";
                }
                
                return (
                  <div key={idx} className={`flex items-start gap-3 leading-relaxed ${logColor}`}>
                    <span className="shrink-0 select-none opacity-80">{logIcon}</span>
                    <span className="break-all">{log}</span>
                  </div>
                );
              })}
              
              {/* Active prompt with cursor */}
              <div className="flex items-center gap-2 text-zinc-500 pt-1.5 border-t border-zinc-900/60 mt-1">
                <span className="text-zinc-600 select-none">$</span>
                <span className="text-zinc-400">awaiting response...</span>
                <span className="w-1.5 h-3 bg-[#ec4899] terminal-cursor" />
              </div>
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
          </div>          {/* FILTERS PANEL */}
          {matches.length > 0 && (
            <div className="warm-card p-6 bg-white space-y-6 border border-zinc-200 rounded-2xl shadow-sm">
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-100 border border-zinc-200 text-xs text-[#1E1D1A] placeholder-[#7C786E]/60 focus:outline-none focus:border-zinc-500 transition-all"
                    />
                  </div>

                  {/* Work Mode */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-[#7C786E] uppercase tracking-wider">Work Mode</label>
                    <select
                      value={workModeFilter}
                      onChange={(e) => setWorkModeFilter(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-100 border border-zinc-200 text-xs text-[#1E1D1A] focus:outline-none focus:border-zinc-500 transition-all cursor-pointer"
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-100 border border-zinc-200 text-xs text-[#1E1D1A] focus:outline-none focus:border-zinc-500 transition-all cursor-pointer"
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-100 border border-zinc-200 text-xs text-[#1E1D1A] focus:outline-none focus:border-zinc-500 transition-all cursor-pointer"
                    >
                      <option value="all">All Roles</option>
                      <option value="frontend">Frontend / UI / UX</option>
                      <option value="backend">Backend</option>
                      <option value="aiml">AI / ML / Python</option>
                    </select>
                  </div>
                </div>

                {/* Right side / Custom AI filter */}
                <div className="w-full lg:w-[380px] p-4 rounded-2xl bg-zinc-100 border border-zinc-200 space-y-2.5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-extrabold text-zinc-700 uppercase tracking-wider flex items-center gap-1.5">
                        Custom AI Semantic Filter
                      </span>
                      {aiFilteredIds !== null && (
                        <button
                          onClick={handleClearAiFilter}
                          className="text-[9px] uppercase font-bold text-[#7C786E] hover:text-rose-600 cursor-pointer"
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
                        className="flex-1 px-3 py-2 rounded-xl bg-white border border-zinc-200 text-xs text-[#1E1D1A] placeholder-[#7C786E]/50 focus:outline-none focus:border-zinc-500"
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
                </div>
              </div>
            </div>
          )}

          {filteredMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredMatches.map((match) => (
                <div
                  key={match.id}
                  className="warm-card p-5 hover:border-zinc-300 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden bg-white hover:shadow-md"
                >
                  <div className="space-y-4">
                    {/* Header: Logo + Match % */}
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <CompanyLogo
                          company={match.company}
                          applyUrl={match.applyUrl}
                          logoBg={match.logoBg}
                          logoText={match.logoText}
                        />
                        <div>
                          <h4 className="font-bold text-[#1E1D1A] text-sm tracking-tight leading-tight group-hover:text-[#be185d] transition-colors duration-300">
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
                        <span className="text-[#be185d] font-black text-sm">{match.matchScore}% Match</span>
                      </div>
                    </div>

                     {/* Role title */}
                     <div>
                       <p className="text-xs font-semibold text-[#1E1D1A] line-clamp-2 leading-relaxed">
                         {match.role}
                       </p>
                       <div className="mt-2 space-y-0.5">
                         <div className="text-[10px] text-[#7C786E] flex items-center gap-1">
                           <span className="font-semibold">Deadline:</span>
                           <span className="font-bold text-[#1E1D1A]">Apply Soon</span>
                         </div>
                         <div className="text-[10px] text-[#7C786E] flex items-center gap-1.5">
                           <span>Match Score:</span>
                           <span className="font-extrabold text-zinc-900">{match.matchScore}% Match</span>
                         </div>
                       </div>
                     </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2.5 mt-5 pt-4 border-t border-[#FDF2F8]">
                    <button
                      onClick={() => handleAddToTracker(match)}
                      className="flex-1 py-2 px-3 rounded-xl bg-[#2C2B27] hover:bg-[#1E1D1A] text-white hover:text-[#ec4899] font-bold transition-all duration-300 flex items-center justify-center gap-1.5 text-xs cursor-pointer"
                    >
                      <FolderPlus className="w-3.5 h-3.5" />
                      Add to Tracker
                    </button>
                    <a
                      href={match.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-3 rounded-xl bg-white border border-gray-200 text-[#1E1D1A] hover:bg-gray-100 font-bold text-xs transition-colors flex items-center justify-center cursor-pointer shadow-sm"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            hasFetched && (
              <div className="warm-card p-8 text-center text-[#7C786E] bg-white rounded-2xl border border-gray-200 shadow-sm">
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
          <h3 className="text-sm font-bold text-[#7C786E] uppercase tracking-widest flex items-center gap-2">
            Application Stage Tracker
          </h3>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center uppercase gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#2C2B27] hover:bg-[#1E1D1A] text-white font-bold text-sm shadow-sm cursor-pointer transition-all active:scale-95 shrink-0"
            >
              <FolderPlus className="w-3.5 h-3.5" />
              Add Internship
            </button>
          </div>
        </div>

        {/* Board Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {COLUMNS.map((column) => {
            const cardsInCol = trackerCards.filter((card) => card.column === column.id);

            // Styling variables for column headers matching reference
            let headerBg = "bg-[#FAF9F6] text-[#1E1D1A]";
            let dotColor = "bg-zinc-500";
            if (column.id === "saved") {
              dotColor = "bg-[#7C786E]";
            } else if (column.id === "applied") {
              dotColor = "bg-[#084298]";
            } else if (column.id === "rejected_offer") {
              dotColor = "bg-[#10B981]";
            }

            return (
              <div
                key={column.id}
                className="flex flex-col h-[580px] bg-[#FAF9F6] rounded-3xl p-3 border border-[#FDF2F8]/60 shadow-sm"
              >
                {/* Column Title Header (Reference Style) */}
                <div className="flex justify-between items-center mb-3 px-1">
                  <div className="flex items-center gap-1.5">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-extrabold tracking-wide ${headerBg}`}>
                      <span className={`w-2 h-2 rounded-full ${dotColor} opacity-75`} />
                      {column.title.toUpperCase()}
                      <span className="opacity-60 font-medium">|</span>
                      <span className="font-black">{cardsInCol.length}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      setFormStatus(
                        column.id === "saved"
                          ? "Saved"
                          : column.id === "applied"
                          ? "Applied"
                          : "Decided"
                      );
                      setIsModalOpen(true);
                    }}
                    className="p-1.5 hover:bg-[#FDF2F8] text-[#7C786E] hover:text-[#1E1D1A] rounded-lg transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Cards Container */}
                <div className="flex-1 flex flex-col overflow-y-auto space-y-3 pr-0.5 scrollbar-none py-1">
                  {cardsInCol.length > 0 ? (
                    cardsInCol.map((card, idx) => {
                      // Calculate dynamic match score based on other user details
                      const dynamicScore = getDynamicMatchScore(card.role, card.company, card.location);

                      let matchBadgeColor = "bg-purple-100 text-purple-700 border-purple-200/50";


                      return (
                        <div
                          key={card.id}
                          className="p-4 rounded-2xl bg-white border border-[#FDF2F8] hover:border-zinc-300 hover:shadow-md transition-all duration-300 relative group/card shadow-sm"
                        >
                          <div className="space-y-3">
                            {/* Card Top: Avatar, Name, timestamp, ... */}
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <CompanyLogo
                                  company={card.company}
                                  applyUrl={card.applyUrl}
                                  logoBg={card.logoBg}
                                  logoText={card.logoText}
                                  size="sm"
                                />
                                <span className="font-extrabold text-[#1E1D1A] text-xs truncate max-w-[100px]">
                                  {card.company}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <span className="text-[9px] text-[#7C786E] font-semibold opacity-70">
                                  {card.createdAt ? new Date(card.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : ""}
                                </span>
                              </div>
                            </div>

                            {/* Card Body: Role Title */}
                            <div>
                              <p className="text-[12px] font-bold text-[#1E1D1A] leading-snug">
                                {card.role}
                              </p>
                              <div className="mt-1 space-y-0.5">
                                <div className="text-[10px] text-[#7C786E] flex items-center gap-1">
                                  <span className="font-semibold">Deadline:</span>
                                  <span className="font-bold text-[#1E1D1A]">{getDeadline(card)}</span>
                                </div>
                                <div className="text-[10px] text-[#7C786E] flex items-center gap-1.5 flex-wrap">
                                  <span>Match Score:</span>
                                  <span className="font-extrabold text-zinc-900 mr-1">{dynamicScore}% Match</span>
                                </div>
                              </div>
                            </div>



                            {/* Apply Link box if exists (Nice gray & black button, no emoji) */}
                            {card.applyUrl && (
                              <a
                                href={card.applyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#ec4899] text-white  border border-zinc-200 hover:border-zinc-900 transition-all text-[10px] font-extrabold"
                              >
                                <span className="truncate text-pink-100 uppercase">Apply Link</span>
                                <ArrowUpRight className="w-3.5 h-3.5 text-amber-50" />
                              </a>
                            )}

                            {/* Card Footer: Navigation Controls */}
                            <div className="flex items-center justify-between pt-2 border-t border-[#FDF2F8]/60 mt-1">
                              <button
                                onClick={() => handleMoveCard(card.id, "left")}
                                disabled={card.column === "saved"}
                                className={`p-1 rounded-lg border border-[#FDF2F8] bg-white transition-all text-[#7C786E] hover:text-[#1E1D1A] cursor-pointer shadow-sm ${
                                  card.column === "saved" ? "opacity-30 cursor-not-allowed" : "hover:bg-[#FFF5F7]"
                                }`}
                              >
                                <ChevronLeft className="w-3.5 h-3.5" />
                              </button>
                              
                              <button
                                onClick={() => setDeleteTargetId(card.id)}
                                className="text-[9px] text-[#7C786E] hover:text-rose-600 font-extrabold tracking-wider transition-colors cursor-pointer"
                              >
                                REMOVE
                              </button>

                              <button
                                onClick={() => handleMoveCard(card.id, "right")}
                                disabled={card.column === "rejected_offer"}
                                className={`p-1 rounded-lg border border-[#FDF2F8] bg-white transition-all text-[#7C786E] hover:text-[#1E1D1A] cursor-pointer shadow-sm ${
                                  card.column === "rejected_offer" ? "opacity-30 cursor-not-allowed" : "hover:bg-[#FFF5F7]"
                                }`}
                              >
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex-1 min-h-[250px] flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-[#FDF2F8] rounded-3xl text-[#7C786E] bg-white/50 hover:bg-white/80 hover:border-[#ec4899]/50 transition-all duration-300 shadow-sm select-none">
                      <Briefcase className="w-8 h-8 mb-3 text-[#7C786E]/40 stroke-[1.5]" />
                      <p className="text-xs uppercase font-extrabold text-[#1E1D1A] tracking-wider">Empty Stage</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal / Popup Card */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.6)] backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#FCE7F3] rounded-3xl shadow-xl w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#FDF2F8] px-8 py-5">
              <div>
                <h3 className="text-lg uppercase font-bold text-[#1E1D1A] flex items-center gap-2">
                  Register Completed or External Internship
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-[#FFF5F7] text-[#7C786E] hover:text-[#1E1D1A] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmitCustomInternship} className="p-8 space-y-6 max-h-[85vh] overflow-y-auto">
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
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-100 border border-gray-200 focus:outline-none focus:border-[#be185d] text-xs text-[#1E1D1A] placeholder-[#7C786E]/55 transition-colors shadow-sm"
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
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-100 border border-gray-200 focus:outline-none focus:border-[#be185d] text-xs text-[#1E1D1A] placeholder-[#7C786E]/55 transition-colors shadow-sm"
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
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-100 border border-gray-200 focus:outline-none focus:border-[#be185d] text-xs text-[#1E1D1A] placeholder-[#7C786E]/55 transition-colors shadow-sm"
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
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-100 border border-gray-200 focus:outline-none focus:border-[#be185d] text-xs text-[#1E1D1A] placeholder-[#7C786E]/55 transition-colors shadow-sm"
                  />
                </div>


                <div className="space-y-1.5">
                  <label className="text-[10px] text-[#7C786E] font-bold uppercase tracking-wider block">
                    Application Stage
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e: any) => setFormStatus(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-100 border border-gray-200 focus:outline-none focus:border-[#be185d] text-xs text-[#1E1D1A] transition-colors shadow-sm"
                  >
                    <option value="Saved">Saved</option>
                    <option value="Applied">Applied</option>
                    <option value="Decided">Got Offer</option>
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
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-100 border border-gray-200 focus:outline-none focus:border-[#be185d] text-xs text-[#1E1D1A] placeholder-[#7C786E]/55 transition-colors shadow-sm"
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
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-100 border border-[#FCE7F3] focus:outline-none focus:border-[#be185d] text-xs text-[#1E1D1A] placeholder-[#7C786E]/55 transition-colors shadow-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-[#7C786E] font-bold uppercase tracking-wider block">
                    Opportunity Type
                  </label>
                  <select
                    value={formType}
                    onChange={(e: any) => setFormType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-100 border border-gray-200 focus:outline-none focus:border-[#be185d] text-xs text-[#1E1D1A] transition-colors shadow-sm"
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
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-100 border border-gray-200 focus:outline-none focus:border-[#be185d] text-xs text-[#1E1D1A] placeholder-[#7C786E]/55 transition-colors resize-none shadow-sm"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-[#FCE7F3] bg-white text-[#1E1D1A] font-bold text-xs tracking-wider transition-all cursor-pointer shadow-sm hover:bg-[#FFF5F7]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#2C2B27] hover:bg-[#1E1D1A] text-white font-extrabold text-xs tracking-wider transition-all cursor-pointer shadow-md"
                >
                  Add to Tracker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {deleteTargetId && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.6)] backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#FCE7F3] rounded-3xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 p-6 space-y-4">
            <h3 className="text-base font-bold text-[#1E1D1A]">Delete Tracker Card</h3>
            <p className="text-xs text-[#7C786E]">
              Are you sure you want to remove this internship from your application stage tracker? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTargetId(null)}
                className="px-5 py-2.5 rounded-xl border border-[#FCE7F3] bg-white text-[#1E1D1A] font-bold text-xs tracking-wider transition-all cursor-pointer shadow-sm hover:bg-[#FFF5F7]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  await handleRemoveCard(deleteTargetId);
                  setDeleteTargetId(null);
                }}
                className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs tracking-wider transition-all cursor-pointer shadow-md rounded-xl"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
