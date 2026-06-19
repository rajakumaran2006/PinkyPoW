"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Code, 
  Terminal, 
  Brain, 
  Sparkles, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Cpu, 
  Globe, 
  ShieldCheck, 
  Database,
  Lock,
  UserCheck
} from "lucide-react";

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [techStack, setTechStack] = useState<string[]>([]);
  const [skillLevel, setSkillLevel] = useState(5);
  const [usernames, setUsernames] = useState({
    leetcode: "",
    codechef: "",
    hackerrank: "",
  });
  
  // Analysis simulation state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState("");
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const techOptions = [
    { id: "fullstack", label: "Full-Stack Dev", icon: Globe, color: "text-sky-400" },
    { id: "ai_ml", label: "AI / Machine Learning", icon: Brain, color: "text-purple-400" },
    { id: "datascience", label: "Data Science", icon: Database, color: "text-emerald-400" },
    { id: "cybersecurity", label: "Cyber Security", icon: ShieldCheck, color: "text-red-400" },
    { id: "cloud", label: "Cloud & DevOps", icon: Cpu, color: "text-amber-400" },
    { id: "systems", label: "Systems Programming", icon: Terminal, color: "text-pink-400" },
  ];

  const handleTechToggle = (tech: string) => {
    if (techStack.includes(tech)) {
      setTechStack(techStack.filter((t) => t !== tech));
    } else {
      setTechStack([...techStack, tech]);
    }
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      triggerAnalysis();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const triggerAnalysis = () => {
    setIsAnalyzing(true);
    const statuses = [
      "Connecting to LeetCode, CodeChef, and HackerRank APIs...",
      "Fetching code submission history and performance graphs...",
      "Analyzing primary tech stack and framework proficiencies...",
      "Calibrating skill metrics and benchmarking against industry expectations...",
      "Generating dynamic PinkyPow Placement Score...",
      "Finalizing customized placement preparation dashboard..."
    ];

    let currentStatusIdx = 0;
    setAnalysisStatus(statuses[0]);

    // Animate progress and status text
    const interval = setInterval(() => {
      setAnalysisProgress((prev) => {
        const nextProgress = prev + 2;
        
        // Update text status periodically
        const statusStep = Math.floor((nextProgress / 100) * statuses.length);
        if (statusStep > currentStatusIdx && statusStep < statuses.length) {
          currentStatusIdx = statusStep;
          setAnalysisStatus(statuses[currentStatusIdx]);
        }

        if (nextProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            router.push("/dashboard");
          }, 600);
          return 100;
        }
        return nextProgress;
      });
    }, 80);
  };

  // Get description text based on skill level rating
  const getSkillDescriptor = (rating: number) => {
    if (rating <= 3) return "Exploring basics / Sophomore level";
    if (rating <= 6) return "Comfortable building apps / Competent solver";
    if (rating <= 8) return "Strong problem solver & system engineer";
    return "Advanced competitive coder & architect";
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center px-4 py-16 relative bg-[#0B0A09] text-zinc-100 min-h-screen w-full">
      {/* Dynamic background lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-pink-500/5 blur-[120px] pointer-events-none" />

      {/* Main glass card */}
      {!isAnalyzing ? (
        <div className="max-w-xl w-full z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-semibold tracking-wide uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              AI Skill Calibration
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2">
              Calibrate Your Profile
            </h1>
            <p className="text-zinc-400 text-sm md:text-base max-w-sm mx-auto">
              Answer 3 simple calibration questions to initialize your placement preparation track.
            </p>
          </div>

          {/* Glassmorphic step container */}
          <div className="bg-zinc-900/40 border border-zinc-800/60 backdrop-blur-md rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-xl">
            {/* Step Indicators */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center flex-1 last:flex-none">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                      step >= s
                        ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md shadow-pink-500/25"
                        : "bg-white/5 text-zinc-500 border border-white/5"
                    }`}
                  >
                    {step > s ? <Check className="w-4 h-4" /> : s}
                  </div>
                  {s < 3 && (
                    <div
                      className={`h-0.5 flex-1 mx-3 rounded-full transition-all duration-500 ${
                        step > s ? "bg-gradient-to-r from-pink-500 to-purple-600" : "bg-white/5"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Step Contents */}
            <div className="min-h-[220px] flex flex-col justify-between">
              {/* STEP 1: Tech Stack & Interests */}
              {step === 1 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    <Code className="w-5 h-5 text-pink-500" />
                    Primary Tech Stack & Interests
                  </h2>
                  <p className="text-xs text-zinc-400 mb-5">
                    Select the domain paths you want to prioritize for AI analysis and prep.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {techOptions.map((option) => {
                      const isSelected = techStack.includes(option.id);
                      const Icon = option.icon;
                      return (
                        <button
                          key={option.id}
                          onClick={() => handleTechToggle(option.id)}
                          className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all duration-300 cursor-pointer ${
                            isSelected
                              ? "bg-white/10 border-pink-500/50 shadow-md text-white"
                              : "bg-white/5 border-white/5 text-zinc-400 hover:bg-white/8 hover:text-white"
                          }`}
                        >
                          <Icon className={`w-5 h-5 ${option.color}`} />
                          <span className="text-xs md:text-sm font-medium">{option.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 2: Skill Calibration Slider */}
              {step === 2 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-pink-500" />
                    Rate Your Current Coding Skills
                  </h2>
                  <p className="text-xs text-zinc-400 mb-8">
                    Be honest! This calibrates the starting difficulty of your DSA & Project workflows.
                  </p>

                  <div className="space-y-6 px-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-zinc-400 font-semibold tracking-wider uppercase">Self-Evaluation</span>
                      <span className="text-2xl font-black text-pink-500 bg-pink-500/10 px-3 py-1 rounded-lg border border-pink-500/20">
                        {skillLevel} <span className="text-xs text-zinc-400 font-normal">/ 10</span>
                      </span>
                    </div>

                    <div className="relative group pt-4 pb-2">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={skillLevel}
                        onChange={(e) => setSkillLevel(Number(e.target.value))}
                        className="w-full h-2 bg-white/5 border border-white/10 rounded-lg appearance-none cursor-pointer accent-pink-500 outline-none"
                      />
                      <div className="flex justify-between text-[10px] text-zinc-500 font-medium px-1 mt-2">
                        <span>Beginner</span>
                        <span>Intermediate</span>
                        <span>Expert</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center transition-all duration-300">
                      <p className="text-sm font-semibold text-white">
                        {getSkillDescriptor(skillLevel)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Platform Usernames */}
              {step === 3 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-pink-500" />
                    Link Coder Profiles
                  </h2>
                  <p className="text-xs text-zinc-400 mb-6">
                    Enter usernames so PinkyPow AI can analyze past coding stats and optimize score calibrations.
                  </p>

                  <div className="space-y-4">
                    {/* LeetCode Input */}
                    <div>
                      <label htmlFor="leetcode" className="block text-xs font-semibold text-zinc-400 mb-1.5">
                        LeetCode Username
                      </label>
                      <input
                        id="leetcode"
                        type="text"
                        placeholder="e.g. rajakumaran_dev"
                        value={usernames.leetcode}
                        onChange={(e) => setUsernames({ ...usernames, leetcode: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 focus:border-pink-500 focus:outline-none rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 transition-colors"
                      />
                    </div>

                    {/* CodeChef Input */}
                    <div>
                      <label htmlFor="codechef" className="block text-xs font-semibold text-zinc-400 mb-1.5">
                        CodeChef Username
                      </label>
                      <input
                        id="codechef"
                        type="text"
                        placeholder="e.g. rajakumaran2006"
                        value={usernames.codechef}
                        onChange={(e) => setUsernames({ ...usernames, codechef: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 focus:border-pink-500 focus:outline-none rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 transition-colors"
                      />
                    </div>

                    {/* HackerRank Input */}
                    <div>
                      <label htmlFor="hackerrank" className="block text-xs font-semibold text-zinc-400 mb-1.5">
                        HackerRank Username
                      </label>
                      <input
                        id="hackerrank"
                        type="text"
                        placeholder="e.g. raja_poW"
                        value={usernames.hackerrank}
                        onChange={(e) => setUsernames({ ...usernames, hackerrank: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 focus:border-pink-500 focus:outline-none rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-4 mt-8 pt-6 border-t border-white/5">
                {step > 1 && (
                  <button
                    onClick={handleBack}
                    className="flex-1 py-3 px-4 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer text-sm"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                )}
                
                <button
                  onClick={handleNext}
                  disabled={step === 1 && techStack.length === 0}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer text-sm ${
                    step === 1 && techStack.length === 0
                      ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700"
                      : step === 3
                      ? "bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white shadow-lg shadow-pink-500/20 pulse-glow active:scale-95"
                      : "bg-white text-black hover:bg-zinc-200"
                  }`}
                >
                  {step === 3 ? "Analyze My Profile" : "Continue"}
                  {step < 3 && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* SIMULATED ANALYSIS SCREEN */
        <div className="max-w-md w-full bg-zinc-900/40 border border-zinc-800/60 backdrop-blur-md rounded-3xl p-8 text-center flex flex-col items-center justify-center animate-in zoom-in-95 duration-500 min-h-[400px] shadow-xl z-10">
          {/* Radial Scanner Icon */}
          <div className="relative w-24 h-24 mb-8">
            <div className="absolute inset-0 rounded-full border border-pink-500/20 animate-ping duration-1000" />
            <div className="absolute inset-2 rounded-full border border-purple-500/30 animate-pulse" />
            <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-500/30">
              <Brain className="w-10 h-10 text-white animate-bounce" />
            </div>
            {/* Spinning scanner notch */}
            <div className="absolute -inset-1 rounded-full border-2 border-t-pink-500 border-r-transparent border-b-transparent border-l-transparent animate-spin duration-700" />
          </div>

          <h2 className="text-xl font-extrabold text-white mb-2">Analyzing Profile</h2>
          <p className="text-xs text-pink-400 font-semibold tracking-widest uppercase mb-6 flex items-center gap-1.5 justify-center">
            <Sparkles className="w-3.5 h-3.5 animate-spin" /> PinkyPow AI Calibrating
          </p>

          <div className="w-full bg-white/5 border border-white/10 rounded-full h-2 mb-4 overflow-hidden relative">
            <div 
              className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${analysisProgress}%` }}
            />
          </div>

          <div className="flex justify-between items-center w-full px-1 text-[10px] text-zinc-500 font-bold mb-8">
            <span>START CALIBRATION</span>
            <span>{analysisProgress}% COMPLETED</span>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/5 min-h-[64px] flex items-center justify-center w-full">
            <p className="text-xs text-zinc-300 animate-pulse italic leading-relaxed">
              {analysisStatus}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
