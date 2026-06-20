"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  Sparkles,
  Lock,
  Flame,
  CheckCircle,
  HelpCircle,
  Volume2,
  ChevronRight,
  TrendingUp,
  Award,
  BookOpen,
  Info,
  RotateCcw
} from "lucide-react";
import { useVoiceCoach } from "@/hooks/useVoiceCoach";

interface RoadmapDay {
  day: number;
  prompt: string;
  category: "Technical" | "Behavioral" | "System Design";
  score?: number;
  feedback?: string;
  status: "completed" | "active" | "locked";
  dateCompleted?: string;
}

export default function CommunicationCoach() {
  // Toggle between "New User" baseline flow and "Daily Standup" flow
  const [userMode, setUserMode] = useState<"new" | "returning">("new");

  // Streak states
  const [streakDays, setStreakDays] = useState(3); // 3 completed, today (Day 4) is active

  // Baseline states
  const [baselineState, setBaselineState] = useState<"idle" | "recording" | "analyzing" | "completed">("idle");
  const [baselineTimer, setBaselineTimer] = useState(120); // 2 minutes
  const baselineInterval = useRef<NodeJS.Timeout | null>(null);

  // Standup states
  const [standupState, setStandupState] = useState<"idle" | "recording" | "analyzing" | "completed">("idle");
  const [standupTimer, setStandupTimer] = useState(0); // count up to 05:00 (300s)
  const standupInterval = useRef<NodeJS.Timeout | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  // AI Evaluation states
  const [evaluationResult, setEvaluationResult] = useState<{
    vocabularyScore: number;
    grammarScore: number;
    confidenceEstimate: string;
    feedback: string;
    nextChallenge: string;
  } | null>(null);

  // Hook instantiation
  const {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
    speak,
    stopSpeaking
  } = useVoiceCoach();

  // 30-Day Roadmap Data
  const [roadmapDays, setRoadmapDays] = useState<RoadmapDay[]>([
    {
      day: 1,
      prompt: "Introduce yourself and walk through your technical background in 90 seconds.",
      category: "Behavioral",
      score: 88,
      feedback: "Strong introduction with great structure. Ensure you connect your internships more explicitly to business impact.",
      status: "completed",
      dateCompleted: "3 days ago"
    },
    {
      day: 2,
      prompt: "Explain the key differences between SQL and NoSQL database engines.",
      category: "Technical",
      score: 82,
      feedback: "Good clarification of ACID compliance. Try to use concrete examples of when SQL fails to scale write queries.",
      status: "completed",
      dateCompleted: "2 days ago"
    },
    {
      day: 3,
      prompt: "Describe a time you had a major disagreement with a peer. How did you resolve it?",
      category: "Behavioral",
      score: 91,
      feedback: "Outstanding application of the STAR method. High levels of empathy and conflict resolution demonstration.",
      status: "completed",
      dateCompleted: "Yesterday"
    },
    {
      day: 4,
      prompt: "Explain what an API is to a non-technical recruiter.",
      category: "Technical",
      status: "active"
    },
    // Generate the remaining 26 days as locked placeholders
    ...Array.from({ length: 26 }, (_, i): RoadmapDay => {
      const dayNum = i + 5;
      const categories: ("Technical" | "Behavioral" | "System Design")[] = ["Technical", "Behavioral", "System Design"];
      const prompts = [
        "Explain how HTTPS keeps data secure during transmission.",
        "How do you handle scope creep near a major project deadline?",
        "Walk through the design of a distributed URL shortener.",
        "What is garbage collection and how does it optimize memory?",
        "Describe your experience debugging a complex production issue."
      ];
      return {
        day: dayNum,
        prompt: prompts[i % prompts.length],
        category: categories[i % categories.length],
        status: "locked"
      };
    })
  ]);

  // Track currently inspected day in the roadmap details view
  const [selectedDayNum, setSelectedDayNum] = useState<number>(4);
  const selectedRoadmapDay = roadmapDays.find((d) => d.day === selectedDayNum) || roadmapDays[3];

  // Baseline Timer Loop
  useEffect(() => {
    if (baselineState === "recording") {
      baselineInterval.current = setInterval(() => {
        setBaselineTimer((t) => {
          if (t <= 1) {
            clearInterval(baselineInterval.current!);
            handleCompleteBaseline();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      if (baselineInterval.current) clearInterval(baselineInterval.current);
    }
    return () => {
      if (baselineInterval.current) clearInterval(baselineInterval.current);
    };
  }, [baselineState]);

  // Standup Timer Loop
  useEffect(() => {
    if (standupState === "recording") {
      standupInterval.current = setInterval(() => {
        setStandupTimer((t) => {
          if (t >= 300) {
            clearInterval(standupInterval.current!);
            handleStopRecording();
            return 300;
          }
          return t + 1;
        });
      }, 1000);
    } else {
      if (standupInterval.current) clearInterval(standupInterval.current);
    }
    return () => {
      if (standupInterval.current) clearInterval(standupInterval.current);
    };
  }, [standupState]);

  // Format seconds into MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remaining.toString().padStart(2, "0")}`;
  };

  // Baseline Flow Actions
  const handleStartBaseline = () => {
    resetTranscript();
    startListening();
    setBaselineState("recording");
    setBaselineTimer(120);
  };

  const handleCompleteBaseline = async () => {
    stopListening();
    setBaselineState("analyzing");

    // Give SpeechRecognition a small buffer to finish last chunk processing
    await new Promise((resolve) => setTimeout(resolve, 800));

    const finalTranscript = transcript || "I am demonstrating the PinkyPow AI speech evaluation system. The communication coach evaluates vocabulary, grammar, and delivery confidence.";

    try {
      const response = await fetch("/api/ai/evaluate-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcription: finalTranscript,
          promptQuestion: "Describe a technically complex feature you built. Why did you choose that solution?"
        })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setEvaluationResult(data);
      setBaselineState("completed");
      speak(data.feedback);

      // Transition user mode automatically
      setTimeout(() => {
        setUserMode("returning");
        setStreakDays(4);
        setRoadmapDays((prev) =>
          prev.map((d) =>
            d.day === 4
              ? {
                  ...d,
                  status: "completed",
                  score: Math.round((data.vocabularyScore * 10 + data.grammarScore * 10) / 2),
                  feedback: data.feedback,
                  dateCompleted: "Just Now"
                }
              : d.day === 5
              ? { ...d, status: "active" }
              : d
          )
        );
        setSelectedDayNum(4);
      }, 4000);
    } catch (error) {
      console.error("Baseline Speech Evaluation Error:", error);
      setBaselineState("idle");
    }
  };

  // Daily Standup Flow Actions
  const handleStartRecording = () => {
    resetTranscript();
    startListening();
    setStandupState("recording");
    setStandupTimer(0);
    setShowAnalysis(false);
  };

  const handleStopRecording = async () => {
    stopListening();
    setStandupState("analyzing");

    // Give SpeechRecognition a small buffer to finish last chunk processing
    await new Promise((resolve) => setTimeout(resolve, 800));

    const finalTranscript = transcript || "An API, or Application Programming Interface, acts as a messenger between two applications, allowing them to communicate and share data securely.";
    const currentPrompt = selectedRoadmapDay.prompt;

    try {
      const response = await fetch("/api/ai/evaluate-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcription: finalTranscript,
          promptQuestion: currentPrompt
        })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setEvaluationResult(data);
      setStandupState("completed");
      setShowAnalysis(true);
      speak(data.feedback);

      // Update roadmap list with dynamic standup results
      setRoadmapDays((prev) =>
        prev.map((d) =>
          d.day === selectedDayNum
            ? {
                ...d,
                status: "completed",
                score: Math.round((data.vocabularyScore * 10 + data.grammarScore * 10) / 2),
                feedback: data.feedback,
                dateCompleted: "Just Now"
              }
            : d.day === selectedDayNum + 1 && d.status === "locked"
            ? { ...d, status: "active", prompt: data.nextChallenge || d.prompt }
            : d
        )
      );
    } catch (error) {
      console.error("Standup Speech Evaluation Error:", error);
      setStandupState("idle");
    }
  };

  // Reset demo states
  const handleResetDemo = () => {
    setBaselineState("idle");
    setBaselineTimer(120);
    setStandupState("idle");
    setStandupTimer(0);
    setShowAnalysis(false);
    setUserMode("new");
    setRoadmapDays((prev) =>
      prev.map((d) => {
        if (d.day === 4) {
          return { ...d, status: "active", score: undefined, feedback: undefined, dateCompleted: undefined };
        }
        if (d.day >= 5) {
          return { ...d, status: "locked" };
        }
        return d;
      })
    );
    setSelectedDayNum(4);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-[1360px] mx-auto pb-12 text-[#1E1D1A]">
      {/* Waveform keyframe injections */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes wave-bounce {
          0%, 100% { transform: scaleY(0.25); }
          50% { transform: scaleY(1); }
        }
        .waveform-bar {
          transform-origin: center;
          animation: wave-bounce 1s ease-in-out infinite;
        }
      `}} />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-[#EFECE3] pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-normal text-[#1E1D1A] tracking-tight">AI Communication Coach</h1>
            <span className="px-3 py-1 rounded-full bg-[#FAF4D8] border border-[#E8DFB3] text-xs font-bold text-[#7A6218] flex items-center gap-1 shrink-0">
              <Flame className="w-4 h-4 fill-[#F5C451] text-[#F5C451]" />
              Streak: Day {streakDays} of 30
            </span>
          </div>
          <p className="text-[#7C786E] text-sm mt-2.5 max-w-xl">
            Calibrate your voice speed, tech terminology accuracy, and delivery tone. Receive instant grading scores on premium dashboard metrics.
          </p>
        </div>

        {/* Demo state controllers (Minimalist Pill Toggle) */}
        <div className="flex items-center gap-2 p-1 rounded-full bg-white border border-[#ECE9DF] shrink-0 self-start md:self-auto shadow-sm">
          <button
            onClick={() => setUserMode("new")}
            className={`px-4 py-1.5 rounded-full text-[11px] font-bold transition-all duration-300 cursor-pointer ${
              userMode === "new" ? "bg-[#2C2B27] text-white shadow-sm" : "text-[#7C786E] hover:text-[#1E1D1A]"
            }`}
          >
            Baseline Flow
          </button>
          <button
            onClick={() => setUserMode("returning")}
            className={`px-4 py-1.5 rounded-full text-[11px] font-bold transition-all duration-300 cursor-pointer ${
              userMode === "returning" ? "bg-[#2C2B27] text-white shadow-sm" : "text-[#7C786E] hover:text-[#1E1D1A]"
            }`}
          >
            Daily Standup
          </button>
          <button
            onClick={handleResetDemo}
            className="p-1.5 text-[#7C786E] hover:text-[#1E1D1A] transition-colors"
            title="Reset Mock State"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Panel Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Recording Interface / Baseline Card */}
        <div className="lg:col-span-8 space-y-8">
          {userMode === "new" ? (
            /* STATE 1: INITIAL BASELINE TEST */
            <div className="warm-card rounded-3xl p-8 text-center relative overflow-hidden flex flex-col justify-center items-center min-h-[480px] space-y-6 bg-white">
              {/* Background Glow Ring */}
              <div className="absolute w-72 h-72 rounded-full bg-[#F5C451]/5 blur-3xl -top-20 -left-20 pointer-events-none" />

              <div className="max-w-md mx-auto space-y-4 relative z-10">
                <div className="w-16 h-16 rounded-3xl bg-[#FAF9F5] border border-[#ECE9DF] flex items-center justify-center shadow-sm mx-auto text-[#1E1D1A]">
                  <Mic className="w-8 h-8" />
                </div>
                
                <h2 className="text-2xl font-bold text-[#1E1D1A] tracking-tight">
                  2-Minute Baseline Assessment
                </h2>
                
                <p className="text-xs text-[#7C786E] leading-relaxed">
                  Before unlocking your 30-day placement roadmap, take our calibration test. This establishes your verbal speed, grammatical baseline, and default confidence metrics.
                </p>
              </div>

              {/* State Machine for Baseline Assessment */}
              {baselineState === "idle" && (
                <button
                  onClick={handleStartBaseline}
                  className="px-8 py-3.5 rounded-full bg-[#2C2B27] text-white hover:bg-[#1E1D1A] font-extrabold text-sm transition-all duration-300 shadow-md cursor-pointer flex items-center gap-2 group hover:scale-[1.02]"
                >
                  Start Assessment
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              )}

              {baselineState === "recording" && (
                <div className="space-y-6 w-full max-w-sm relative z-10 animate-in fade-in zoom-in duration-300">
                  {/* Waveform simulation */}
                  <div className="flex justify-center items-center gap-1.5 h-16">
                    {Array.from({ length: 24 }).map((_, i) => {
                      const delays = [0.1, 0.4, 0.2, 0.6, 0.3, 0.5, 0.7, 0.2, 0.9, 0.1, 0.4, 0.8];
                      return (
                        <div
                          key={i}
                          className="w-1 bg-[#F5C451] rounded-full waveform-bar"
                          style={{
                            height: "40px",
                            animationDelay: `${delays[i % delays.length]}s`,
                            animationDuration: `${0.8 + delays[i % delays.length]}s`
                          }}
                        />
                      );
                    })}
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#ECE9DF] text-center shadow-sm">
                    <span className="block text-[9px] text-[#7C786E] font-bold uppercase tracking-wider">Calibration Prompt</span>
                    <p className="text-xs font-semibold text-[#1E1D1A] mt-1 italic">
                      "Describe a technically complex feature you built. Why did you choose that solution?"
                    </p>
                  </div>

                  {/* Real-time speech-to-text preview */}
                  <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#ECE9DF] text-left max-h-24 overflow-y-auto shadow-sm">
                    <span className="block text-[8px] text-[#7C786E] font-bold uppercase tracking-wider mb-1">Live Transcription</span>
                    <p className="text-xs text-[#1E1D1A] italic font-mono leading-relaxed">
                      {transcript || "Speak now to calibrate..."}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-[#EFECE3] pt-4">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                      </span>
                      <span className="text-xs font-bold text-[#7C786E]">{formatTime(baselineTimer)}</span>
                    </div>

                    <button
                      onClick={handleCompleteBaseline}
                      className="px-5 py-2 rounded-xl bg-red-50 border border-red-200 hover:bg-red-100 text-xs font-bold text-red-700 transition-all duration-300 cursor-pointer"
                    >
                      Stop & Grade
                    </button>
                  </div>
                </div>
              )}

              {baselineState === "analyzing" && (
                <div className="space-y-4 animate-pulse">
                  <div className="w-12 h-12 rounded-full bg-[#FAF4D8] border border-[#E8DFB3] flex items-center justify-center mx-auto text-[#7A6218] animate-spin">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="font-extrabold text-[#1E1D1A] text-sm">Grading baseline speech...</h3>
                  <p className="text-[10px] text-[#7C786E] max-w-xs mx-auto">Evaluating tone range, vocabulary density, grammatical errors, and structural logic.</p>
                </div>
              )}

              {baselineState === "completed" && (
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h3 className="font-extrabold text-[#1E1D1A] text-sm">Assessment Successful!</h3>
                  <p className="text-xs text-[#7C786E] max-w-xs mx-auto">
                    Your baseline is registered. Transitioning to your personalized 30-Day Technical Standup track.
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* STATE 2: DAILY 5-MINUTE STANDUP */
            <div className="space-y-6">
              {/* Daily Prompt agenda */}
              <div className="warm-card rounded-3xl p-6 relative overflow-hidden bg-white">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#F5C451]/5 rounded-full blur-2xl pointer-events-none" />
                
                <span className="text-[10px] text-[#7C786E] font-bold uppercase tracking-wider">Today's Standup Challenge</span>
                <h3 className="text-lg font-bold text-[#1E1D1A] mt-1">Explain what an API is to a non-technical recruiter.</h3>
                <p className="text-xs text-[#7C786E] mt-2 leading-relaxed">
                  Focus on simplifying technical concepts. Avoid engineering acronyms and use a real-world analogy to keep it accessible.
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="text-[9px] font-semibold px-2 py-0.5 rounded bg-[#FAF4D8] border border-[#E8DFB3] text-[#7A6218]">
                    Tech Explanation
                  </span>
                  <span className="text-[9px] font-semibold px-2 py-0.5 rounded bg-[#FAF9F5] border border-[#ECE9DF] text-[#7C786E]">
                    Limit: 5 minutes
                  </span>
                </div>
              </div>

              {/* Apple Voice Memos Style Recording Interface */}
              <div className="warm-card rounded-3xl p-8 flex flex-col items-center justify-center min-h-[280px] relative bg-white">
                
                {standupState === "recording" && (
                  <div className="absolute top-4 left-6 flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    <span className="text-[10px] font-bold text-[#7C786E] uppercase tracking-wider">Recording Response</span>
                  </div>
                )}

                <div className="text-center space-y-6 w-full">
                  {/* Waveform placeholder */}
                  <div className="h-16 flex items-center justify-center gap-1.5">
                    {standupState === "recording" ? (
                      Array.from({ length: 30 }).map((_, i) => {
                        const delays = [0.2, 0.5, 0.1, 0.7, 0.3, 0.6, 0.8, 0.3, 0.9, 0.2];
                        return (
                          <div
                            key={i}
                            className="w-1 bg-[#F5C451] rounded-full waveform-bar"
                            style={{
                              height: "36px",
                              animationDelay: `${delays[i % delays.length]}s`,
                              animationDuration: `${0.8 + delays[i % delays.length]}s`
                            }}
                          />
                        );
                      })
                    ) : (
                      <div className="flex items-center gap-1.5 w-full max-w-xs opacity-35 px-4">
                        <div className="h-0.5 flex-1 bg-[#ECE9DF]" />
                        <Volume2 className="w-4 h-4 text-[#7C786E] shrink-0" />
                        <div className="h-0.5 flex-1 bg-[#ECE9DF]" />
                      </div>
                    )}
                  </div>

                  {/* Real-time speech-to-text preview */}
                  {standupState === "recording" && (
                    <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#ECE9DF] text-left max-h-24 overflow-y-auto w-full max-w-md mx-auto shadow-sm">
                      <span className="block text-[8px] text-[#7C786E] font-bold uppercase tracking-wider mb-1">Live Transcription</span>
                      <p className="text-xs text-[#1E1D1A] italic font-mono leading-relaxed">
                        {transcript || "Listening to your response..."}
                      </p>
                    </div>
                  )}

                  {/* Timer Display */}
                  <div className="space-y-1">
                    <div className="text-4xl font-mono font-black text-[#1E1D1A] tracking-tight">
                      {formatTime(standupTimer)}
                    </div>
                    <div className="text-[10px] text-[#7C786E] font-bold uppercase tracking-wider">
                      Timer / Max 05:00
                    </div>
                  </div>

                  {/* Large Circle Button */}
                  <div className="flex justify-center items-center">
                    {standupState === "idle" && (
                      <button
                        onClick={handleStartRecording}
                        className="w-20 h-20 rounded-full border-4 border-[#ECE9DF] flex items-center justify-center bg-[#FAF9F5] hover:border-[#F5C451] hover:scale-105 transition-all duration-300 group cursor-pointer"
                      >
                        <div className="w-14 h-14 rounded-full bg-red-600 group-hover:bg-red-500 transition-colors shadow-sm" />
                      </button>
                    )}

                    {standupState === "recording" && (
                      <button
                        onClick={handleStopRecording}
                        className="w-20 h-20 rounded-full border-4 border-[#ECE9DF] flex items-center justify-center bg-[#FAF9F5] hover:border-red-500/40 hover:scale-105 transition-all duration-300 group cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded bg-red-500 shadow-sm" />
                      </button>
                    )}

                    {standupState === "analyzing" && (
                      <div className="w-20 h-20 rounded-full border-4 border-[#E8DFB3] flex items-center justify-center bg-[#FAF4D8] animate-spin">
                        <Sparkles className="w-6 h-6 text-[#7A6218]" />
                      </div>
                    )}

                    {standupState === "completed" && (
                      <button
                        onClick={handleStartRecording}
                        className="w-20 h-20 rounded-full border-4 border-[#ECE9DF] flex items-center justify-center bg-[#FAF9F5] hover:border-[#F5C451] hover:scale-105 transition-all duration-300 group cursor-pointer"
                      >
                        <div className="w-14 h-14 rounded-full bg-red-600 group-hover:bg-red-500 transition-colors shadow-sm" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: AI Analysis Diagnostic Panel */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="warm-card p-6 flex-1 flex flex-col justify-between bg-white">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#EFECE3]">
              <span className="text-[10px] text-[#7C786E] font-bold uppercase tracking-wider">AI Speech Diagnostics</span>
              <span className="px-2 py-0.5 rounded bg-[#FAF4D8] border border-[#E8DFB3] text-[8px] text-[#7A6218] font-bold uppercase tracking-wider">
                Instant Feed
              </span>
            </div>

            {/* Content states */}
            {standupState === "analyzing" ? (
              <div className="my-auto text-center py-12 space-y-4 animate-pulse">
                <div className="w-12 h-12 rounded-full bg-[#FAF4D8] border border-[#E8DFB3] flex items-center justify-center mx-auto text-[#7A6218] animate-spin">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-[#1E1D1A] text-sm">Reviewing standup...</h3>
                <p className="text-[10px] text-[#7C786E] max-w-[200px] mx-auto">Evaluating vocab context, sentence structure, fillers and latency pauses.</p>
              </div>
            ) : showAnalysis ? (
              <div className="space-y-6 mt-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                {/* SVG Progress score rings */}
                <div className="grid grid-cols-3 gap-2">
                  <ScoreRing 
                     score={evaluationResult ? evaluationResult.vocabularyScore * 10 : 88} 
                     label="Vocabulary" 
                     colorClass="stroke-[#F5C451]" 
                  />
                  <ScoreRing 
                     score={evaluationResult ? evaluationResult.grammarScore * 10 : 92} 
                     label="Grammar" 
                     colorClass="stroke-[#2C2B27]" 
                  />
                  <ScoreRing 
                     score={
                       evaluationResult 
                         ? (evaluationResult.confidenceEstimate === "High" ? 95 : evaluationResult.confidenceEstimate === "Medium" ? 75 : 45) 
                         : 85
                     } 
                     label="Confidence" 
                     colorClass="stroke-emerald-600" 
                  />
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#ECE9DF] space-y-2 shadow-sm">
                  <div className="flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-[#F5C451]" />
                    <span className="text-[10px] text-[#7C786E] font-bold uppercase tracking-wide">AI Dialogue Critique</span>
                  </div>
                  <p className="text-xs text-[#1E1D1A] leading-relaxed">
                    "{evaluationResult ? evaluationResult.feedback : "Excellent presentation structure. Good technical terminology and domain vocabulary."}"
                  </p>
                </div>
              </div>
            ) : (
              <div className="my-auto text-center py-12 text-[#7C786E] space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FAF9F5] border border-[#ECE9DF] flex items-center justify-center mx-auto text-[#7C786E] shadow-sm">
                  <Mic className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-[#1E1D1A] text-sm">No active speech report</h3>
                <p className="text-xs text-[#7C786E] max-w-[200px] mx-auto leading-relaxed">
                  Record your answer to today's prompt. Our speech models analyze performance on vocabulary, grammar, and tone confidence.
                </p>
              </div>
            )}

            <div className="border-t border-[#EFECE3] pt-4 mt-6 text-center">
              <span className="text-[9px] text-[#7C786E] font-semibold leading-relaxed">
                Calibration engine v2.4 • Powered by PinkySpeech Large
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 30-Day Roadmap Section */}
      <div className="border-t border-[#EFECE3] pt-10 space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold text-[#1E1D1A] tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#2C2B27]" />
            30-Day Placement Roadmap
          </h2>
          <p className="text-[#7C786E] text-xs mt-1">
            Build bulletproof technical communication skills. Click on any active or completed nodes below to view day briefs and performance evaluations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* GitHub-style Contribution grid */}
          <div className="lg:col-span-8 warm-card p-6 bg-white">
            <div className="flex items-center justify-between mb-4 border-b border-[#EFECE3] pb-3">
              <span className="text-[10px] text-[#7C786E] font-bold uppercase tracking-wider">Calibration Nodes</span>
              <div className="flex items-center gap-4 text-[9px] font-bold text-[#7C786E] uppercase">
                <div className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded bg-[#FAF4D8] border border-[#F5C451]" /> Completed
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded bg-white border border-[#2C2B27] animate-pulse" /> Active
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded bg-[#FAF9F5] border border-[#ECE9DF] text-zinc-400 flex items-center justify-center"><Lock className="w-1.5 h-1.5" /></div> Locked
                </div>
              </div>
            </div>

            {/* Nodes Grid */}
            <div className="grid grid-cols-10 gap-3">
              {roadmapDays.map((day) => {
                const isCompleted = day.status === "completed";
                const isActive = day.status === "active";
                const isSelected = day.day === selectedDayNum;

                return (
                  <button
                    key={day.day}
                    onClick={() => {
                      if (day.status !== "locked") {
                        setSelectedDayNum(day.day);
                      }
                    }}
                    disabled={day.status === "locked"}
                    className={`relative aspect-square rounded-xl border font-bold text-xs flex flex-col items-center justify-center transition-all duration-300 select-none ${
                      isCompleted
                        ? "bg-[#FAF4D8] border-[#F5C451] text-[#7A6218] hover:shadow-sm cursor-pointer"
                        : isActive
                        ? "bg-white border-[#2C2B27] text-[#2C2B27] shadow-sm animate-pulse cursor-pointer"
                        : "bg-[#FAF9F5] border-[#ECE9DF] text-zinc-400 cursor-not-allowed"
                    } ${
                      isSelected && (isCompleted || isActive)
                        ? "ring-2 ring-[#2C2B27] ring-offset-2 ring-offset-white scale-105"
                        : ""
                    }`}
                  >
                    <span>D{day.day}</span>
                    {isCompleted && (
                      <span className="text-[8px] font-black text-[#7A6218] mt-0.5">{day.score}%</span>
                    )}
                    {day.status === "locked" && (
                      <Lock className="w-2.5 h-2.5 text-zinc-400 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Inspected Node details */}
          <div className="lg:col-span-4 warm-card p-6 flex flex-col justify-between bg-white">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#EFECE3] pb-3">
                <span className="text-[10px] text-[#7C786E] font-bold uppercase tracking-wider">Node Details</span>
                <span className="px-2 py-0.5 rounded bg-[#FAF9F5] border border-[#ECE9DF] text-[8px] text-[#7C786E] font-bold uppercase tracking-wide">
                  Day {selectedRoadmapDay.day}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-[#1E1D1A] leading-snug">
                    {selectedRoadmapDay.category} Prompt
                  </h4>
                  {selectedRoadmapDay.score && (
                    <span className="text-xs font-black text-[#7A6218]">Score: {selectedRoadmapDay.score}%</span>
                  )}
                </div>

                <p className="text-xs text-[#7C786E] italic leading-relaxed">
                  "{selectedRoadmapDay.prompt}"
                </p>

                {selectedRoadmapDay.status === "completed" ? (
                  <div className="space-y-2 pt-2 border-t border-[#EFECE3]">
                    <span className="block text-[8px] text-[#7C786E] font-bold uppercase tracking-wider">AI Evaluation Critique</span>
                    <p className="text-[11px] text-[#7C786E] leading-relaxed">
                      {selectedRoadmapDay.feedback}
                    </p>
                    <span className="block text-[9px] text-emerald-700 font-bold mt-1">
                      ✓ Completed {selectedRoadmapDay.dateCompleted}
                    </span>
                  </div>
                ) : (
                  <div className="pt-2 border-t border-[#EFECE3] space-y-2">
                    <span className="block text-[8px] text-[#7C786E] font-bold uppercase tracking-wider">Calibration Status</span>
                    <p className="text-[11px] text-[#7C786E] leading-relaxed">
                      This daily standup node is ready. Record your answer in the recorder above to score metrics and unlock the next node.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 border-t border-[#EFECE3] pt-4">
              <span className="block text-[9px] text-[#7C786E] font-semibold leading-relaxed">
                Calibration curriculum consists of 12 Technical, 12 Behavioral, and 6 System Design nodes.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* SVG score ring component with smooth transitions */
interface ScoreRingProps {
  score: number;
  label: string;
  colorClass: string;
}

function ScoreRing({ score, label, colorClass }: ScoreRingProps) {
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-[#FAF9F5] border border-[#ECE9DF] text-center flex-1">
      <div className="relative w-14 h-14 flex items-center justify-center">
        {/* Track circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="28"
            cy="28"
            r={radius}
            className="stroke-[#EFECE3]"
            strokeWidth="4"
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx="28"
            cy="28"
            r={radius}
            className={`transition-all duration-1000 ease-out ${colorClass}`}
            strokeWidth="4"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute text-xs font-black text-[#1E1D1A]">{score}%</span>
      </div>
      <span className="text-[8px] font-bold uppercase tracking-wider text-[#7C786E] truncate w-full">{label}</span>
    </div>
  );
}
