"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Trophy,
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
  X,
  Calendar,
  DollarSign
} from "lucide-react";

interface HackathonEvent {
  id: string;
  title: string;
  hosts: string;
  date: string;
  location: string;
  isOnline: boolean;
  isNearMe: boolean;
  isMatched: boolean;
  prizePool: string;
  bannerGradient?: string;
  category: string;
  description: string;
  skills: string[];
  participants?: number;
  timelineState?: "team_formation" | "registration" | "submission" | "judging";
  deadline: string;
  url: string;
  fitScore?: number;
}

interface TrackerCard {
  id: string;
  title: string;
  hosts: string;
  location: string;
  prizePool: string;
  category: string;
  description: string;
  skills: string[];
  status: "Saved" | "Applied" | "Participated" | "Shortlisted" | "Won";
  column: "saved" | "applied" | "won_participated";
  logoText: string;
  logoBg: string;
  applyLink: string;
  date?: string;
  createdAt?: string;
  shortlistedRounds?: number;
}

const COLUMNS = [
  { id: "saved", title: "Saved", accent: "border-t-zinc-500/30 text-white" },
  { id: "applied", title: "Applied", accent: "border-t-pink-500/30 text-white" },
  { id: "won_participated", title: "Won / Participated", accent: "border-t-emerald-500/30 text-white" }
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
          "bamboohr.com",
          "devpost.com",
          "devfolio.co",
          "mlh.io"
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

const getDynamicMatchScore = (title: string, hosts: string, skills: string[]) => {
  let userTechStack = ["React", "TypeScript", "Node.js", "Python", "Next.js", "AI", "ML"];
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("currentUser");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.techStack && parsed.techStack.length > 0) {
          userTechStack = parsed.techStack;
        }
      } catch (e) {
        console.error(e);
      }
    }
  }

  const searchStr = `${title} ${hosts} ${(skills || []).join(" ")}`.toLowerCase();
  let matches = 0;

  for (const tech of userTechStack) {
    const term = tech.toLowerCase();
    if (searchStr.includes(term)) {
      matches++;
    }
  }

  // Base score 40, dynamic component up to 60
  let score = 40 + Math.round((matches / Math.max(userTechStack.length, 1)) * 60);
  return Math.min(score, 100);
};

const getDeadline = (card: TrackerCard) => {
  if (card.date && card.date.trim() !== "") {
    return card.date;
  }
  if (card.createdAt) {
    const createdDate = new Date(card.createdAt);
    const deadlineDate = new Date(createdDate.getTime() + 14 * 24 * 60 * 60 * 1000);
    return deadlineDate.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  }
  return "TBD";
};

export default function HackathonRadar() {
  const [isFetching, setIsFetching] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fetchProgress, setFetchProgress] = useState(0);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);
  const [matches, setMatches] = useState<HackathonEvent[]>([]);
  const [trackerCards, setTrackerCards] = useState<TrackerCard[]>([]);
  const [hasFetched, setHasFetched] = useState(false);
  const [fetchedData, setFetchedData] = useState<HackathonEvent[] | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [workModeFilter, setWorkModeFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [customAiQuery, setCustomAiQuery] = useState("");
  const [aiFilteredIds, setAiFilteredIds] = useState<string[] | null>(null);
  const [isAiFiltering, setIsAiFiltering] = useState(false);

  // Custom Manual Addition Form State
  const [username, setUsername] = useState<string>("Najla1208");
  const [formTitle, setFormTitle] = useState("");
  const [formHosts, setFormHosts] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formPrizePool, setFormPrizePool] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formSkills, setFormSkills] = useState("");
  const [formStatus, setFormStatus] = useState<"Saved" | "Applied" | "Participated" | "Shortlisted" | "Won">("Saved");
  const [formApplyLink, setFormApplyLink] = useState("");
  const [formIsOnline, setFormIsOnline] = useState(false);

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

  const fetchHackathonsFromDb = async () => {
    try {
      const res = await fetch(`/api/hackathons?username=${username}`);
      const data = await res.json();
      if (data.success && data.hackathons) {
        const mapped: TrackerCard[] = data.hackathons.map((item: any) => {
          const logoColors = [
            "bg-gradient-to-tr from-indigo-500 to-purple-600",
            "bg-gradient-to-tr from-emerald-500 to-teal-600",
            "bg-gradient-to-tr from-orange-500 via-rose-500 to-purple-500",
            "bg-gradient-to-tr from-zinc-800 to-zinc-950 border border-white/10",
            "bg-gradient-to-tr from-blue-500 to-indigo-600",
            "bg-gradient-to-tr from-red-600 to-red-800",
            "bg-gradient-to-tr from-zinc-600 to-zinc-800"
          ];
          
          let columnId: "saved" | "applied" | "won_participated" = "saved";
          const s = item.status.toLowerCase();
          if (s === "applied" || s === "shortlisted") columnId = "applied";
          else if (s === "participated" || s === "won" || s === "decided") columnId = "won_participated";
          
          const firstChar = item.hosts ? item.hosts.charAt(0).toUpperCase() : "H";
          const colorHash = item.hosts ? item.hosts.charCodeAt(0) % logoColors.length : 0;

          return {
            id: item._id,
            title: item.title,
            hosts: item.hosts || "Unknown Host",
            location: item.location || "Remote",
            prizePool: item.prizePool || "TBD",
            category: item.category || "General",
            description: item.description || "",
            skills: item.skills || [],
            status: item.status || "Saved",
            column: columnId,
            logoText: firstChar,
            logoBg: logoColors[colorHash],
            applyLink: item.applyLink || "",
            date: item.date,
            createdAt: item.createdAt,
            shortlistedRounds: item.shortlistedRounds || 0
          };
        });
        setTrackerCards(mapped);
      }
    } catch (err) {
      console.error("Error loading hackathons:", err);
    }
  };

  useEffect(() => {
    fetchHackathonsFromDb();
  }, [username]);

  const companiesToScan = ["Devpost API Node", "MLH Seasons Node", "Devfolio Portals", "HackerEarth Scraper", "GitHub Seeds"];

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

    fetch("/api/scrape/hackathons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        techStack: userTechStack,
        search: searchQuery,
        collegeCountry: userCountry,
        collegeState: userState
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.hackathons) {
          const mapped: HackathonEvent[] = data.hackathons.map((h: any, idx: number) => ({
            id: h.id || `scraped-${idx}-${Date.now()}`,
            title: h.title,
            hosts: h.location.toLowerCase().includes("online") ? "Devpost Global" : h.location,
            date: h.date || "TBD",
            location: h.location || "Online",
            isOnline: h.isOnline || h.location.toLowerCase().includes("online"),
            isNearMe: !h.isOnline && idx % 3 === 0,
            isMatched: h.skills.some((s: string) => ["react", "next.js", "typescript", "python", "machine learning", "ai"].includes(s.toLowerCase())),
            prizePool: h.prizePool || "$10,000",
            category: h.category || "General",
            description: h.description || `${h.title} hackathon. Focuses on ${(h.skills || []).join(", ")}.`,
            skills: (h.skills || []).slice(0, 4),
            deadline: h.deadline || "Apply Soon",
            url: h.url || "https://devpost.com/hackathons",
            fitScore: h.fitScore || getDynamicMatchScore(h.title, h.location, h.skills)
          }));
          setFetchedData(mapped);
        } else {
          setFetchedData([]);
        }
      })
      .catch((err) => {
        console.error("Hackathon scraper fetch error:", err);
        setFetchedData([]);
      });
  };

  // Simulating the scraping log flow
  useEffect(() => {
    if (!isFetching) return;

    const logMessages = [
      "Initializing Devpost scraper nodes...",
      "Calibrating geolocation parameters...",
      "Fetching open-application hackathon listings...",
      "Checking application deadlines & parameters...",
      "Extracting prize amounts and currencies...",
      "Matching hackathon themes against profile skills...",
      "Scrape complete! Synced active Devpost hackathons."
    ];

    const interval = setInterval(() => {
      setFetchProgress((prev) => {
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
  const handleAddToTracker = async (match: HackathonEvent) => {
    if (trackerCards.some((c) => c.title === match.title)) return;

    try {
      const res = await fetch("/api/hackathons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          title: match.title,
          hosts: match.hosts,
          date: match.date,
          location: match.location,
          isOnline: match.isOnline,
          prizePool: match.prizePool,
          category: match.category,
          description: match.description,
          skills: match.skills,
          status: "Saved",
          applyLink: match.url
        })
      });
      const data = await res.json();
      if (data.success && data.hackathon) {
        const logoColors = [
          "bg-gradient-to-tr from-indigo-500 to-purple-600",
          "bg-gradient-to-tr from-emerald-500 to-teal-600",
          "bg-gradient-to-tr from-orange-500 via-rose-500 to-purple-500",
          "bg-gradient-to-tr from-zinc-800 to-zinc-950 border border-white/10",
          "bg-gradient-to-tr from-blue-500 to-indigo-600",
          "bg-gradient-to-tr from-red-600 to-red-800",
          "bg-gradient-to-tr from-zinc-600 to-zinc-800"
        ];
        const firstChar = match.hosts ? match.hosts.charAt(0).toUpperCase() : "H";
        const colorHash = match.hosts ? match.hosts.charCodeAt(0) % logoColors.length : 0;

        const newCard: TrackerCard = {
          id: data.hackathon._id,
          title: match.title,
          hosts: match.hosts,
          location: match.location,
          prizePool: match.prizePool,
          category: match.category,
          description: match.description,
          skills: match.skills,
          status: "Saved",
          column: "saved",
          logoText: firstChar,
          logoBg: logoColors[colorHash],
          applyLink: match.url,
          createdAt: data.hackathon.createdAt,
          date: match.date
        };
        setTrackerCards((prev) => [newCard, ...prev]);
        setMatches((prev) => prev.filter((m) => m.id !== match.id));
      }
    } catch (err) {
      console.error("Error adding hackathon to tracker:", err);
    }
  };

  // Move Tracker Card Column
  const handleMoveCard = async (cardId: string, direction: "left" | "right") => {
    const columnsOrder: ("saved" | "applied" | "won_participated")[] = [
      "saved",
      "applied",
      "won_participated"
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

    let dbStatus: "Saved" | "Applied" | "Participated" | "Shortlisted" | "Won" = "Saved";
    if (nextColumn === "applied") dbStatus = "Applied";
    else if (nextColumn === "won_participated") dbStatus = "Participated";

    try {
      const res = await fetch("/api/hackathons", {
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
          prev.map((c) => (c.id === cardId ? { ...c, column: nextColumn, status: dbStatus } : c))
        );
      }
    } catch (err) {
      console.error("Error updating hackathon card column:", err);
    }
  };

  // Remove Card
  const handleRemoveCard = async (cardId: string) => {
    try {
      const res = await fetch(`/api/hackathons?id=${cardId}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        setTrackerCards((prev) => prev.filter((card) => card.id !== cardId));
      }
    } catch (err) {
      console.error("Error deleting hackathon card:", err);
    }
  };

  // Add custom manual hackathon
  const handleSubmitCustomHackathon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formHosts) return;

    try {
      const res = await fetch("/api/hackathons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          title: formTitle,
          hosts: formHosts,
          status: formStatus,
          location: formLocation || (formIsOnline ? "Online" : "Remote"),
          isOnline: formIsOnline,
          prizePool: formPrizePool || "TBD",
          category: formCategory || "General",
          description: formDescription,
          skills: formSkills ? formSkills.split(",").map(s => s.trim()).filter(Boolean) : [],
          applyLink: formApplyLink,
          date: formDate
        })
      });
      const data = await res.json();
      if (data.success && data.hackathon) {
        const logoColors = [
          "bg-gradient-to-tr from-indigo-500 to-purple-600",
          "bg-gradient-to-tr from-emerald-500 to-teal-600",
          "bg-gradient-to-tr from-orange-500 via-rose-500 to-purple-500",
          "bg-gradient-to-tr from-zinc-800 to-zinc-950 border border-white/10",
          "bg-gradient-to-tr from-blue-500 to-indigo-600",
          "bg-gradient-to-tr from-red-600 to-red-800",
          "bg-gradient-to-tr from-zinc-600 to-zinc-800"
        ];
        
        let columnId: "saved" | "applied" | "won_participated" = "saved";
        if (formStatus === "Applied" || formStatus === "Shortlisted") columnId = "applied";
        else if (formStatus === "Participated" || formStatus === "Won") columnId = "won_participated";

        const firstChar = formHosts.charAt(0).toUpperCase();
        const colorHash = formHosts.charCodeAt(0) % logoColors.length;

        const newCard: TrackerCard = {
          id: data.hackathon._id,
          title: formTitle,
          hosts: formHosts,
          location: formLocation || (formIsOnline ? "Online" : "Remote"),
          prizePool: formPrizePool || "TBD",
          category: formCategory || "General",
          description: formDescription,
          skills: formSkills ? formSkills.split(",").map(s => s.trim()).filter(Boolean) : [],
          status: formStatus,
          column: columnId,
          logoText: firstChar,
          logoBg: logoColors[colorHash],
          applyLink: formApplyLink,
          createdAt: data.hackathon.createdAt,
          date: formDate
        };

        setTrackerCards((prev) => [newCard, ...prev]);
        
        // Reset form
        setFormTitle("");
        setFormHosts("");
        setFormDate("");
        setFormLocation("");
        setFormPrizePool("");
        setFormCategory("");
        setFormDescription("");
        setFormSkills("");
        setFormStatus("Saved");
        setFormApplyLink("");
        setFormIsOnline(false);
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error("Error submitting manual hackathon:", err);
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
      const res = await fetch("/api/ai/filterHackathons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hackathons: matches,
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
        const itemText = `${item.title} ${item.hosts} ${item.location} ${(item.skills || []).join(' ')} ${item.category}`.toLowerCase();
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
    if (aiFilteredIds !== null && !aiFilteredIds.includes(match.id)) {
      return false;
    }

    const locLower = match.location.toLowerCase();
    if (workModeFilter === "remote") {
      if (!locLower.includes("remote") && !locLower.includes("online")) return false;
    } else if (workModeFilter === "hybrid") {
      if (!locLower.includes("hybrid")) return false;
    } else if (workModeFilter === "office") {
      if (locLower.includes("remote") || locLower.includes("online") || locLower.includes("hybrid")) return false;
    }

    if (regionFilter !== "all") {
      if (regionFilter === "us" && !locLower.includes("us") && !locLower.includes("san francisco") && !locLower.includes("new york") && !locLower.includes("ca") && !locLower.includes("ny")) return false;
      if (regionFilter === "uk" && !locLower.includes("uk") && !locLower.includes("london")) return false;
      if (regionFilter === "global" && !locLower.includes("global") && !locLower.includes("online")) return false;
    }

    if (roleFilter !== "all") {
      const titleLower = match.title.toLowerCase();
      const catLower = match.category.toLowerCase();
      if (roleFilter === "frontend" && !titleLower.includes("frontend") && !titleLower.includes("web") && !titleLower.includes("ux") && !titleLower.includes("ui")) return false;
      if (roleFilter === "backend" && !titleLower.includes("backend") && !titleLower.includes("infra")) return false;
      if (roleFilter === "aiml" && !titleLower.includes("ai") && !titleLower.includes("ml") && !titleLower.includes("machine") && !catLower.includes("artificial") && !catLower.includes("llama")) return false;
    }

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      const titleMatch = match.title.toLowerCase().includes(query);
      const hostMatch = match.hosts.toLowerCase().includes(query);
      const locMatch = match.location.toLowerCase().includes(query);
      const skillMatch = match.skills.some(s => s.toLowerCase().includes(query));
      if (!titleMatch && !hostMatch && !locMatch && !skillMatch) return false;
    }

    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-[1360px] mx-auto pb-12 text-[#1E1D1A]">

      {/* Scraper / Fetch Dashboard */}
      <div className="warm-card p-4 relative overflow-hidden bg-white">
        <div className="absolute top-0 right-0 w-50 h-50 bg-[#ec4899]/5 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-center md:text-left">
            <h2 className="text-lg uppercase font-bold text-[#1E1D1A] tracking-tight flex items-center justify-center md:justify-start gap-2">
              Real time AI Hackathon Fetcher
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
                Scraping Hackathon Portals...
              </span>
            ) : (
              <span className="flex uppercase items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#ec4899] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                Fetch Hackathons
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
          </div>

          {/* FILTERS PANEL */}
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
                      placeholder="Hackathon title, host, skill..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-100 border border-zinc-200 text-xs text-[#1E1D1A] placeholder-[#7C786E]/60 focus:outline-none focus:border-zinc-500 transition-all"
                    />
                  </div>

                  {/* Work Mode / Setting */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-[#7C786E] uppercase tracking-wider">Work Mode</label>
                    <select
                      value={workModeFilter}
                      onChange={(e) => setWorkModeFilter(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-100 border border-zinc-200 text-xs text-[#1E1D1A] focus:outline-none focus:border-zinc-500 transition-all cursor-pointer"
                    >
                      <option value="all">All Modes</option>
                      <option value="remote">Online / Virtual</option>
                      <option value="office">In-Person / Offline</option>
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
                      <option value="global">Global Remote / Online</option>
                    </select>
                  </div>

                  {/* Tech Domain */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-[#7C786E] uppercase tracking-wider">Role Domain</label>
                    <select
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-100 border border-zinc-200 text-xs text-[#1E1D1A] focus:outline-none focus:border-zinc-500 transition-all cursor-pointer"
                    >
                      <option value="all">All Themes</option>
                      <option value="frontend">Web / Frontend / UI</option>
                      <option value="backend">Backend / Cloud / Web3</option>
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
                        placeholder="e.g. AI hackathons with prize pool > 50,000..."
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
              {filteredMatches.map((match) => {
                const firstChar = match.hosts ? match.hosts.charAt(0).toUpperCase() : "H";
                const logoColors = [
                  "bg-gradient-to-tr from-indigo-500 to-purple-600",
                  "bg-gradient-to-tr from-emerald-500 to-teal-600",
                  "bg-gradient-to-tr from-orange-500 via-rose-500 to-purple-500",
                  "bg-gradient-to-tr from-zinc-800 to-zinc-950 border border-white/10",
                  "bg-gradient-to-tr from-blue-500 to-indigo-600",
                  "bg-gradient-to-tr from-red-600 to-red-800",
                  "bg-gradient-to-tr from-zinc-600 to-zinc-800"
                ];
                const logoBg = logoColors[match.hosts.charCodeAt(0) % logoColors.length];

                return (
                  <div
                    key={match.id}
                    className="warm-card p-5 hover:border-zinc-300 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden bg-white hover:shadow-md"
                  >
                    <div className="space-y-4">
                      {/* Header: Logo + Fit % */}
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <CompanyLogo
                            company={match.hosts}
                            applyUrl={match.url}
                            logoBg={logoBg}
                            logoText={firstChar}
                          />
                          <div>
                            <h4 className="font-bold text-[#1E1D1A] text-sm tracking-tight leading-tight group-hover:text-[#be185d] transition-colors duration-300">
                              {match.hosts}
                            </h4>
                            <span className="text-[10px] text-[#7C786E] flex items-center gap-1 mt-0.5 font-medium">
                              <MapPin className="w-3 h-3 text-[#7C786E]" />
                              {match.location}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-[9px] text-[#7C786E] block uppercase font-bold tracking-wider">Fit Score</span>
                          <span className="text-[#be185d] font-black text-sm">{match.fitScore}% Match</span>
                        </div>
                      </div>

                      {/* Hackathon title */}
                      <div>
                        <p className="text-xs font-semibold text-[#1E1D1A] line-clamp-2 leading-relaxed">
                          {match.title}
                        </p>
                        <div className="mt-2 space-y-0.5">
                          <div className="text-[10px] text-[#7C786E] flex items-center gap-1">
                            <span className="font-semibold">Prize Pool:</span>
                            <span className="font-bold text-[#1E1D1A] flex items-center gap-0.5"><DollarSign className="w-3.5 h-3.5 text-emerald-600" />{match.prizePool}</span>
                          </div>
                          <div className="text-[10px] text-[#7C786E] flex items-center gap-1.5">
                            <span>Deadline:</span>
                            <span className="font-extrabold text-zinc-900">{match.deadline}</span>
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
                        href={match.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-3 rounded-xl bg-white border border-gray-200 text-[#1E1D1A] hover:bg-gray-100 font-bold text-xs transition-colors flex items-center justify-center cursor-pointer shadow-sm"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            hasFetched && (
              <div className="warm-card p-8 text-center text-[#7C786E] bg-white rounded-2xl border border-gray-200 shadow-sm">
                <Check className="w-8 h-8 text-emerald-600 mx-auto mb-2 animate-bounce" />
                <p className="text-xs font-bold text-[#1E1D1A]">No hackathons fit current filter criteria.</p>
                <p className="text-[10px] text-[#7C786E] mt-1 max-w-xs mx-auto">
                  Try adjusting your filters, clearing your custom AI search, or clicking 'Fetch Hackathons' again to refresh.
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
            Hackathon Stage Tracker
          </h3>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center uppercase gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#2C2B27] hover:bg-[#1E1D1A] text-white font-bold text-sm shadow-sm cursor-pointer transition-all active:scale-95 shrink-0"
            >
              <FolderPlus className="w-3.5 h-3.5" />
              Add Hackathon
            </button>
          </div>
        </div>

        {/* Board Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {COLUMNS.map((column) => {
            const cardsInCol = trackerCards.filter((card) => card.column === column.id);

            let headerBg = "bg-[#FAF9F6] text-[#1E1D1A]";
            let dotColor = "bg-zinc-500";
            if (column.id === "saved") {
              dotColor = "bg-[#7C786E]";
            } else if (column.id === "applied") {
              dotColor = "bg-[#084298]";
            } else if (column.id === "won_participated") {
              dotColor = "bg-[#10B981]";
            }

            return (
              <div
                key={column.id}
                className="flex flex-col h-[580px] bg-[#FAF9F6] rounded-3xl p-3 border border-[#FDF2F8]/60 shadow-sm"
              >
                {/* Column Header */}
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
                          : "Won"
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
                    cardsInCol.map((card) => {
                      const dynamicScore = getDynamicMatchScore(card.title, card.hosts, card.skills);

                      return (
                        <div
                          key={card.id}
                          className="p-4 rounded-2xl bg-white border border-[#FDF2F8] hover:border-zinc-300 hover:shadow-md transition-all duration-300 relative group/card shadow-sm"
                        >
                          <div className="space-y-3">
                            {/* Card Top */}
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <CompanyLogo
                                  company={card.hosts}
                                  applyUrl={card.applyLink}
                                  logoBg={card.logoBg}
                                  logoText={card.logoText}
                                  size="sm"
                                />
                                <span className="font-extrabold text-[#1E1D1A] text-xs truncate max-w-[100px]">
                                  {card.hosts}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <span className="text-[9px] text-[#7C786E] font-semibold opacity-70">
                                  {card.createdAt ? new Date(card.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : ""}
                                </span>
                              </div>
                            </div>

                            {/* Card Body */}
                            <div>
                              <p className="text-[12px] font-bold text-[#1E1D1A] leading-snug">
                                {card.title}
                              </p>
                              <div className="mt-1 space-y-0.5">
                                <div className="text-[10px] text-[#7C786E] flex items-center gap-1">
                                  <span className="font-semibold">Prize:</span>
                                  <span className="font-bold text-[#1E1D1A] flex items-center gap-0.5"><DollarSign className="w-3.5 h-3.5 text-emerald-600" />{card.prizePool}</span>
                                </div>
                                <div className="text-[10px] text-[#7C786E] flex items-center gap-1">
                                  <span className="font-semibold">Date:</span>
                                  <span className="font-bold text-[#1E1D1A]">{getDeadline(card)}</span>
                                </div>
                                <div className="text-[10px] text-[#7C786E] flex items-center gap-1.5 flex-wrap">
                                  <span>Match Score:</span>
                                  <span className="font-extrabold text-zinc-900 mr-1">{dynamicScore}% Match</span>
                                </div>
                              </div>
                            </div>

                            {/* Action Link button */}
                            {card.applyLink && (
                              <a
                                href={card.applyLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#ec4899] text-white border border-zinc-200 hover:border-zinc-900 transition-all text-[10px] font-extrabold"
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
                                disabled={card.column === "won_participated"}
                                className={`p-1 rounded-lg border border-[#FDF2F8] bg-white transition-all text-[#7C786E] hover:text-[#1E1D1A] cursor-pointer shadow-sm ${
                                  card.column === "won_participated" ? "opacity-30 cursor-not-allowed" : "hover:bg-[#FFF5F7]"
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
                      <Trophy className="w-8 h-8 mb-3 text-[#7C786E]/40 stroke-[1.5]" />
                      <p className="text-xs uppercase font-extrabold text-[#1E1D1A] tracking-wider">Empty Stage</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Register Manual Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.6)] backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#FCE7F3] rounded-3xl shadow-xl w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#FDF2F8] px-8 py-5">
              <div>
                <h3 className="text-lg uppercase font-bold text-[#1E1D1A] flex items-center gap-2">
                  Register Completed or External Hackathon
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
            <form onSubmit={handleSubmitCustomHackathon} className="p-8 space-y-6 max-h-[85vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-[#7C786E] font-bold uppercase tracking-wider block">
                    Hackathon Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CalHacks 13.0"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-100 border border-gray-200 focus:outline-none focus:border-[#be185d] text-xs text-[#1E1D1A] placeholder-[#7C786E]/55 transition-colors shadow-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-[#7C786E] font-bold uppercase tracking-wider block">
                    Host / Organizer *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. UC Berkeley"
                    value={formHosts}
                    onChange={(e) => setFormHosts(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-100 border border-gray-200 focus:outline-none focus:border-[#be185d] text-xs text-[#1E1D1A] placeholder-[#7C786E]/55 transition-colors shadow-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-[#7C786E] font-bold uppercase tracking-wider block">
                    Date / Duration
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. June 25 - 27, 2026"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-100 border border-gray-200 focus:outline-none focus:border-[#be185d] text-xs text-[#1E1D1A] placeholder-[#7C786E]/55 transition-colors shadow-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-[#7C786E] font-bold uppercase tracking-wider block">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. San Francisco, CA"
                    value={formLocation}
                    disabled={formIsOnline}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-100 border border-gray-200 focus:outline-none focus:border-[#be185d] text-xs text-[#1E1D1A] placeholder-[#7C786E]/55 transition-colors shadow-sm disabled:opacity-50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-[#7C786E] font-bold uppercase tracking-wider block">
                    Prize Pool
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. $100,000"
                    value={formPrizePool}
                    onChange={(e) => setFormPrizePool(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-100 border border-gray-200 focus:outline-none focus:border-[#be185d] text-xs text-[#1E1D1A] placeholder-[#7C786E]/55 transition-colors shadow-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-[#7C786E] font-bold uppercase tracking-wider block">
                    Category
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Generative AI"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-100 border border-gray-200 focus:outline-none focus:border-[#be185d] text-xs text-[#1E1D1A] placeholder-[#7C786E]/55 transition-colors shadow-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-[#7C786E] font-bold uppercase tracking-wider block">
                    Technologies (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="React, Next.js, Python"
                    value={formSkills}
                    onChange={(e) => setFormSkills(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-100 border border-[#FCE7F3] focus:outline-none focus:border-[#be185d] text-xs text-[#1E1D1A] placeholder-[#7C786E]/55 transition-colors shadow-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-[#7C786E] font-bold uppercase tracking-wider block">
                    Application Link
                  </label>
                  <input
                    type="url"
                    placeholder="https://devpost.com"
                    value={formApplyLink}
                    onChange={(e) => setFormApplyLink(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-100 border border-gray-200 focus:outline-none focus:border-[#be185d] text-xs text-[#1E1D1A] placeholder-[#7C786E]/55 transition-colors shadow-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-[#7C786E] font-bold uppercase tracking-wider block">
                    Participation Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e: any) => setFormStatus(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-100 border border-gray-200 focus:outline-none focus:border-[#be185d] text-xs text-[#1E1D1A] transition-colors shadow-sm cursor-pointer"
                  >
                    <option value="Saved">Saved</option>
                    <option value="Applied">Applied</option>
                    <option value="Participated">Participated</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Won">Won</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
                <label className="flex items-center gap-2 text-xs text-[#7C786E] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formIsOnline}
                    onChange={(e) => {
                      setFormIsOnline(e.target.checked);
                      if (e.target.checked) setFormLocation("Online");
                      else setFormLocation("");
                    }}
                    className="rounded border-[#FCE7F3] text-[#ec4899] focus:ring-[#ec4899] w-4 h-4"
                  />
                  <span>This is an Online / Virtual Hackathon</span>
                </label>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-[#7C786E] font-bold uppercase tracking-wider block">
                  Hackathon Description / Project Built
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the project built or hackathon focus..."
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
              Are you sure you want to remove this hackathon from your tracker? This action cannot be undone.
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
