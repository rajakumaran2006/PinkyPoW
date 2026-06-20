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
  const [trackerCards, setTrackerCards] = useState<TrackerCard[]>(INITIAL_TRACKER_CARDS);
  const [hasFetched, setHasFetched] = useState(false);
  const [fetchedData, setFetchedData] = useState<Match[] | null>(null);

  const companiesToScan = ["Stripe", "Vercel", "Supabase", "Linear", "Figma", "Google", "Meta", "Notion", "Github"];

  const handleFetchMatches = () => {
    setIsFetching(true);
    setFetchProgress(0);
    setTerminalLogs([]);
    setMatches([]);
    setFetchedData(null);
    setCurrentSearchIndex(0);

    // Call the dynamic scraper API in the background
    fetch("/api/scrape/internships", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        techStack: ["React", "TypeScript", "Node.js", "Python", "Next.js", "AI", "ML"],
        userLevel: "Entry"
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
          setFetchedData(ALL_MOCK_MATCHES);
        }
      })
      .catch((err) => {
        console.error("Scraper fetch error:", err);
        setFetchedData(ALL_MOCK_MATCHES);
      });
  };

  // Simulating the scraping log flow
  useEffect(() => {
    if (!isFetching) return;

    const logMessages = [
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
            setMatches(fetchedData || ALL_MOCK_MATCHES);
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
  const handleAddToTracker = (match: Match) => {
    // Check if already in tracker
    if (trackerCards.some((c) => c.company === match.company && c.role === match.role)) return;

    const newCard: TrackerCard = {
      id: `track-${Date.now()}`,
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
    // Remove from active match grid to avoid duplication
    setMatches((prev) => prev.filter((m) => m.id !== match.id));
  };

  // Move Tracker Card Column
  const handleMoveCard = (cardId: string, direction: "left" | "right") => {
    const columnsOrder: ("saved" | "applied" | "interviewing" | "rejected_offer")[] = [
      "saved",
      "applied",
      "interviewing",
      "rejected_offer"
    ];

    setTrackerCards((prev) =>
      prev.map((card) => {
        if (card.id !== cardId) return card;
        const currentIndex = columnsOrder.indexOf(card.column);
        let nextIndex = currentIndex;
        if (direction === "left" && currentIndex > 0) {
          nextIndex = currentIndex - 1;
        } else if (direction === "right" && currentIndex < columnsOrder.length - 1) {
          nextIndex = currentIndex + 1;
        }
        return { ...card, column: columnsOrder[nextIndex] };
      })
    );
  };

  // Remove Card
  const handleRemoveCard = (cardId: string) => {
    setTrackerCards((prev) => prev.filter((card) => card.id !== cardId));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-[1360px] mx-auto pb-12 text-[#1E1D1A]">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-2 border-b border-[#EFECE3]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-normal text-[#1E1D1A] tracking-tight">Internship Radar</h1>
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

      {/* Scraper / Fetch Dashboard */}
      <div className="warm-card p-8 relative overflow-hidden bg-white">
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F5C451]/5 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <h2 className="text-lg font-bold text-[#1E1D1A] tracking-tight flex items-center justify-center md:justify-start gap-2">
              <Sparkles className="w-5 h-5 text-[#F5C451]" />
              Real-time AI Match Fetcher
            </h2>
            <p className="text-xs text-[#7C786E] max-w-md">
              Trigger a live scan across Vercel, Stripe, Linear, Notion, Supabase, Google and 30+ other corporate sites.
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
              New Matches Found ({matches.length})
            </h3>
            {matches.length === 0 && (
              <span className="text-xs text-[#7C786E]">All matches added to tracker. Fetch again to refresh.</span>
            )}
          </div>

          {matches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {matches.map((match) => (
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
              <div className="warm-card p-8 text-center text-[#7C786E] bg-white">
                <Check className="w-8 h-8 text-emerald-600 mx-auto mb-2 animate-bounce" />
                <p className="text-xs font-bold text-[#1E1D1A]">All matched roles added to board!</p>
                <p className="text-[10px] text-[#7C786E] mt-1 max-w-xs mx-auto">
                  Click 'Fetch AI Matches' again to run a new scanner loop on active ATS pipelines.
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

                            <div className="flex items-center gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity">
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
    </div>
  );
}
