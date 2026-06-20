"use client";

import React, { useState, useEffect } from "react";
import { 
  Trophy, 
  Code, 
  MessageSquare, 
  Briefcase, 
  Sparkles, 
  Play, 
  Pause,
  CheckCircle2, 
  Calendar, 
  ChevronRight,
  TrendingUp,
  Clock,
  Mic,
  Award,
  ExternalLink,
  ChevronDown,
  ArrowUpRight,
  Check,
  MoreHorizontal,
  Laptop
} from "lucide-react";

export default function Dashboard() {
  const [score, setScore] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [commTimer, setCommTimer] = useState(300); // 5 mins
  const [expandedAccordion, setExpandedAccordion] = useState("resume");

  // State-driven agenda checklist to allow interactive toggles
  const [agendaItems, setAgendaItems] = useState([
    { id: 1, text: "Solve 'Reverse Nodes in k-Group' (DSA recursion priority)", done: false, category: "dsa", time: "Sep 19, 08:30" },
    { id: 2, text: "Complete 'Behavioral Conflict Resolution' speech task", done: false, category: "comm", time: "Sep 19, 10:30" },
    { id: 3, text: "Review resume guidelines for Stripe Internship Application", done: true, category: "internships", time: "Sep 19, 13:00" },
    { id: 4, text: "Apply for Vercel Frontend Engineer Intern", done: true, category: "internships", time: "Sep 19, 14:45" },
    { id: 5, text: "Google STEP Intern Shortlist Next Step Form", done: false, category: "internships", time: "Sep 19, 16:30" }
  ]);

  const toggleAgendaItem = (id: number) => {
    setAgendaItems(prev =>
      prev.map(item => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const completedTasksCount = agendaItems.filter(item => item.done).length;

  // Animate Placement Score on load
  useEffect(() => {
    const targetScore = 820;
    const duration = 1500; // ms
    const stepTime = 15;
    const steps = duration / stepTime;
    const increment = targetScore / steps;
    let currentScore = 0;

    const timer = setInterval(() => {
      currentScore += increment;
      if (currentScore >= targetScore) {
        setScore(targetScore);
        clearInterval(timer);
      } else {
        setScore(Math.floor(currentScore));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, []);

  // Communication timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording && commTimer > 0) {
      interval = setInterval(() => {
        setCommTimer((prev) => prev - 1);
      }, 1000);
    } else if (commTimer === 0) {
      setIsRecording(false);
    }
    return () => clearInterval(interval);
  }, [isRecording, commTimer]);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleSpeechToggle = () => {
    if (isRecording) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
      setCommTimer(300); // reset to 5 mins
    }
  };

  // Mock Data
  const applications = [
    { company: "Stripe", role: "Software Engineer Intern", status: "Interviewing", color: "bg-[#FAF9F5] text-[#1E1D1A] border-[#ECE9DF]" },
    { company: "Vercel", role: "Frontend Engineer Intern", status: "Applied", color: "bg-[#FAF9F5] text-[#1E1D1A] border-[#ECE9DF]" },
    { company: "Google", role: "STEP Intern", status: "Shortlisted", color: "bg-[#2C2B27] text-white border-[#2C2B27]" },
  ];

  const hackathons = [
    { name: "AI Innovation Hack", starts: "In 3 days", prize: "$10,000", hosts: "PinkyPow × Vercel" },
    { name: "Global Placement Hackathon", starts: "In 12 days", prize: "Direct Interview", hosts: "Y Combinator" },
  ];

  const dsaProblem = {
    title: "Reverse Nodes in k-Group",
    difficulty: "Hard",
    avgTime: "45 mins",
    topic: "Linked List, Recursion",
    acceptance: "54.8%"
  };

  const speechPrompt = "Describe a challenging technical project you built recently. Explain the architecture, hurdles, and resolutions.";

  // Custom study progress stats
  const weeklyStats = [
    { day: "S", hours: 2.0, height: "35%" },
    { day: "M", hours: 4.2, height: "65%" },
    { day: "T", hours: 3.0, height: "50%" },
    { day: "W", hours: 4.8, height: "75%" },
    { day: "T", hours: 2.5, height: "40%" },
    { day: "F", hours: 6.1, height: "90%", active: true, label: "5h 23m" },
    { day: "S", hours: 1.5, height: "20%" },
  ];

  // Circular progress stroke calculation for communication timer (radius = 40, circumference = 2 * pi * 40 = 251.3)
  const timerCircumference = 251.3;
  const timerStrokeDashoffset = timerCircumference - (timerCircumference * (commTimer / 300));

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-[1360px] mx-auto pb-12 text-[#1E1D1A]">
      
      {/* HEADER SECTION (Title, Progress Pills, Stats Counter) */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-2 border-b border-[#EFECE3]">
        <div className="space-y-4">
          {/* Welcome Title */}
          <h1 className="text-4xl md:text-5xl font-normal text-[#1E1D1A] tracking-tight">
            Welcome in, Raja <span className="inline-block animate-wave origin-[70%_70%] text-3xl md:text-4xl">👋</span>
          </h1>
          
          {/* Progress bar pills (similar to Interviews 15%, Hired 15%, etc.) */}
          <div className="flex flex-wrap items-center gap-3">
            {/* DSA progress pill (striped progress representation) */}
            <div className="h-9 px-4 rounded-full flex items-center justify-between text-xs font-medium border border-[#ECE9DF] relative overflow-hidden bg-white/40 text-[#4E4B42] w-[145px] cursor-default">
              <div className="absolute left-0 top-0 bottom-0 progress-stripe bg-[#ECE9DF] opacity-45" style={{ width: "60%" }} />
              <span className="relative z-10">DSA Progress</span>
              <span className="relative z-10 font-bold">60%</span>
            </div>

            {/* Comm Prep progress pill (yellow progress representation) */}
            <div className="h-9 px-4 rounded-full flex items-center justify-between text-xs font-semibold relative overflow-hidden bg-[#FAF4D8] border border-[#E8DFB3] text-[#7A6218] w-[125px] cursor-default">
              <div className="absolute left-0 top-0 bottom-0 bg-[#F5C451]" style={{ width: "15%" }} />
              <span className="relative z-10">Comm Prep</span>
              <span className="relative z-10 font-bold">15%</span>
            </div>

            {/* Application success progress pill (dark progress representation) */}
            <div className="h-9 px-4 rounded-full flex items-center justify-between text-xs font-semibold relative overflow-hidden bg-[#2C2B27] text-white border border-[#1E1D1A] w-[130px] cursor-default">
              <div className="absolute left-0 top-0 bottom-0 bg-[#1E1D1A]" style={{ width: "15%" }} />
              <span className="relative z-10">Applications</span>
              <span className="relative z-10 font-bold">15%</span>
            </div>

            {/* Output progress pill (hollow progress representation) */}
            <div className="h-9 px-4 rounded-full flex items-center justify-between text-xs font-medium border border-[#ECE9DF] bg-transparent text-[#7C786E] w-[95px] cursor-default">
              <span>Roadmap</span>
              <span className="font-bold">10%</span>
            </div>
          </div>
        </div>

        {/* Top-Right Statistics Counters (78 Employee, 56 Hirings style) */}
        <div className="flex items-center gap-8 md:gap-12 shrink-0">
          {/* Score Counter */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FAF9F5] border border-[#EFECE3] flex items-center justify-center text-[#7C786E]">
              <Trophy className="w-5 h-5 text-[#F5C451]" />
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-light text-[#1E1D1A] tracking-tight">{score}</div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-[#7C786E] mt-0.5">Placement Score</div>
            </div>
          </div>

          {/* Percentile Counter */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FAF9F5] border border-[#EFECE3] flex items-center justify-center text-[#7C786E]">
              <TrendingUp className="w-5 h-5 text-[#2C2B27]" />
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-light text-[#1E1D1A] tracking-tight">18%</div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-[#7C786E] mt-0.5">Percentile Rank</div>
            </div>
          </div>

          {/* Projects/Apps Counter */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FAF9F5] border border-[#EFECE3] flex items-center justify-center text-[#7C786E]">
              <Briefcase className="w-5 h-5 text-[#2C2B27]" />
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-light text-[#1E1D1A] tracking-tight">3</div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-[#7C786E] mt-0.5">Active Pipelines</div>
            </div>
          </div>
        </div>
      </div>

      {/* TWO-COLUMN BENTO GRID SYSTEM */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        
        {/* ================= LEFT COLUMN (MAIN PANELS - 8 COLS) ================= */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Top row - Progress and Timer details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Progress Card (Study Hours Chart) */}
            <div className="warm-card p-8 flex flex-col justify-between min-h-[240px] h-full relative">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-bold text-[#1E1D1A]">Progress</h3>
                  <div className="mt-2.5 flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-[#1E1D1A] tracking-tight">6.1 h</span>
                    <span className="text-[10px] font-bold text-[#7C786E] uppercase">Study Time</span>
                  </div>
                  <p className="text-[11px] text-[#7C786E] font-medium mt-1">Work Time this week</p>
                </div>
                
                {/* Diagonal Arrow link button */}
                <a href="/dsa" className="w-8 h-8 rounded-full bg-white border border-[#ECE9DF] flex items-center justify-center text-[#1E1D1A] hover:bg-[#FAF9F5] transition-all shadow-sm">
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>

              {/* Weekly bar chart */}
              <div className="pt-4">
                {/* Bars Container */}
                <div className="relative flex items-end justify-between h-16 px-1" style={{ height: "64px" }}>
                  {weeklyStats.map((item, index) => (
                    <div key={index} className="flex flex-col justify-end items-center flex-1 h-full relative group cursor-pointer">
                      {/* Tooltip bubble on active / hovered bar */}
                      {item.active && (
                        <div className="absolute -top-7 px-2 py-0.5 bg-[#FAF4D8] border border-[#E8DFB3] text-[#7A6218] text-[9px] font-bold rounded-md whitespace-nowrap shadow-sm animate-bounce">
                          {item.label}
                        </div>
                      )}
                      
                      {/* Vertical Pill Bar */}
                      <div 
                        className={`w-2.5 rounded-full transition-all duration-300 ${
                          item.active ? "bg-[#F5C451]" : "bg-[#2C2B27] group-hover:bg-[#1E1D1A]"
                        }`}
                        style={{ height: item.height }}
                      />
                    </div>
                  ))}
                </div>

                {/* Day labels row */}
                <div className="flex justify-between px-1 mt-2 text-[10px] font-bold text-[#7C786E]">
                  {weeklyStats.map((item, index) => (
                    <span key={index} className="flex-1 text-center">{item.day}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Time Tracker Card (Communication Speech Practice) */}
            <div className="warm-card p-8 flex flex-col justify-between min-h-[240px] h-full relative">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-bold text-[#1E1D1A]">Time tracker</h3>
                  <p className="text-[11px] text-[#7C786E] font-medium mt-1">Speech task countdown</p>
                </div>
                
                {/* Diagonal Arrow Link */}
                <a href="/communication" className="w-8 h-8 rounded-full bg-white border border-[#ECE9DF] flex items-center justify-center text-[#1E1D1A] hover:bg-[#FAF9F5] transition-all shadow-sm">
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>

              {/* Circular Gauge Timer representation */}
              <div className="flex items-center justify-center my-1.5 gap-6">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle 
                      cx="48" 
                      cy="48" 
                      r="40" 
                      className="stroke-[#FAF9F5]" 
                      strokeWidth="5.5" 
                      fill="transparent" 
                    />
                    <circle 
                      cx="48" 
                      cy="48" 
                      r="40" 
                      className="stroke-[#F5C451] transition-all duration-1000 ease-out" 
                      strokeWidth="5.5" 
                      fill="transparent" 
                      strokeDasharray={timerCircumference} 
                      strokeDashoffset={timerStrokeDashoffset}
                      strokeLinecap="round"
                    />
                  </svg>
                  
                  {/* Inside timer state values */}
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-lg font-bold text-[#1E1D1A] tracking-tight">{formatTimer(commTimer)}</span>
                    <span className="text-[8px] uppercase font-bold text-[#7C786E] tracking-wider -mt-0.5">Remaining</span>
                  </div>
                </div>

                {/* Control Action Buttons */}
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={handleSpeechToggle} 
                    className="w-9 h-9 rounded-full bg-[#2C2B27] hover:bg-[#1E1D1A] text-white flex items-center justify-center shadow-sm cursor-pointer transition-colors"
                  >
                    {isRecording ? <Pause className="w-4 h-4 text-[#F5C451]" /> : <Play className="w-4 h-4 fill-white text-white ml-0.5" />}
                  </button>
                  
                  <button 
                    className="w-9 h-9 rounded-full bg-[#FAF9F5] border border-[#ECE9DF] hover:bg-white text-[#2C2B27] flex items-center justify-center shadow-sm"
                    title={speechPrompt}
                  >
                    <Clock className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Prompt preview status or Voice waves */}
              <div className="text-center">
                {isRecording ? (
                  <div className="flex items-center justify-center gap-0.5 h-4">
                    {[...Array(8)].map((_, i) => (
                      <div 
                        key={i} 
                        className="w-0.5 bg-[#2C2B27] rounded-full animate-wave-bar" 
                        style={{
                          height: `${Math.floor(Math.random() * 12) + 4}px`,
                          animationDelay: `${i * 0.08}s`
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] text-[#7C786E] font-medium italic line-clamp-2 text-center max-w-[280px] mx-auto">
                    "{speechPrompt}"
                  </p>
                )}
              </div>
            </div>

          </div>

          {/* Placement Schedule Weekly Calendar (September 2024 style) */}
          <div className="warm-card p-8 space-y-6 overflow-hidden">
            
            {/* Header with Monthly Navigation slider */}
            <div className="flex items-center justify-between px-1">
              <button className="px-3 py-1 text-xs font-bold text-[#7C786E] hover:text-[#1E1D1A] hover:bg-[#FAF9F5] rounded-full transition-all border border-transparent hover:border-[#ECE9DF]">
                Previous
              </button>
              <h3 className="text-sm font-bold text-[#1E1D1A] tracking-wide">June 2026</h3>
              <button className="px-3 py-1 text-xs font-bold text-[#7C786E] hover:text-[#1E1D1A] hover:bg-[#FAF9F5] rounded-full transition-all border border-transparent hover:border-[#ECE9DF]">
                October
              </button>
            </div>

            {/* Calendar Layout */}
            <div className="space-y-4 relative">
              
              {/* Day headers */}
              <div className="grid grid-cols-[88px_1fr] text-center border-b border-[#EFECE3] pb-3">
                {/* Spacer to align with calendar grid area (72px time label w + 16px gap = 88px) */}
                <div />
                
                <div className="grid grid-cols-6">
                  {[
                    { day: "Mon", date: "22" },
                    { day: "Tue", date: "23" },
                    { day: "Wed", date: "24" },
                    { day: "Thu", date: "25" },
                    { day: "Fri", date: "26" },
                    { day: "Sat", date: "27" },
                  ].map((item, index) => (
                    <div key={index} className="flex flex-col items-center justify-center">
                      <span className="text-[10px] text-[#7C786E] font-semibold uppercase">{item.day}</span>
                      <span className={`text-sm font-bold mt-1 ${item.date === "23" ? "w-6 h-6 bg-[#F5C451] rounded-full flex items-center justify-center text-[#1E1D1A] shadow-sm" : "text-[#1E1D1A]"}`}>
                        {item.date}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Grid area with lines and absolute events */}
              <div className="flex gap-4 relative h-[220px] pt-1" style={{ height: "220px" }}>
                {/* Left Column: Time Labels */}
                <div className="flex flex-col justify-between text-xs font-semibold text-[#7C786E] w-[72px] shrink-0 text-right py-1">
                  <span className="whitespace-nowrap">08:30 am</span>
                  <span className="whitespace-nowrap">09:00 am</span>
                  <span className="whitespace-nowrap">10:00 am</span>
                  <span className="whitespace-nowrap">11:00 am</span>
                </div>

                {/* Right Column: Grid lines + overlaid events */}
                <div className="flex-1 relative flex flex-col justify-between py-1">
                  <div className="h-px border-t border-dashed border-[#EFECE3]" />
                  <div className="h-px border-t border-dashed border-[#EFECE3]" />
                  <div className="h-px border-t border-dashed border-[#EFECE3]" />
                  <div className="h-px border-t border-dashed border-[#EFECE3]" />

                  {/* EVENT 1: Mock Tech Interview */}
                  <div 
                    className="absolute bg-[#2C2B27] border border-[#1E1D1A] rounded-2xl p-3 shadow-md z-20 text-white flex items-center justify-between hover:scale-[1.01] transition-transform duration-200"
                    style={{ 
                      top: "0%", 
                      height: "60%", 
                      left: "33.33%", 
                      right: "33.33%" 
                    }}
                  >
                    <div className="min-w-0">
                      <h4 className="text-xs font-extrabold truncate">Mock Technical Interview</h4>
                      <p className="text-[10px] text-zinc-400 truncate mt-0.5">Discuss project highlights & speech coach targets</p>
                    </div>
                    {/* Overlapping avatars bubbles */}
                    <div className="flex -space-x-2 shrink-0 ml-3">
                      <div className="w-6 h-6 rounded-full bg-[#F5C451] text-[#1E1D1A] font-extrabold text-[9px] flex items-center justify-center border-2 border-[#2C2B27]">AI</div>
                      <div className="w-6 h-6 rounded-full bg-zinc-600 text-white font-extrabold text-[9px] flex items-center justify-center border-2 border-[#2C2B27]">RK</div>
                    </div>
                  </div>

                  {/* EVENT 2: Speech Session */}
                  <div 
                    className="absolute bg-white border border-[#ECE9DF] rounded-2xl p-3 shadow-sm z-20 text-[#1E1D1A] flex items-center justify-between hover:scale-[1.01] transition-transform duration-200"
                    style={{ 
                      top: "60%", 
                      height: "40%", 
                      left: "16.67%", 
                      right: "50%" 
                    }}
                  >
                    <div className="min-w-0">
                      <h4 className="text-xs font-extrabold truncate">Onboarding Speech Session</h4>
                      <p className="text-[10px] text-[#7C786E] truncate mt-0.5">Introduction for new candidates</p>
                    </div>
                    {/* Overlapping avatars bubbles */}
                    <div className="flex -space-x-2 shrink-0 ml-3">
                      <div className="w-6 h-6 rounded-full bg-zinc-200 text-zinc-800 font-extrabold text-[9px] flex items-center justify-center border-2 border-white">JD</div>
                      <div className="w-6 h-6 rounded-full bg-zinc-800 text-white font-extrabold text-[9px] flex items-center justify-center border-2 border-white">RK</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Hackathons & Certification Roadmap (Row 3) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Placement-Linked Hackathons */}
            <section className="warm-card p-8 flex flex-col justify-between md:col-span-7">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">

                    <h3 className="font-extrabold uppercase text-[#1E1D1A] tracking-tight">Placement-Linked Hackathons</h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FAF4D8] border border-[#E8DFB3] text-[#7A6218] font-bold text-[10px] uppercase">
                    Hot Opportunities
                  </span>
                </div>

                {/* Grid list of Hackathons */}
                <div className="grid grid-cols-1 gap-4">
                  {hackathons.map((hack) => (
                    <div key={hack.name} className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#ECE9DF] space-y-3 flex flex-col justify-between shadow-sm hover:border-[#F5C451] transition-all duration-200">
                      <div className="space-y-1">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-xs font-extrabold text-[#1E1D1A] leading-tight">{hack.name}</h4>
                          <span className="px-2 py-0.5 rounded-md bg-white border border-[#ECE9DF] text-[8px] font-bold text-[#7C786E] whitespace-nowrap">{hack.starts}</span>
                        </div>
                        <p className="text-[10px] text-[#7C786E] font-medium">Host: {hack.hosts}</p>
                      </div>

                      <div className="flex justify-between items-center pt-2.5 border-t border-[#EFECE3]">
                        <div>
                          <span className="block text-[8px] text-[#7C786E] uppercase font-bold tracking-wider">Reward</span>
                          <span className="text-xs font-black text-[#1E1D1A]">{hack.prize}</span>
                        </div>
                        <button className="p-1.5 rounded-lg bg-[#2C2B27] hover:bg-[#1E1D1A] text-[#F5C451] transition-all shadow-sm cursor-pointer">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3.5 border-t border-[#EFECE3] flex items-center justify-between text-[11px] text-[#7C786E] font-semibold">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F5C451]" />
                  Participate to secure direct interview pipelines with recruiters
                </span>
              </div>
            </section>

            {/* AI Certification Roadmap */}
            <section className="warm-card p-8 flex flex-col justify-between md:col-span-5">
              <div className="flex flex-col h-full justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="font-extrabold text-[#1E1D1A] uppercase tracking-tight">AI Certification Roadmap</h3>
                  </div>

                  {/* Progress track item 1 */}
                  <div className="space-y-4">
                    <div className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#ECE9DF] space-y-2.5 shadow-sm">
                      <div className="flex justify-between items-center gap-1">
                        <span className="text-xs font-bold text-[#1E1D1A] truncate">AWS Cloud Practitioner</span>
                        <span className="text-[8px] font-bold text-[#7A6218] bg-[#FAF4D8] px-1.5 py-0.5 rounded border border-[#E8DFB3] whitespace-nowrap">Rec.</span>
                      </div>
                      <div className="w-full bg-[#E5E2D6] rounded-full h-1.5">
                        <div className="bg-[#2C2B27] h-1.5 rounded-full transition-all duration-500" style={{ width: "40%" }}></div>
                      </div>
                      <p className="text-[9px] text-[#7C786E] font-semibold leading-relaxed">40% completion. Ideal for Cloud & DevOps prep tracks.</p>
                    </div>

                    {/* Progress track item 2 */}
                    <div className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#ECE9DF] space-y-2.5 shadow-sm">
                      <div className="flex justify-between items-center gap-1">
                        <span className="text-xs font-bold text-[#1E1D1A] truncate">Google ML Engineer</span>
                        <span className="text-[8px] font-bold text-[#7C786E] bg-[#FAF4D8] px-1.5 py-0.5 rounded border border-[#E8DFB3] whitespace-nowrap">Adv.</span>
                      </div>
                      <div className="w-full bg-[#E5E2D6] rounded-full h-1.5">
                        <div className="bg-[#2C2B27] h-1.5 rounded-full transition-all duration-500" style={{ width: "0%" }}></div>
                      </div>
                      <p className="text-[9px] text-[#7C786E] font-semibold leading-relaxed">Prerequisite: Calibrate Machine Learning skill level to 8+.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

          </div>

        </div>

        {/* ================= RIGHT COLUMN (SIDEBAR META - 4 COLS) ================= */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Profile Card (Lora Piterson style) */}
          <div className="profile-card relative aspect-[4/3] rounded-[28px] overflow-hidden border border-[#ECE9DF] shadow-md group">
            {/* Background profile image */}
            <img 
              src="/profile_avatar.png" 
              alt="Raja Kumaran" 
              className="absolute inset-0 w-full h-full object-cover grayscale-[10%] group-hover:scale-105 transition-transform duration-500" 
            />
            {/* Shadow overlay at bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
            
            {/* Floating glass pill ($1200 badge style) */}
            <div className="absolute bottom-5 right-5 px-3.5 py-1.5 rounded-full border border-white/20 bg-white/10 text-white text-xs font-semibold backdrop-blur-md shadow-sm">
              Score: {score}
            </div>

            {/* Profile info details */}
            <div className="absolute bottom-5 left-5 text-white space-y-0.5">
              <h2 className="text-xl font-bold tracking-tight text-white">Raja Kumaran</h2>
              <p className="text-xs text-zinc-300 font-medium">Software Engineer Track</p>
            </div>
          </div>

          {/* Accordion Menu Card (Pension contributions / Devices style) */}
          <div className="warm-card p-8 space-y-4">
            {/* Section 1: Resume */}
            <div className="space-y-3">
              <button 
                onClick={() => setExpandedAccordion(expandedAccordion === "resume" ? "" : "resume")}
                className="w-full flex items-center justify-between text-left group"
              >
                <span className="text-sm font-bold text-[#1E1D1A]">Resume & Portfolio</span>
                <ChevronDown className={`w-4 h-4 text-[#7C786E] transition-transform duration-300 ${expandedAccordion === "resume" ? "rotate-180" : ""}`} />
              </button>
              
              {expandedAccordion === "resume" && (
                <div className="pt-1.5 animate-in fade-in duration-200">
                  {/* Laptop/Mac style device detail layout */}
                  <div className="bg-[#FAF9F5] border border-[#ECE9DF] p-3.5 rounded-2xl flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-white border border-[#ECE9DF] text-[#2C2B27]">
                        <Laptop className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#1E1D1A]">Resume_SWE_2026</h4>
                        <p className="text-[10px] text-[#7C786E] font-medium mt-0.5">AI Reviewed • v2.4</p>
                      </div>
                    </div>
                    <button className="p-1.5 hover:bg-white rounded-lg text-[#7C786E] hover:text-[#1E1D1A] transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <hr className="border-[#EFECE3]" />

            {/* Section 2: Compensation Targets */}
            <div className="space-y-3">
              <button 
                onClick={() => setExpandedAccordion(expandedAccordion === "comp" ? "" : "comp")}
                className="w-full flex items-center justify-between text-left"
              >
                <span className="text-sm font-bold text-[#1E1D1A]">Compensation Targets</span>
                <ChevronDown className={`w-4 h-4 text-[#7C786E] transition-transform duration-300 ${expandedAccordion === "comp" ? "rotate-180" : ""}`} />
              </button>
              {expandedAccordion === "comp" && (
                <div className="text-xs text-[#7C786E] space-y-2 pt-1 animate-in fade-in duration-200">
                  <div className="flex justify-between font-medium">
                    <span>Base Salary (SWE):</span>
                    <span className="font-bold text-[#1E1D1A]">$120,000 - $145,000</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Target Equity:</span>
                    <span className="font-bold text-[#1E1D1A]">Stock Options Included</span>
                  </div>
                </div>
              )}
            </div>

            <hr className="border-[#EFECE3]" />

            {/* Section 3: Verified Skill Badges */}
            <div className="space-y-3">
              <button 
                onClick={() => setExpandedAccordion(expandedAccordion === "skills" ? "" : "skills")}
                className="w-full flex items-center justify-between text-left"
              >
                <span className="text-sm font-bold text-[#1E1D1A]">Verified Skills</span>
                <ChevronDown className={`w-4 h-4 text-[#7C786E] transition-transform duration-300 ${expandedAccordion === "skills" ? "rotate-180" : ""}`} />
              </button>
              {expandedAccordion === "skills" && (
                <div className="flex flex-wrap gap-1.5 pt-1.5 animate-in fade-in duration-200">
                  {["React/Next.js", "TypeScript", "Node.js", "Algorithms", "MongoDB"].map(skill => (
                    <span key={skill} className="px-2.5 py-1 bg-[#FAF9F5] border border-[#ECE9DF] text-[10px] font-bold text-[#4E4B42] rounded-lg">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <hr className="border-[#EFECE3]" />

            {/* Section 4: Platform Integrations */}
            <div className="space-y-3">
              <button 
                onClick={() => setExpandedAccordion(expandedAccordion === "integrations" ? "" : "integrations")}
                className="w-full flex items-center justify-between text-left"
              >
                <span className="text-sm font-bold text-[#1E1D1A]">Platform Integrations</span>
                <ChevronDown className={`w-4 h-4 text-[#7C786E] transition-transform duration-300 ${expandedAccordion === "integrations" ? "rotate-180" : ""}`} />
              </button>
              {expandedAccordion === "integrations" && (
                <div className="text-xs text-[#7C786E] space-y-2 pt-1 animate-in fade-in duration-200">
                  <div className="flex justify-between font-medium">
                    <span>LeetCode Scrape Sync:</span>
                    <span className="text-emerald-600 font-bold">Active</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>GitHub Commit Sync:</span>
                    <span className="text-emerald-600 font-bold">Active</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Calibration */}
          <div className="warm-card p-8 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase text-[#1E1D1A]">Calibration</h3>
              <span className="text-2xl font-light text-[#1E1D1A] tracking-tight">18%</span>
            </div>

            <div className="flex justify-between items-center text-[10px] text-[#7C786E] font-bold uppercase tracking-wider px-1">
              <span>Task</span>
              <span>Onboarding Progress</span>
            </div>

            {/* Calibration Multi-segment progress bar */}
            <div className="w-full bg-[#FAF9F5] border border-[#ECE9DF] h-8 rounded-xl flex overflow-hidden p-1 gap-1">
              <div 
                className="bg-[#F5C451] rounded-lg flex items-center justify-center text-[9px] font-bold text-[#7A6218] transition-all hover:opacity-90" 
                style={{ width: "40%" }}
                title="DSA component calibration completed"
              >
                DSA
              </div>

              <div 
                className="bg-[#2C2B27] rounded-lg flex items-center justify-center text-[9px] font-bold text-white transition-all hover:opacity-90" 
                style={{ width: "35%" }}
                title="Communication component calibration completed"
              >
                Comm
              </div>

              <div 
                className="bg-[#E5E2D6] rounded-lg flex items-center justify-center text-[9px] font-semibold text-[#7C786E] transition-all" 
                style={{ width: "25%" }}
                title="Certifications calibrations pending"
              >
                Certs
              </div>
            </div>
          </div>

          {/* Placement Task Checklist Card */}
          <div className="warm-card-dark p-8 text-white space-y-5 flex flex-col justify-between min-h-[380px]">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">Placement Task</h3>
                <span className="text-xl font-light text-zinc-300 tracking-tight">
                  {completedTasksCount}/{agendaItems.length}
                </span>
              </div>

              {/* Checklist list */}
              <div className="space-y-4">
                {agendaItems.map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => toggleAgendaItem(item.id)}
                    className="flex items-start gap-3.5 group cursor-pointer"
                  >
                    {/* Checkbox item */}
                    <div className={`mt-0.5 w-4.5 h-4.5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                      item.done 
                        ? "bg-[#F5C451] border-[#F5C451] text-[#1E1D1A]" 
                        : "border-zinc-500 hover:border-white text-transparent"
                    }`}>
                      {item.done && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>

                    {/* Task Title & Time Info */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold leading-normal transition-all duration-200 ${
                        item.done ? "text-zinc-500 line-through" : "text-white group-hover:text-zinc-200"
                      }`}>
                        {item.text}
                      </p>
                      <span className="block text-[9px] text-zinc-500 font-bold mt-1 tracking-wide">{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick reminder text */}
            <div className="pt-4 border-t border-zinc-800 text-[10px] text-zinc-500 font-semibold leading-relaxed">
              * Focus on hard DSA recursion and communication pitch formats to boost score.
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

