"use client";

import React, { useState, useMemo } from "react";
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
      timelineState: "team_formation"
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
      timelineState: "registration"
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
      timelineState: "team_formation"
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
      timelineState: "submission"
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
      timelineState: "judging"
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
      timelineState: "registration"
    }
  ];

  // Active filters and tracking states
  const [filter, setFilter] = useState<"All" | "Near Me" | "Online" | "Matched">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [trackedIds, setTrackedIds] = useState<string[]>(["hack-1", "hack-2", "hack-4"]);
  const [activeTrackerId, setActiveTrackerId] = useState<string>("hack-1");

  // Filtering Logic
  const filteredHackathons = useMemo(() => {
    return initialHackathons.filter((event) => {
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
  }, [filter, searchQuery]);

  // Tracked Hackathons details
  const trackedHackathons = useMemo(() => {
    return initialHackathons.filter((h) => trackedIds.includes(h.id));
  }, [trackedIds]);

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
    <div className="space-y-12 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Trophy className="w-10 h-10 text-pink-500" />
            Hackathon Radar
          </h1>
          <p className="text-zinc-400 text-sm mt-2 max-w-xl">
            Discover, track, and win global coding events. Match your tech stack with official sponsor briefs and secure fast-tracked placements.
          </p>
        </div>

        {/* Quick Stats banner */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
          <div className="text-center px-4 border-r border-white/10">
            <span className="block text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Active Events</span>
            <span className="text-2xl font-black text-white">{initialHackathons.length}</span>
          </div>
          <div className="text-center px-4 border-r border-white/10">
            <span className="block text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Tracked</span>
            <span className="text-2xl font-black text-pink-500">{trackedIds.length}</span>
          </div>
          <div className="text-center px-4">
            <span className="block text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Total Prizes</span>
            <span className="text-2xl font-black text-purple-400">$530k</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar (Sticky) */}
      <div className="sticky top-0 z-20 py-4 bg-[#050505]/95 backdrop-blur-md border-b border-white/5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by tech stack, hosts, or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-full bg-white/5 border border-white/5 focus:outline-none focus:border-pink-500/50 text-sm text-white placeholder-zinc-500 transition-colors"
          />
        </div>

        {/* Filters pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <Filter className="w-4 h-4 text-zinc-500 mr-2 shrink-0 hidden sm:block" />
          {(["All", "Near Me", "Online", "Matched"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 whitespace-nowrap cursor-pointer ${
                filter === tab
                  ? "bg-white text-black shadow-lg"
                  : "bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 border border-white/5"
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
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            Discover Coding Events ({filteredHackathons.length})
          </h2>
        </div>

        {filteredHackathons.length === 0 ? (
          <div className="glass-panel rounded-3xl p-12 text-center text-zinc-500 space-y-4">
            <Trophy className="w-12 h-12 text-zinc-700 mx-auto" />
            <h3 className="text-lg font-bold text-zinc-400">No hackathons found</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
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
                  className="glass-panel rounded-3xl overflow-hidden flex flex-col justify-between hover:border-pink-500/35 transition-all duration-300 group"
                >
                  {/* Subtle Gradient Event Banner */}
                  <div className={`h-24 bg-gradient-to-r ${event.bannerGradient} relative p-4 flex flex-col justify-between`}>
                    {/* Glass Overlay for depth */}
                    <div className="absolute inset-0 bg-black/10 backdrop-brightness-95 pointer-events-none" />
                    
                    <div className="relative z-10 flex justify-between items-start">
                      <span className="px-2.5 py-0.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[10px] text-white font-bold uppercase tracking-wider">
                        {event.category}
                      </span>
                      
                      {event.isMatched && (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/25 backdrop-blur-md border border-emerald-400/20 text-[10px] text-emerald-300 font-bold uppercase tracking-wider flex items-center gap-1">
                          <Check className="w-3 h-3" /> Skill Match
                        </span>
                      )}
                    </div>

                    <div className="relative z-10">
                      <span className="text-[10px] text-white/70 font-semibold uppercase">{event.hosts}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                    <div className="space-y-3">
                      <h3 className="text-xl font-bold text-white group-hover:text-pink-400 transition-colors tracking-tight leading-snug">
                        {event.title}
                      </h3>

                      <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
                        {event.description}
                      </p>
                    </div>

                    {/* Metadata */}
                    <div className="space-y-4 pt-2">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-2 text-zinc-400">
                          <Calendar className="w-4 h-4 text-pink-500 shrink-0" />
                          <span className="truncate">{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-400">
                          <MapPin className="w-4 h-4 text-purple-500 shrink-0" />
                          <span className="truncate">{event.isOnline ? "Online" : event.location}</span>
                        </div>
                      </div>

                      {/* Tech stack badges */}
                      <div className="flex flex-wrap gap-1">
                        {event.skills.map((skill) => (
                          <span
                            key={skill}
                            className="text-[9px] font-semibold px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-zinc-300"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      {/* Prize pool info */}
                      <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                        <span className="text-[10px] text-zinc-500 font-bold uppercase">Prize Pool</span>
                        <span className="text-sm font-black text-white flex items-center gap-1">
                          <DollarSign className="w-4 h-4 text-emerald-400" />
                          {event.prizePool}
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="pt-2 flex items-center gap-2">
                      <button
                        onClick={() => handleToggleTrack(event.id)}
                        className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 ${
                          isTracked
                            ? "bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-750"
                            : "bg-white text-black hover:bg-zinc-200"
                        }`}
                      >
                        {isTracked ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-pink-500" />
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
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                        title="View Event Details"
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
      <div className="border-t border-white/5 pt-12 space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Clock className="w-6 h-6 text-pink-500" />
            My Hackathon Tracker
          </h2>
          <p className="text-zinc-400 text-xs mt-1">
            Stay on top of deadlines, milestone deliveries, and interview scheduling for your active hackathons.
          </p>
        </div>

        {trackedHackathons.length === 0 ? (
          <div className="glass-panel rounded-3xl p-10 text-center text-zinc-500 space-y-4">
            <Clock className="w-10 h-10 text-zinc-700 mx-auto" />
            <h3 className="font-bold text-zinc-400 text-sm">No tracked hackathons yet</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Track hackathons using the "Add to Tracker" button above to map your preparation milestones.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar selection of tracked events */}
            <div className="lg:col-span-4 space-y-2">
              <span className="block text-[10px] text-zinc-500 font-bold uppercase tracking-wider px-2 mb-2">Tracked Events ({trackedHackathons.length})</span>
              <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                {trackedHackathons.map((h) => {
                  const isActive = h.id === activeTrackerId;
                  return (
                    <div
                      key={h.id}
                      onClick={() => setActiveTrackerId(h.id)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center justify-between ${
                        isActive
                          ? "bg-white/10 border-pink-500/50 shadow-lg shadow-pink-500/5"
                          : "bg-white/5 border-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <span className="block text-[9px] text-zinc-500 uppercase font-semibold">{h.hosts}</span>
                        <h4 className="font-bold text-white text-sm truncate mt-0.5">{h.title}</h4>
                        <div className="flex items-center gap-1.5 mt-1 text-[10px] text-zinc-400">
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            h.timelineState === "team_formation" ? "bg-amber-400 animate-pulse" :
                            h.timelineState === "registration" ? "bg-blue-400 animate-pulse" :
                            h.timelineState === "submission" ? "bg-purple-400 animate-pulse" : "bg-emerald-400"
                          }`} />
                          <span className="capitalize">{h.timelineState.replace("_", " ")}</span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleTrack(h.id);
                        }}
                        className="p-2 text-zinc-500 hover:text-red-400 transition-colors"
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
              <div className="lg:col-span-8 glass-panel rounded-3xl p-6 md:p-8 space-y-6">
                {/* Event header inside tracker */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
                  <div>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Tracking Milestone Roadmap</span>
                    <h3 className="text-xl font-bold text-white mt-1 leading-tight">{activeTrackedEvent.title}</h3>
                    <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1">
                      Hosted by {activeTrackedEvent.hosts} •
                      <MapPin className="w-3.5 h-3.5 text-purple-400 inline mx-0.5" />
                      {activeTrackedEvent.isOnline ? "Online" : activeTrackedEvent.location}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] text-zinc-300 font-semibold uppercase flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-pink-400" />
                      {activeTrackedEvent.participants} Teams
                    </span>
                    <button className="py-1.5 px-4 rounded-xl bg-white text-black hover:bg-zinc-200 font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer">
                      <span>View Brief</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Timeline Grid */}
                <div className="space-y-8 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-[2px] before:bg-white/5">
                  {getTimelineSteps(activeTrackedEvent).map((step, idx) => (
                    <div key={step.key} className="flex gap-4 relative group">
                      {/* Step Indicator */}
                      <div className="relative z-10 shrink-0">
                        {step.status === "completed" ? (
                          <div className="w-9 h-9 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        ) : step.status === "current" ? (
                          <div className="w-9 h-9 rounded-full bg-pink-500/20 border-2 border-pink-500 flex items-center justify-center text-pink-400 shadow-[0_0_15px_rgba(244,63,94,0.3)] animate-pulse">
                            <Clock className="w-4 h-4 animate-spin-slow" />
                          </div>
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-zinc-900 border-2 border-zinc-700 flex items-center justify-center text-zinc-500">
                            <span className="text-xs font-bold">{idx + 1}</span>
                          </div>
                        )}
                      </div>

                      {/* Content block */}
                      <div className="flex-1 p-4 rounded-2xl bg-white/5 border border-white/5 group-hover:border-white/10 transition-colors flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className={`font-bold text-sm ${step.status === "completed" ? "text-zinc-300" : "text-white"}`}>
                              {step.label}
                            </h4>
                            {step.status === "current" && (
                              <span className="px-2 py-0.5 rounded bg-pink-500/10 border border-pink-500/20 text-[8px] text-pink-400 font-bold uppercase tracking-wider">
                                Active Step
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-zinc-400 mt-1 leading-relaxed max-w-lg">
                            {step.description}
                          </p>
                        </div>

                        <div className="sm:text-right shrink-0">
                          <span className={`block text-[9px] font-bold uppercase tracking-wider ${
                            step.status === "completed" ? "text-emerald-400" :
                            step.status === "current" ? "text-pink-400 animate-pulse" : "text-zinc-500"
                          }`}>
                            {step.status === "completed" ? "Done" : step.status === "current" ? "Action Needed" : "Locked"}
                          </span>
                          <span className="block text-[10px] text-zinc-400 font-semibold mt-0.5">
                            {step.date}
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
