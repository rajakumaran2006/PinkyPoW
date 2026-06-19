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
    logoBg: "bg-gradient-to-tr from-indigo-500 to-purple-600"
  },
  {
    id: "match-vercel",
    company: "Vercel",
    role: "Frontend Developer (Next.js)",
    location: "Remote (Global)",
    matchScore: 89,
    tags: ["React 19", "Tailwind CSS", "Next.js"],
    logoText: "V",
    logoBg: "bg-gradient-to-tr from-zinc-800 to-zinc-950 border border-white/10"
  },
  {
    id: "match-supabase",
    company: "Supabase",
    role: "Developer Relations Intern",
    location: "Remote (US)",
    matchScore: 91,
    tags: ["PostgreSQL", "TypeScript", "Next.js"],
    logoText: "S",
    logoBg: "bg-gradient-to-tr from-emerald-500 to-teal-600"
  },
  {
    id: "match-linear",
    company: "Linear",
    role: "Product Engineer Intern",
    location: "New York, NY (Office)",
    matchScore: 95,
    tags: ["React", "GraphQL", "TypeScript"],
    logoText: "L",
    logoBg: "bg-gradient-to-tr from-zinc-600 to-zinc-800"
  },
  {
    id: "match-figma",
    company: "Figma",
    role: "UX Engineer Intern",
    location: "London, UK (Hybrid)",
    matchScore: 82,
    tags: ["Figma Plugins", "Canvas", "TypeScript"],
    logoText: "F",
    logoBg: "bg-gradient-to-tr from-orange-500 via-rose-500 to-purple-500"
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
    logoBg: "bg-gradient-to-tr from-zinc-700 to-zinc-900"
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
    logoBg: "bg-gradient-to-tr from-rose-500 to-pink-600"
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
    logoBg: "bg-gradient-to-tr from-blue-500 to-indigo-600"
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
    logoBg: "bg-gradient-to-tr from-red-600 to-red-800"
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

  const companiesToScan = ["Stripe", "Vercel", "Supabase", "Linear", "Figma", "Google", "Meta", "Notion", "Github"];

  const handleFetchMatches = () => {
    setIsFetching(true);
    setFetchProgress(0);
    setTerminalLogs([]);
    setMatches([]);
    setCurrentSearchIndex(0);
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
        const next = prev + 12.5;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsFetching(false);
            setMatches(ALL_MOCK_MATCHES);
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
  }, [isFetching, fetchProgress]);

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
      logoBg: match.logoBg
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
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Internship Radar</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-[10px] text-pink-400 font-bold uppercase tracking-wider animate-pulse">
              AI Matching Live
            </span>
          </div>
          <p className="text-zinc-400 text-sm mt-1 max-w-xl">
            PinkyPow scans global tech portals in real-time, matching requirements directly to your profile placement score.
          </p>
        </div>

        {/* Score widget */}
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 shadow-lg">
          <div className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping" />
          <div className="text-xs">
            <span className="text-zinc-400 block font-medium uppercase tracking-wider text-[9px]">Calibrated Profile Score</span>
            <span className="text-white font-bold text-sm">820 / 1000</span>
          </div>
        </div>
      </div>

      {/* Scraper / Fetch Dashboard */}
      <div className="glass-panel rounded-3xl p-6 relative overflow-hidden border border-white/5">
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center justify-center md:justify-start gap-2">
              <Sparkles className="w-5 h-5 text-pink-500" />
              Real-time AI Match Fetcher
            </h2>
            <p className="text-xs text-zinc-400 max-w-md">
              Trigger a live scan across Vercel, Stripe, Linear, Notion, Supabase, Google and 30+ other corporate sites.
            </p>
          </div>

          <button
            onClick={handleFetchMatches}
            disabled={isFetching}
            className={`relative py-3 px-8 rounded-2xl font-extrabold text-sm tracking-wide transition-all duration-500 group shadow-lg ${
              isFetching
                ? "bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed"
                : "bg-white text-black hover:bg-zinc-100 hover:shadow-pink-500/10 hover:shadow-2xl cursor-pointer"
            }`}
          >
            {isFetching ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-pink-500" />
                Scraping Dev Portals...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Fetch AI Matches
                <TrendingUp className="w-4 h-4 text-zinc-700 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </span>
            )}
            {/* Glowing boundary */}
            {!isFetching && (
              <span className="absolute -inset-[1px] rounded-2xl border border-white/20 group-hover:border-pink-500/30 transition-colors pointer-events-none" />
            )}
          </button>
        </div>

        {/* Live Scraper Terminal Log animation */}
        {isFetching && (
          <div className="mt-6 rounded-2xl bg-black/60 border border-white/5 p-4 space-y-3 font-mono text-[11px] text-zinc-300 shadow-inner">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <div className="flex items-center gap-2 text-zinc-400">
                <Terminal className="w-4 h-4 text-pink-500" />
                <span>pinkypow-scraper.sh</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-pink-400 font-semibold animate-pulse">
                  Scanning: {companiesToScan[currentSearchIndex]}...
                </span>
                <span className="text-zinc-500">{Math.round(fetchProgress)}%</span>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-pink-500 to-purple-600 h-full transition-all duration-300"
                style={{ width: `${fetchProgress}%` }}
              />
            </div>

            <div className="space-y-1.5 max-h-32 overflow-y-auto pt-1">
              {terminalLogs.map((log, idx) => (
                <div key={idx} className="flex gap-2">
                  <span className="text-pink-500/70 shrink-0">➔</span>
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
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
              <Plus className="w-4 h-4 text-pink-500" />
              New Matches Found ({matches.length})
            </h3>
            {matches.length === 0 && (
              <span className="text-xs text-zinc-500">All matches added to tracker. Fetch again to refresh.</span>
            )}
          </div>

          {matches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {matches.map((match) => (
                <div
                  key={match.id}
                  className="glass-panel rounded-3xl p-5 hover:border-pink-500/25 border border-white/5 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
                >
                  {/* Matching Indicator bar */}
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-pink-500/40 to-purple-600/40" />

                  <div className="space-y-4">
                    {/* Header: Logo + Match % */}
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-base shadow-md ${match.logoBg}`}>
                          {match.logoText}
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm tracking-tight leading-tight group-hover:text-pink-400 transition-colors duration-300">
                            {match.company}
                          </h4>
                          <span className="text-[10px] text-zinc-500 flex items-center gap-1 mt-0.5 font-medium">
                            <MapPin className="w-3 h-3 text-zinc-600" />
                            {match.location}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-zinc-500 block uppercase font-bold tracking-wider">Fit Score</span>
                        <span className="text-pink-500 font-extrabold text-sm">{match.matchScore}% Match</span>
                      </div>
                    </div>

                    {/* Role title */}
                    <p className="text-xs font-semibold text-zinc-200 line-clamp-2 leading-relaxed">
                      {match.role}
                    </p>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-1.5">
                      {match.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/5 text-[9px] text-zinc-400 font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2.5 mt-5 pt-4 border-t border-white/5">
                    <button
                      onClick={() => handleAddToTracker(match)}
                      className="flex-1 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-white hover:text-pink-400 font-bold transition-all duration-300 flex items-center justify-center gap-1.5 text-xs cursor-pointer"
                    >
                      <FolderPlus className="w-3.5 h-3.5" />
                      Add to Tracker
                    </button>
                    <a
                      href="https://greenhouse.io"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-3 rounded-xl bg-white text-black hover:bg-zinc-200 font-bold text-xs transition-colors flex items-center justify-center cursor-pointer"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            hasFetched && (
              <div className="glass-panel rounded-3xl p-8 text-center text-zinc-500 border border-white/5">
                <Check className="w-8 h-8 text-emerald-500 mx-auto mb-2 animate-bounce" />
                <p className="text-xs font-bold text-white">All matched roles added to board!</p>
                <p className="text-[10px] text-zinc-500 mt-1 max-w-xs mx-auto">
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
          <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-pink-500" />
            Application Stage Tracker
          </h3>
          <span className="text-[10px] text-zinc-500 bg-white/5 border border-white/5 px-2 py-0.5 rounded-md font-medium">
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
                className="glass-panel rounded-3xl p-4 flex flex-col h-[520px] border-t-2 border border-white/5"
                style={{
                  borderTopColor: column.id === "saved"
                    ? "rgba(255,255,255,0.15)"
                    : column.id === "applied"
                    ? "rgba(236,72,153,0.4)"
                    : column.id === "interviewing"
                    ? "rgba(168,85,247,0.4)"
                    : "rgba(16,185,129,0.4)"
                }}
              >
                {/* Column Title Header */}
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/5">
                  <span className={`text-xs font-bold uppercase tracking-wider ${column.accent}`}>
                    {column.title}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] font-bold text-zinc-400">
                    {cardsInCol.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 scrollbar-none">
                  {cardsInCol.length > 0 ? (
                    cardsInCol.map((card) => (
                      <div
                        key={card.id}
                        className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/[0.07] transition-all duration-300 relative group/card shadow"
                      >
                        <div className="space-y-3">
                          {/* Logo & Close/Trash */}
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                              <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-white text-[10px] ${card.logoBg}`}>
                                {card.logoText}
                              </div>
                              <span className="font-bold text-white text-xs truncate max-w-[100px]">
                                {card.company}
                              </span>
                            </div>

                            <button
                              onClick={() => handleRemoveCard(card.id)}
                              className="text-zinc-600 hover:text-rose-400 p-1 rounded-md transition-colors opacity-0 group-hover/card:opacity-100 cursor-pointer"
                              title="Remove card"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Role Title */}
                          <p className="text-[11px] font-semibold text-zinc-300 leading-normal line-clamp-2">
                            {card.role}
                          </p>

                          {/* Location & Score */}
                          <div className="flex items-center justify-between text-[9px] text-zinc-500 font-medium">
                            <span className="truncate max-w-[80px]">{card.location}</span>
                            <span className="text-pink-500/80 font-bold">{card.matchScore}% Match</span>
                          </div>

                          {/* Navigation / Transition buttons */}
                          <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-1.5">
                            <button
                              onClick={() => handleMoveCard(card.id, "left")}
                              disabled={card.column === "saved"}
                              className={`p-1 rounded-md border border-white/5 bg-white/5 transition-all text-zinc-500 hover:text-white cursor-pointer ${
                                card.column === "saved" ? "opacity-30 cursor-not-allowed" : "hover:bg-white/10"
                              }`}
                            >
                              <ChevronLeft className="w-3 h-3" />
                            </button>
                            <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest select-none">
                              Move
                            </span>
                            <button
                              onClick={() => handleMoveCard(card.id, "right")}
                              disabled={card.column === "rejected_offer"}
                              className={`p-1 rounded-md border border-white/5 bg-white/5 transition-all text-zinc-500 hover:text-white cursor-pointer ${
                                card.column === "rejected_offer" ? "opacity-30 cursor-not-allowed" : "hover:bg-white/10"
                              }`}
                            >
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 border border-dashed border-white/5 rounded-2xl text-zinc-600">
                      <Briefcase className="w-5 h-5 mb-1.5 opacity-30" />
                      <p className="text-[10px] font-medium leading-relaxed">No roles at this stage.</p>
                      <p className="text-[9px] mt-0.5 max-w-[120px] leading-tight">Drag or add roles here to begin tracking.</p>
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
