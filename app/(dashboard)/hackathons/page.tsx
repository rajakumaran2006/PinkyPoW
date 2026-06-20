"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Trophy,
  Calendar,
  MapPin,
  DollarSign,
  Plus,
  Check,
  Trash2,
  Users,
  ArrowRight,
  Sparkles,
  Clock,
  ExternalLink,
  Search,
  Filter,
  CheckCircle2
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
  bannerGradient: string;
  category: string;
  description: string;
  skills: string[];
  participants: number;
  timelineState: "team_formation" | "registration" | "submission" | "judging";
  deadline: string;
  url: string;
}

export default function HackathonRadar() {
  // Hardcoded rich mock data for hackathons
  const initialHackathons: HackathonEvent[] = [
    {
      id: "hack-1",
      title: "CalHacks 13.0",
      hosts: "UC Berkeley",
      date: "June 25 - 27, 2026",
      location: "San Francisco, CA",
      isOnline: false,
      isNearMe: true,
      isMatched: true,
      prizePool: "$100,000",
      bannerGradient: "from-pink-500 via-purple-500 to-indigo-600",
      category: "Generative AI & Web3",
      description: "The world's largest collegiate hackathon returns to SF. Build groundbreaking applications with top-tier API sponsors and compute resources.",
      skills: ["React", "Python", "Next.js", "Solidity"],
      participants: 1200,
      timelineState: "team_formation",
      deadline: "5 days left",
      url: "https://devpost.com/hackathons"
    },
    {
      id: "hack-2",
      title: "Vercel Global AI Challenge",
      hosts: "Vercel × OpenAI",
      date: "July 2 - 5, 2026",
      location: "Online",
      isOnline: true,
      isNearMe: false,
      isMatched: true,
      prizePool: "$50,000",
      bannerGradient: "from-purple-600 via-indigo-600 to-blue-500",
      category: "Artificial Intelligence",
      description: "Build Next.js AI applications that push the boundaries of product design, real-time audio, and developer productivity.",
      skills: ["Next.js", "OpenAI API", "Tailwind CSS", "TypeScript"],
      participants: 3450,
      timelineState: "registration",
      deadline: "12 days left",
      url: "https://devpost.com/hackathons"
    },
    {
      id: "hack-3",
      title: "EthDenver 2026",
      hosts: "Ethereum Foundation",
      date: "July 12 - 15, 2026",
      location: "Denver, CO",
      isOnline: false,
      isNearMe: false,
      isMatched: false,
      prizePool: "$250,000",
      bannerGradient: "from-blue-600 via-teal-500 to-emerald-400",
      category: "Blockchain / DevTools",
      description: "Join the largest community-owned Web3 hackathon on the planet. Create next-gen decentralized applications, protocols, and L2 scaling tools.",
      skills: ["Solidity", "Rust", "Go", "Web3.js"],
      participants: 4000,
      timelineState: "team_formation",
      deadline: "22 days left",
      url: "https://devpost.com/hackathons"
    },
    {
      id: "hack-4",
      title: "Stripe API Buildathon",
      hosts: "Stripe Developer Relations",
      date: "July 20 - 22, 2026",
      location: "Online",
      isOnline: true,
      isNearMe: false,
      isMatched: true,
      prizePool: "$20,000",
      bannerGradient: "from-rose-500 via-orange-500 to-yellow-500",
      category: "Fintech & Payments",
      description: "Reimagine the checkout experience, usage-based billing structures, or developer marketplaces using the latest Stripe SDK updates.",
      skills: ["React", "Node.js", "Stripe API", "PostgreSQL"],
      participants: 980,
      timelineState: "submission",
      deadline: "1 month left",
      url: "https://devpost.com/hackathons"
    },
    {
      id: "hack-5",
      title: "Cloudflare Edge Challenge",
      hosts: "Cloudflare",
      date: "August 1 - 5, 2026",
      location: "Online",
      isOnline: true,
      isNearMe: false,
      isMatched: false,
      prizePool: "$30,000",
      bannerGradient: "from-teal-400 via-emerald-500 to-green-600",
      category: "Cloud Infrastructure",
      description: "Write globally distributed serverless workers, KV stores, and low-latency image compression scripts running directly on the edge.",
      skills: ["Cloudflare Workers", "Wasm", "TypeScript", "Wrangler"],
      participants: 1400,
      timelineState: "judging",
      deadline: "about 2 months left",
      url: "https://devpost.com/hackathons"
    },
    {
      id: "hack-6",
      title: "Meta Llama Hack",
      hosts: "Meta AI",
      date: "August 15 - 17, 2026",
      location: "Menlo Park, CA",
      isOnline: false,
      isNearMe: true,
      isMatched: false,
      prizePool: "$80,000",
      bannerGradient: "from-violet-600 via-fuchsia-500 to-pink-500",
      category: "LLM Fine-tuning",
      description: "Fine-tune Llama 3 models for complex, multi-modal business flows, agentic search systems, and high-efficiency offline operations.",
      skills: ["PyTorch", "Hugging Face", "Python", "Docker"],
      participants: 600,
      timelineState: "registration",
      deadline: "2 months left",
      url: "https://devpost.com/hackathons"
    }
  ];

  // Active filters and tracking states
  const [filter, setFilter] = useState<"All" | "Near Me" | "Online" | "Matched">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [trackedIds, setTrackedIds] = useState<string[]>(["hack-1", "hack-2", "hack-4"]);
  const [activeTrackerId, setActiveTrackerId] = useState<string>("hack-1");

  // AI Matches fetcher states
  const [isFetching, setIsFetching] = useState(false);
  const [fetchProgress, setFetchProgress] = useState(0);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);
  const [hackathons, setHackathons] = useState<HackathonEvent[]>(initialHackathons);
  const [hasFetched, setHasFetched] = useState(false);
  const [fetchedData, setFetchedData] = useState<HackathonEvent[] | null>(null);

  const companiesToScan = ["Devpost API Node", "MLH Seasons Node", "Devfolio Portals", "HackerEarth Scraper", "GitHub Seeds"];

  const handleFetchMatches = () => {
    setIsFetching(true);
    setFetchProgress(0);
    setTerminalLogs([]);
    setFetchedData(null);
    setCurrentSearchIndex(0);

    fetch("/api/scrape/hackathons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        techStack: ["React", "TypeScript", "Node.js", "Python", "Next.js", "AI", "ML"],
        search: searchQuery
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.hackathons) {
          const bannerGradients = [
            "from-pink-500 via-purple-500 to-indigo-600",
            "from-purple-600 via-indigo-600 to-blue-500",
            "from-blue-600 via-teal-500 to-emerald-400",
            "from-rose-500 via-orange-500 to-yellow-500",
            "from-teal-400 via-emerald-500 to-green-600",
            "from-violet-600 via-fuchsia-500 to-pink-500"
          ];
          const mapped: HackathonEvent[] = data.hackathons.map((h: any, idx: number) => ({
            id: h.id,
            title: h.title,
            hosts: h.location.toLowerCase().includes("online") ? "Devpost Global" : h.location,
            date: h.date,
            location: h.location,
            isOnline: h.isOnline,
            isNearMe: !h.isOnline && idx % 3 === 0,
            isMatched: h.skills.some((s: string) => ["react", "next.js", "typescript", "python", "machine learning", "ai", "machine learning/ai"].includes(s.toLowerCase())),
            prizePool: h.prizePool,
            bannerGradient: bannerGradients[idx % bannerGradients.length],
            category: h.category,
            description: `${h.title} hackathon listed on Devpost. Focuses on ${h.skills.join(", ")}. Participate to build, collaborate, and win prizes!`,
            skills: h.skills.slice(0, 4),
            participants: h.participants || Math.floor(Math.random() * 200) + 100,
            timelineState: idx % 4 === 0 ? "team_formation" : idx % 4 === 1 ? "registration" : idx % 4 === 2 ? "submission" : "judging",
            deadline: h.deadline,
            url: h.url
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
        // If data is not loaded yet and we are near the end, hold at 90%
        if (prev >= 90 && !fetchedData) {
          return 90;
        }
        const next = prev + 10;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsFetching(false);
            if (fetchedData && fetchedData.length > 0) {
              setHackathons(fetchedData);
            }
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
    }, 350);

    return () => clearInterval(interval);
  }, [isFetching, fetchProgress, fetchedData]);

  // Filtering Logic
  const filteredHackathons = useMemo(() => {
    return hackathons.filter((event) => {
      // Filter tab check
      if (filter === "Near Me" && !event.isNearMe) return false;
      if (filter === "Online" && !event.isOnline) return false;
      if (filter === "Matched" && !event.isMatched) return false;

      // Search query check
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          event.title.toLowerCase().includes(query) ||
          event.category.toLowerCase().includes(query) ||
          event.hosts.toLowerCase().includes(query) ||
          event.skills.some((s) => s.toLowerCase().includes(query))
        );
      }
      return true;
    });
  }, [filter, searchQuery, hackathons]);

  // Tracked Hackathons details
  const trackedHackathons = useMemo(() => {
    return hackathons.filter((h) => trackedIds.includes(h.id));
  }, [trackedIds, hackathons]);

  // Active tracked hackathon details for timeline view
  const activeTrackedEvent = useMemo(() => {
    return trackedHackathons.find((h) => h.id === activeTrackerId) || trackedHackathons[0] || null;
  }, [trackedHackathons, activeTrackerId]);

  // Toggle tracker addition
  const handleToggleTrack = (id: string) => {
    setTrackedIds((prev) => {
      const isTracked = prev.includes(id);
      let updated: string[];
      if (isTracked) {
        updated = prev.filter((item) => item !== id);
      } else {
        updated = [...prev, id];
      }
      // If we removed the active tracker item, reset the active tracker pointer
      if (isTracked && activeTrackerId === id) {
        if (updated.length > 0) {
          setActiveTrackerId(updated[0]);
        }
      } else if (!isTracked && prev.length === 0) {
        setActiveTrackerId(id);
      }
      return updated;
    });
  };

  // Helper for generating custom dates / subtexts for tracker steps
  const getTimelineSteps = (event: HackathonEvent) => {
    // We map states: Team Formation -> Registration Deadline -> Project Submission -> Judging
    const statesOrder = ["team_formation", "registration", "submission", "judging"];
    const currentIndex = statesOrder.indexOf(event.timelineState);

    return [
      {
        key: "team_formation",
        label: "Team Formation",
        description: "Form a group of 2-4 members with matching technical profiles.",
        status: currentIndex > 0 ? "completed" : currentIndex === 0 ? "current" : "upcoming",
        date: "Completed on Time"
      },
      {
        key: "registration",
        label: "Registration Deadline",
        description: "Submit resume, portfolio link, and project proposal guidelines.",
        status: currentIndex > 1 ? "completed" : currentIndex === 1 ? "current" : "upcoming",
        date: "Closing soon"
      },
      {
        key: "submission",
        label: "Project Submission",
        description: "Upload GitHub repository, demo video, and setup documentation.",
        status: currentIndex > 2 ? "completed" : currentIndex === 2 ? "current" : "upcoming",
        date: "July 24, 2026"
      },
      {
        key: "judging",
        label: "Judging & Results",
        description: "Presentation to judges panel and distribution of placement offers.",
        status: currentIndex > 3 ? "completed" : currentIndex === 3 ? "current" : "upcoming",
        date: "Winner announcement"
      }
    ];
  };
  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-[1360px] mx-auto pb-12 text-[#1E1D1A]">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-[#EFECE3] pb-6">
        <div>
          <h1 className="text-4xl font-normal text-[#1E1D1A] tracking-tight flex items-center gap-3">
            <Trophy className="w-10 h-10 text-[#F5C451]" />
            Hackathon Radar
          </h1>
          <p className="text-[#7C786E] text-sm mt-2 max-w-xl">
            Discover, track, and win global coding events. Match your tech stack with official sponsor briefs and secure fast-tracked placements.
          </p>
        </div>

        {/* Quick Stats banner */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-[#ECE9DF] shadow-sm">
          <div className="text-center px-4 border-r border-[#ECE9DF]">
            <span className="block text-[9px] text-[#7C786E] font-semibold uppercase tracking-wider">Active Events</span>
            <span className="text-2xl font-black text-[#1E1D1A]">{hackathons.length}</span>
          </div>
          <div className="text-center px-4 border-r border-[#ECE9DF]">
            <span className="block text-[9px] text-[#7C786E] font-semibold uppercase tracking-wider">Tracked</span>
            <span className="text-2xl font-black text-[#7A6218]">{trackedIds.length}</span>
          </div>
          <div className="text-center px-4">
            <span className="block text-[9px] text-[#7C786E] font-semibold uppercase tracking-wider">Total Prizes</span>
            <span className="text-2xl font-black text-[#2C2B27]">$530k</span>
          </div>
        </div>
      </div>

      {/* Scraper / Fetch Dashboard */}
      <div className="warm-card p-6 relative overflow-hidden bg-white hover:border-[#F5C451] transition-all duration-300">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <h2 className="text-lg font-bold text-[#1E1D1A] tracking-tight flex items-center justify-center md:justify-start gap-2">
              <Sparkles className="w-5 h-5 text-[#F5C451]" />
              Real-time AI Match Fetcher
            </h2>
            <p className="text-xs text-[#7C786E] max-w-md">
              Trigger a live scan across Devpost, MLH, and Devfolio to match open hackathons directly to your profile.
            </p>
          </div>

          <button
            onClick={handleFetchMatches}
            disabled={isFetching}
            className={`relative py-3 px-8 rounded-2xl font-extrabold text-sm tracking-wide transition-all duration-500 group shadow-md cursor-pointer ${
              isFetching
                ? "bg-[#E5E2D6] text-[#7C786E] border border-[#ECE9DF] cursor-not-allowed"
                : "bg-[#2C2B27] text-white hover:bg-[#1E1D1A]"
            }`}
          >
            {isFetching ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-zinc-400 border-t-[#F5C451] animate-spin" />
                Scraping Portals...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Fetch AI Matches
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
              </span>
            )}
          </button>
        </div>

        {/* Live Scraper Terminal Log animation */}
        {isFetching && (
          <div className="mt-6 rounded-2xl bg-[#1E1D1A] border border-[#ECE9DF] p-4 space-y-3 font-mono text-[11px] text-zinc-300 shadow-inner">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <div className="flex items-center gap-2 text-zinc-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>pinkypow-hack-scraper.sh</span>
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
                className="bg-gradient-to-r from-[#F5C451] to-amber-600 h-full transition-all duration-300"
                style={{ width: `${fetchProgress}%` }}
              />
            </div>

            <div className="space-y-1.5 max-h-32 overflow-y-auto pt-1">
              {terminalLogs.map((log, idx) => (
                <div key={idx} className="flex gap-2">
                  <span className="text-[#F5C451] shrink-0">➔</span>
                  <span className="break-all">{log}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Filter and Search Bar (Sticky) */}
      <div className="sticky top-0 z-20 py-4 bg-[#FAF6EA]/95 backdrop-blur-md border-b border-[#EFECE3] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7C786E]" />
          <input
            type="text"
            placeholder="Search by tech stack, hosts, or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-full bg-white border border-[#ECE9DF] focus:outline-none focus:border-[#F5C451] text-sm text-[#1E1D1A] placeholder-[#7C786E] transition-colors shadow-sm"
          />
        </div>

        {/* Filters pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <Filter className="w-4 h-4 text-[#7C786E] mr-2 shrink-0 hidden sm:block" />
          {(["All", "Near Me", "Online", "Matched"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 whitespace-nowrap cursor-pointer ${
                filter === tab
                  ? "bg-[#2C2B27] text-white shadow-md"
                  : "bg-white text-[#7C786E] hover:text-[#1E1D1A] hover:bg-[#FAF9F5] border border-[#ECE9DF] shadow-sm"
              }`}
            >
              {tab === "Matched" ? "Matched to My Skills" : tab === "Near Me" ? "Near Me (Location-based)" : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Discovery Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#1E1D1A] tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#F5C451]" />
            Discover Coding Events ({filteredHackathons.length})
          </h2>
        </div>

        {filteredHackathons.length === 0 ? (
          <div className="warm-card p-12 text-center text-[#7C786E] bg-white">
            <Trophy className="w-12 h-12 text-[#7C786E] mx-auto mb-2" />
            <h3 className="text-lg font-bold text-[#1E1D1A]">No hackathons found</h3>
            <p className="text-xs text-[#7C786E] max-w-sm mx-auto mt-1">
              We couldn't find any hackathons matching your search or active filter tab. Try resetting your search query.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHackathons.map((event) => {
              const isTracked = trackedIds.includes(event.id);
              return (
                <div
                  key={event.id}
                  className="warm-card overflow-hidden flex flex-col justify-between hover:border-[#F5C451] transition-all duration-300 group bg-white"
                >
                  {/* Subtle Gradient Event Banner */}
                  <div className={`h-24 bg-gradient-to-r ${event.bannerGradient} relative p-4 flex flex-col justify-between`}>
                    {/* Glass Overlay for depth */}
                    <div className="absolute inset-0 bg-black/10 backdrop-brightness-95 pointer-events-none" />
                    
                    <div className="relative z-10 flex justify-between items-start">
                      <span className="px-2.5 py-0.5 rounded-full bg-black/35 backdrop-blur-sm border border-white/10 text-[10px] text-white font-bold uppercase tracking-wider">
                        {event.category}
                      </span>
                      
                      {event.isMatched && (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/25 backdrop-blur-sm border border-emerald-400/20 text-[10px] text-emerald-200 font-bold uppercase tracking-wider flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Skill Match
                        </span>
                      )}
                    </div>

                    <div className="relative z-10">
                      <span className="text-[10px] text-white/80 font-semibold uppercase">{event.hosts}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                    <div className="space-y-3">
                      <h3 className="text-lg font-bold text-[#1E1D1A] group-hover:text-[#7A6218] transition-colors tracking-tight leading-snug">
                        {event.title}
                      </h3>

                      <p className="text-xs text-[#7C786E] leading-relaxed line-clamp-3">
                        {event.description}
                      </p>
                    </div>

                    {/* Metadata */}
                    <div className="space-y-4 pt-2">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-2 text-[#7C786E]">
                          <Calendar className="w-4 h-4 text-[#7C786E] shrink-0" />
                          <span className="truncate">{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#7C786E]">
                          <MapPin className="w-4 h-4 text-[#7C786E] shrink-0" />
                          <span className="truncate">{event.isOnline ? "Online" : event.location}</span>
                        </div>
                      </div>

                      {/* Deadline info */}
                      <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 bg-rose-500/5 border border-rose-500/10 px-3 py-1.5 rounded-xl shadow-inner mt-2">
                        <Clock className="w-4 h-4 text-rose-500 shrink-0" />
                        <span>Deadline: {event.deadline}</span>
                      </div>

                      {/* Tech stack badges */}
                      <div className="flex flex-wrap gap-1">
                        {event.skills.map((skill) => (
                          <span
                            key={skill}
                            className="text-[9px] font-semibold px-2 py-0.5 rounded-md bg-[#FAF9F5] border border-[#ECE9DF] text-[#4E4B42]"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      {/* Prize pool info */}
                      <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF9F5] border border-[#ECE9DF] shadow-sm">
                        <span className="text-[9px] text-[#7C786E] font-bold uppercase tracking-wider">Prize Pool</span>
                        <span className="text-sm font-black text-[#1E1D1A] flex items-center gap-1">
                          <DollarSign className="w-4 h-4 text-emerald-600" />
                          {event.prizePool}
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="pt-2 flex items-center gap-2">
                      <button
                        onClick={() => handleToggleTrack(event.id)}
                        className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 shadow-sm ${
                          isTracked
                            ? "bg-[#E5E2D6] text-[#7C786E] border border-[#ECE9DF] shadow-inner"
                            : "bg-[#2C2B27] text-white hover:bg-[#1E1D1A]"
                        }`}
                      >
                        {isTracked ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#7A6218]" />
                            Tracked
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            Add to Tracker
                          </>
                        )}
                      </button>

                      <a
                        href={event.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-white border border-[#ECE9DF] text-[#7C786E] hover:text-[#1E1D1A] hover:bg-[#FAF9F5] transition-colors shadow-sm"
                        title="Open Hackathon Application"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Tracker Timeline View */}
      <div className="border-t border-[#EFECE3] pt-10 space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold text-[#1E1D1A] tracking-tight flex items-center gap-2">
            <Clock className="w-6 h-6 text-[#2C2B27]" />
            My Hackathon Tracker
          </h2>
          <p className="text-[#7C786E] text-xs mt-1">
            Stay on top of deadlines, milestone deliveries, and interview scheduling for your active hackathons.
          </p>
        </div>

        {trackedHackathons.length === 0 ? (
          <div className="warm-card p-10 text-center text-[#7C786E] bg-white">
            <Clock className="w-10 h-10 text-[#7C786E] opacity-40 mx-auto mb-2" />
            <h3 className="font-bold text-[#1E1D1A] text-sm">No tracked hackathons yet</h3>
            <p className="text-xs text-[#7C786E] max-w-sm mx-auto mt-1">
              Track hackathons using the "Add to Tracker" button above to map your preparation milestones.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar selection of tracked events */}
            <div className="lg:col-span-4 space-y-2">
              <span className="block text-[9px] text-[#7C786E] font-bold uppercase tracking-wider px-2 mb-2">Tracked Events ({trackedHackathons.length})</span>
              <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                {trackedHackathons.map((h) => {
                  const isActive = h.id === activeTrackerId;
                  return (
                    <div
                      key={h.id}
                      onClick={() => setActiveTrackerId(h.id)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center justify-between shadow-sm ${
                        isActive
                          ? "bg-[#FAF9F5] border-[#F5C451] text-[#1E1D1A]"
                          : "bg-white border-[#ECE9DF] text-[#7C786E] hover:text-[#1E1D1A] hover:bg-[#FAF9F5]"
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <span className="block text-[9px] text-[#7C786E] uppercase font-semibold">{h.hosts}</span>
                        <h4 className="font-bold text-[#1E1D1A] text-sm truncate mt-0.5">{h.title}</h4>
                        <div className="flex items-center gap-1.5 mt-1 text-[10px] text-[#7C786E] font-medium">
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            h.timelineState === "team_formation" ? "bg-amber-500 animate-pulse" :
                            h.timelineState === "registration" ? "bg-blue-500 animate-pulse" :
                            h.timelineState === "submission" ? "bg-purple-500 animate-pulse" : "bg-emerald-500"
                          }`} />
                          <span className="capitalize">{h.timelineState.replace("_", " ")}</span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleTrack(h.id);
                        }}
                        className="p-2 text-[#7C786E] hover:text-rose-600 transition-colors"
                        title="Stop Tracking"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Active event timeline dashboard */}
            {activeTrackedEvent && (
              <div className="lg:col-span-8 warm-card p-6 md:p-8 space-y-6 bg-white">
                {/* Event header inside tracker */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EFECE3] pb-6">
                  <div>
                    <span className="text-[9px] text-[#7C786E] font-bold uppercase tracking-wider">Tracking Milestone Roadmap</span>
                    <h3 className="text-xl font-bold text-[#1E1D1A] mt-1 leading-tight">{activeTrackedEvent.title}</h3>
                    <p className="text-xs text-[#7C786E] mt-1 flex items-center gap-1">
                      Hosted by {activeTrackedEvent.hosts} •
                      <MapPin className="w-3.5 h-3.5 text-[#7C786E] inline mx-0.5" />
                      {activeTrackedEvent.isOnline ? "Online" : activeTrackedEvent.location}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-[#FAF9F5] border border-[#ECE9DF] text-[10px] text-[#4E4B42] font-semibold uppercase flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#7A6218]" />
                      {activeTrackedEvent.participants} Teams
                    </span>
                    <button className="py-1.5 px-4 rounded-xl bg-[#2C2B27] text-white hover:bg-[#1E1D1A] font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer">
                      <span>View Brief</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Timeline Grid */}
                <div className="space-y-8 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-[2px] before:bg-[#EFECE3]">
                  {getTimelineSteps(activeTrackedEvent).map((step, idx) => (
                    <div key={step.key} className="flex gap-4 relative group">
                      {/* Step Indicator */}
                      <div className="relative z-10 shrink-0">
                        {step.status === "completed" ? (
                          <div className="w-9 h-9 rounded-full bg-emerald-100 border-2 border-emerald-600 flex items-center justify-center text-emerald-700">
                            <Check className="w-4 h-4 stroke-[3]" />
                          </div>
                        ) : step.status === "current" ? (
                          <div className="w-9 h-9 rounded-full bg-[#FAF4D8] border-2 border-[#F5C451] flex items-center justify-center text-[#7A6218] shadow-[0_0_15px_rgba(245,196,81,0.2)] animate-pulse">
                            <Clock className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-white border-2 border-[#ECE9DF] flex items-center justify-center text-[#7C786E]">
                            <span className="text-xs font-bold">{idx + 1}</span>
                          </div>
                        )}
                      </div>

                      {/* Content block */}
                      <div className="flex-1 p-4 rounded-2xl bg-[#FAF9F5] border border-[#ECE9DF] group-hover:border-[#F5C451] transition-colors flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-[#1E1D1A]">
                              {step.label}
                            </h4>
                            {step.status === "current" && (
                              <span className="px-2 py-0.5 rounded bg-[#FAF4D8] border border-[#E8DFB3] text-[8px] text-[#7A6218] font-bold uppercase tracking-wider">
                                Active Step
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#7C786E] mt-1 leading-relaxed max-w-lg">
                            {step.description}
                          </p>
                        </div>

                        <div className="sm:text-right shrink-0">
                          <span className={`block text-[9px] font-bold uppercase tracking-wider ${
                            step.status === "completed" ? "text-emerald-700" :
                            step.status === "current" ? "text-[#7A6218] animate-pulse" : "text-[#7C786E]"
                          }`}>
                            {step.status === "completed" ? "Done" : step.status === "current" ? "Action Needed" : "Locked"}
                          </span>
                          <span className="block text-[10px] text-[#7C786E] font-semibold mt-0.5">
                            {step.key === "registration" ? activeTrackedEvent.deadline : step.date}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
