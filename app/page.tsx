"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Sparkles, 
  Brain, 
  ArrowRight, 
  ArrowLeft,
  Target, 
  LayoutDashboard, 
  Eye, 
  EyeOff, 
  Lock, 
  User as UserIcon, 
  Mail,
  Code,
  Terminal,
  Cpu,
  Globe,
  ShieldCheck,
  Database,
  Check,
  UserCheck
} from "lucide-react";

export default function Home() {
  const router = useRouter();
  
  // Auth Mode: "login" or "signup"
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Form Inputs
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [signUpStep, setSignUpStep] = useState(1);
  const [signUpForm, setSignUpForm] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    college: "",
    course: "",
    yearOfStudy: "",
  });

  // Calibration Info
  const [techStack, setTechStack] = useState<string[]>([]);
  const [skillLevel, setSkillLevel] = useState(5);
  const [usernames, setUsernames] = useState({
    leetcode: "",
    codechef: "",
    hackerrank: "",
  });

  // Scanner animation
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState("");
  const [analysisProgress, setAnalysisProgress] = useState(0);

  // Tech options matching original onboarding
  const techOptions = [
    { id: "fullstack", label: "Full-Stack Dev", icon: Globe, color: "text-sky-400" },
    { id: "ai_ml", label: "AI / Machine Learning", icon: Brain, color: "text-purple-400" },
    { id: "datascience", label: "Data Science", icon: Database, color: "text-emerald-400" },
    { id: "cybersecurity", label: "Cyber Security", icon: ShieldCheck, color: "text-red-400" },
    { id: "cloud", label: "Cloud & DevOps", icon: Cpu, color: "text-pink-400" },
    { id: "systems", label: "Systems Programming", icon: Terminal, color: "text-pink-400" },
  ];

  // Redirect to dashboard if session exists
  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("currentUser");
      if (user) {
        router.push("/dashboard");
      }
    }
  }, [router]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: loginForm.username,
          password: loginForm.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      // Store in localStorage
      localStorage.setItem("currentUser", JSON.stringify(data.user));
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleTechToggle = (tech: string) => {
    if (techStack.includes(tech)) {
      setTechStack(techStack.filter((t) => t !== tech));
    } else {
      setTechStack([...techStack, tech]);
    }
  };

  const handleSignUpNext = () => {
    if (signUpStep === 1) {
      if (!signUpForm.name || !signUpForm.email || !signUpForm.username || !signUpForm.password) {
        setError("Please fill in all account fields");
        return;
      }
      setError("");
    }
    setSignUpStep((prev) => prev + 1);
  };

  const handleSignUpBack = () => {
    setSignUpStep((prev) => prev - 1);
  };

  const handleSignUpSubmit = async () => {
    setError("");
    setIsAnalyzing(true);
    
    const statuses = [
      "Securing connection and hashing credentials...",
      "Registering your PinkyPow hacker identity...",
      "Connecting to LeetCode, CodeChef, and HackerRank APIs...",
      "Calibrating initial Placement Score & benchmarking stats...",
      "Configuring your dynamic workspace & personal study tracker..."
    ];

    let currentStatusIdx = 0;
    setAnalysisStatus(statuses[0]);

    // Simulated scanner animation
    const interval = setInterval(() => {
      setAnalysisProgress((prev) => {
        const nextProgress = prev + 4;
        const statusStep = Math.floor((nextProgress / 100) * statuses.length);
        if (statusStep > currentStatusIdx && statusStep < statuses.length) {
          currentStatusIdx = statusStep;
          setAnalysisStatus(statuses[currentStatusIdx]);
        }

        if (nextProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return nextProgress;
      });
    }, 120);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...signUpForm,
          techStack,
          skillLevel,
          platformUsernames: usernames,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // Keep it showing 100% and then redirect
      setTimeout(() => {
        localStorage.setItem("currentUser", JSON.stringify(data.user));
        router.push("/dashboard");
      }, 1000);

    } catch (err: any) {
      clearInterval(interval);
      setIsAnalyzing(false);
      setError(err.message || "Failed to complete onboarding.");
    }
  };

  const getSkillDescriptor = (rating: number) => {
    if (rating <= 3) return "Exploring basics / Sophomore level";
    if (rating <= 6) return "Comfortable building apps / Competent solver";
    if (rating <= 8) return "Strong problem solver & system engineer";
    return "Advanced competitive coder & architect";
  };

  return (
    <main className="flex-1 flex flex-col justify-center items-center px-4 py-16 relative warm-dashboard-bg min-h-screen text-[#1E1D1A]">
      {/* Main landing container */}
      <div className="max-w-xl w-full text-center space-y-8 animate-in zoom-in-95 duration-500 z-10">
        
        {/* Logo and Tag */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/40 border border-[#FCE7F3] text-[#4E4B42] text-xs font-bold tracking-wide uppercase">
            <span>Next-Gen Placement Platform</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-[#1E1D1A] leading-none">
            Pinky<span className="bg-gradient-to-r from-[#be185d] via-[#6b21a8] to-[#0369a1] bg-clip-text text-transparent">Pow</span>
          </h1>

          <p className="text-[#7C786E] text-xs md:text-sm max-w-sm mx-auto leading-relaxed font-medium">
            Calibrate your technical skills, master DSA problem patterns, track speech clarity, and fast-track your placement preparation.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-[#b91c1c] text-xs font-semibold max-w-md mx-auto">
            {error}
          </div>
        )}

        {isAnalyzing ? (
          /* SIMULATED ANALYSIS & SCANNERS FOR SIGNUP */
          <div className="warm-card p-8 text-center flex flex-col items-center justify-center animate-in zoom-in-95 duration-500 min-h-[400px] max-w-md mx-auto relative">
            <div className="relative w-24 h-24 mb-8">
              <div className="absolute inset-0 rounded-full border border-[#be185d]/20 animate-ping duration-1000" />
              <div className="absolute inset-2 rounded-full border border-[#6b21a8]/30 animate-pulse" />
              <div className="absolute inset-4 rounded-full bg-[#2C2B27] flex items-center justify-center shadow-lg">
                <Brain className="w-10 h-10 text-white animate-bounce" />
              </div>
              <div className="absolute -inset-1 rounded-full border-2 border-t-[#be185d] border-r-transparent border-b-transparent border-l-transparent animate-spin duration-700" />
            </div>

            <h2 className="text-xl font-extrabold text-[#1E1D1A] mb-2">Analyzing Profile</h2>
            <p className="text-xs text-[#be185d] font-bold tracking-widest uppercase mb-6 flex items-center gap-1.5 justify-center">
              <Sparkles className="w-3.5 h-3.5 animate-spin" /> PinkyPow AI Calibrating
            </p>

            <div className="w-full bg-[#FFF5F7] border border-[#FCE7F3] rounded-full h-2 mb-4 overflow-hidden relative">
              <div 
                className="bg-[#2C2B27] h-full rounded-full transition-all duration-300"
                style={{ width: `${analysisProgress}%` }}
              />
            </div>

            <div className="flex justify-between items-center w-full px-1 text-[10px] text-[#7C786E] font-bold mb-8">
              <span>START CALIBRATION</span>
              <span>{analysisProgress}% COMPLETED</span>
            </div>

            <div className="p-4 rounded-xl bg-[#FFF5F7] border border-[#FCE7F3] min-h-[64px] flex items-center justify-center w-full">
              <p className="text-xs text-[#4E4B42] animate-pulse italic leading-relaxed">
                {analysisStatus}
              </p>
            </div>
          </div>
        ) : mode === "login" ? (
          /* LOGIN CARD */
          <div className="warm-card p-6 md:p-8 text-left max-w-md mx-auto relative">
            <h2 className="text-xl font-bold text-[#1E1D1A] tracking-tight mb-2">Welcome Back</h2>
            <p className="text-xs text-[#7C786E] font-medium mb-6">Enter your username and password to access your dashboard.</p>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-[#7C786E] uppercase tracking-wider mb-1.5">Username</label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-3.5 w-4 h-4 text-[#7C786E]" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Najla1208"
                    value={loginForm.username}
                    onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                    className="w-full bg-[#FFF5F7] border border-[#FCE7F3] focus:border-[#2C2B27] focus:outline-none rounded-xl pl-11 pr-4 py-3 text-sm text-[#1E1D1A] placeholder-[#7C786E] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#7C786E] uppercase tracking-wider mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-[#7C786E]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className="w-full bg-[#FFF5F7] border border-[#FCE7F3] focus:border-[#2C2B27] focus:outline-none rounded-xl pl-11 pr-11 py-3 text-sm text-[#1E1D1A] placeholder-[#7C786E] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-[#7C786E] hover:text-[#1E1D1A]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2C2B27] hover:bg-[#1E1D1A] text-white font-bold py-3 rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                {loading ? "Logging in..." : "Log In"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-[#FDF2F8] text-center text-xs text-[#7C786E] font-medium">
              New to PinkyPow?{" "}
              <button 
                onClick={() => { setMode("signup"); setSignUpStep(1); setError(""); }}
                className="text-[#be185d] font-bold hover:underline bg-none border-none p-0 cursor-pointer"
              >
                Create an account
              </button>
            </div>
          </div>
        ) : (
          /* MULTI-STEP SIGN UP & CALIBRATION WIZARD */
          <div className="warm-card p-6 md:p-8 text-left max-w-lg mx-auto relative">
            
            {/* Step Indicators */}
            <div className="flex items-center justify-between mb-8 pb-5 border-b border-[#FDF2F8]">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex items-center flex-1 last:flex-none">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                      signUpStep >= s
                        ? "bg-[#2C2B27] text-white shadow-sm"
                        : "bg-[#FFF5F7] text-[#7C786E] border border-[#FCE7F3]"
                    }`}
                  >
                    {signUpStep > s ? <Check className="w-3.5 h-3.5" /> : s}
                  </div>
                  {s < 4 && (
                    <div
                      className={`h-0.5 flex-1 mx-2.5 rounded-full transition-all duration-500 ${
                        signUpStep > s ? "bg-[#2C2B27]" : "bg-[#FCE7F3]"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="min-h-[280px] flex flex-col justify-between">
              
              {/* STEP 1: Account Credentials */}
              {signUpStep === 1 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div>
                    <h3 className="text-lg font-bold text-[#1E1D1A] tracking-tight">Create Account</h3>
                    <p className="text-xs text-[#7C786E] font-medium mt-1">Get started by filling out your base hacker profile credentials.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-[#7C786E] uppercase tracking-wider mb-1">Full Name</label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-3 w-4 h-4 text-[#7C786E]" />
                        <input
                          type="text"
                          required
                          placeholder="e.g. Najla"
                          value={signUpForm.name}
                          onChange={(e) => setSignUpForm({ ...signUpForm, name: e.target.value })}
                          className="w-full bg-[#FFF5F7] border border-[#FCE7F3] focus:border-[#2C2B27] focus:outline-none rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#1E1D1A] placeholder-[#7C786E] transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#7C786E] uppercase tracking-wider mb-1">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-[#7C786E]" />
                        <input
                          type="email"
                          required
                          placeholder="najla@example.com"
                          value={signUpForm.email}
                          onChange={(e) => setSignUpForm({ ...signUpForm, email: e.target.value })}
                          className="w-full bg-[#FFF5F7] border border-[#FCE7F3] focus:border-[#2C2B27] focus:outline-none rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#1E1D1A] placeholder-[#7C786E] transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-[#7C786E] uppercase tracking-wider mb-1">Username</label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-3 w-4 h-4 text-[#7C786E]" />
                        <input
                          type="text"
                          required
                          placeholder="e.g. Najla1208"
                          value={signUpForm.username}
                          onChange={(e) => setSignUpForm({ ...signUpForm, username: e.target.value })}
                          className="w-full bg-[#FFF5F7] border border-[#FCE7F3] focus:border-[#2C2B27] focus:outline-none rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#1E1D1A] placeholder-[#7C786E] transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#7C786E] uppercase tracking-wider mb-1">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 w-4 h-4 text-[#7C786E]" />
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          placeholder="••••••••"
                          value={signUpForm.password}
                          onChange={(e) => setSignUpForm({ ...signUpForm, password: e.target.value })}
                          className="w-full bg-[#FFF5F7] border border-[#FCE7F3] focus:border-[#2C2B27] focus:outline-none rounded-xl pl-9 pr-9 py-2.5 text-xs text-[#1E1D1A] placeholder-[#7C786E] transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-[#7C786E] hover:text-[#1E1D1A]"
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-[#7C786E] uppercase tracking-wider mb-1">College</label>
                      <input
                        type="text"
                        placeholder="e.g. MIT"
                        value={signUpForm.college}
                        onChange={(e) => setSignUpForm({ ...signUpForm, college: e.target.value })}
                        className="w-full bg-[#FFF5F7] border border-[#FCE7F3] focus:border-[#2C2B27] focus:outline-none rounded-xl px-3 py-2.5 text-xs text-[#1E1D1A] placeholder-[#7C786E] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#7C786E] uppercase tracking-wider mb-1">Course</label>
                      <input
                        type="text"
                        placeholder="e.g. B.Tech CSE"
                        value={signUpForm.course}
                        onChange={(e) => setSignUpForm({ ...signUpForm, course: e.target.value })}
                        className="w-full bg-[#FFF5F7] border border-[#FCE7F3] focus:border-[#2C2B27] focus:outline-none rounded-xl px-3 py-2.5 text-xs text-[#1E1D1A] placeholder-[#7C786E] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#7C786E] uppercase tracking-wider mb-1">Year of Study</label>
                      <input
                        type="text"
                        placeholder="e.g. 3rd Year"
                        value={signUpForm.yearOfStudy}
                        onChange={(e) => setSignUpForm({ ...signUpForm, yearOfStudy: e.target.value })}
                        className="w-full bg-[#FFF5F7] border border-[#FCE7F3] focus:border-[#2C2B27] focus:outline-none rounded-xl px-3 py-2.5 text-xs text-[#1E1D1A] placeholder-[#7C786E] transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Interests & Tech Stack */}
              {signUpStep === 2 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <h2 className="text-base font-bold text-[#1E1D1A] mb-1.5 flex items-center gap-2">
                    <Code className="w-5 h-5 text-[#be185d]" />
                    Primary Tech Stack & Interests
                  </h2>
                  <p className="text-xs text-[#7C786E] font-medium mb-4">
                    Select the domain paths you want to prioritize for AI analysis and prep.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-2.5">
                    {techOptions.map((option) => {
                      const isSelected = techStack.includes(option.id);
                      const Icon = option.icon;
                      return (
                        <button
                          key={option.id}
                          onClick={() => handleTechToggle(option.id)}
                          className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-300 cursor-pointer ${
                            isSelected
                              ? "bg-[#FCE7F3] border-[#E8DFB3] shadow-sm text-[#be185d] font-semibold"
                              : "bg-[#FFF5F7] border-[#FCE7F3] text-[#7C786E] hover:bg-white hover:text-[#1E1D1A]"
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${option.color}`} />
                          <span className="text-xs font-semibold">{option.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 3: Rating Coding Skills */}
              {signUpStep === 3 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <h2 className="text-base font-bold text-[#1E1D1A] mb-1.5 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-[#be185d]" />
                    Rate Your Current Coding Skills
                  </h2>
                  <p className="text-xs text-[#7C786E] font-medium mb-6">
                    Be honest! This calibrates the starting difficulty of your DSA & Project workflows.
                  </p>

                  <div className="space-y-5 px-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-[#7C786E] font-bold tracking-wider uppercase">Self-Evaluation</span>
                      <span className="text-xl font-black text-[#be185d] bg-[#be185d]/10 px-2.5 py-0.5 rounded-lg border border-[#be185d]/20">
                        {skillLevel} <span className="text-xs text-[#7C786E] font-normal">/ 10</span>
                      </span>
                    </div>

                    <div className="relative group pt-2 pb-1">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={skillLevel}
                        onChange={(e) => setSkillLevel(Number(e.target.value))}
                        className="w-full h-1.5 bg-[#FFF5F7] border border-[#FCE7F3] rounded-lg appearance-none cursor-pointer accent-[#2C2B27] outline-none"
                      />
                      <div className="flex justify-between text-[9px] text-[#7C786E] font-bold px-0.5 mt-1.5">
                        <span>Beginner</span>
                        <span>Intermediate</span>
                        <span>Expert</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#FFF5F7] border border-[#FCE7F3] text-center transition-all duration-300">
                      <p className="text-xs font-bold text-[#1E1D1A]">
                        {getSkillDescriptor(skillLevel)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Link Platforms */}
              {signUpStep === 4 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <h2 className="text-base font-bold text-[#1E1D1A] mb-1.5 flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-[#be185d]" />
                    Link Coder Profiles
                  </h2>
                  <p className="text-xs text-[#7C786E] font-medium mb-5">
                    Enter usernames so PinkyPow AI can analyze past coding stats and optimize score calibrations.
                  </p>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-semibold text-[#7C786E] mb-1">
                        LeetCode Username
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. rajakumaran_dev"
                        value={usernames.leetcode}
                        onChange={(e) => setUsernames({ ...usernames, leetcode: e.target.value })}
                        className="w-full bg-[#FFF5F7] border border-[#FCE7F3] focus:border-[#2C2B27] focus:outline-none rounded-xl px-3 py-2 text-xs text-[#1E1D1A] placeholder-[#7C786E] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-[#7C786E] mb-1">
                        CodeChef Username
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. rajakumaran2006"
                        value={usernames.codechef}
                        onChange={(e) => setUsernames({ ...usernames, codechef: e.target.value })}
                        className="w-full bg-[#FFF5F7] border border-[#FCE7F3] focus:border-[#2C2B27] focus:outline-none rounded-xl px-3 py-2 text-xs text-[#1E1D1A] placeholder-[#7C786E] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-[#7C786E] mb-1">
                        HackerRank Username
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. raja_poW"
                        value={usernames.hackerrank}
                        onChange={(e) => setUsernames({ ...usernames, hackerrank: e.target.value })}
                        className="w-full bg-[#FFF5F7] border border-[#FCE7F3] focus:border-[#2C2B27] focus:outline-none rounded-xl px-3 py-2 text-xs text-[#1E1D1A] placeholder-[#7C786E] transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex gap-4 mt-6 pt-5 border-t border-[#FDF2F8]">
                {signUpStep > 1 ? (
                  <button
                    onClick={handleSignUpBack}
                    className="flex-1 py-2.5 px-4 rounded-xl border border-[#FCE7F3] bg-white text-[#1E1D1A] font-semibold hover:bg-[#FFF5F7] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer text-xs shadow-sm"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back
                  </button>
                ) : (
                  <button
                    onClick={() => { setMode("login"); setError(""); }}
                    className="flex-1 py-2.5 px-4 rounded-xl border border-[#FCE7F3] bg-white text-[#1E1D1A] font-semibold hover:bg-[#FFF5F7] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer text-xs shadow-sm"
                  >
                    Back to Login
                  </button>
                )}
                
                <button
                  onClick={signUpStep === 4 ? handleSignUpSubmit : handleSignUpNext}
                  disabled={signUpStep === 2 && techStack.length === 0}
                  className={`flex-1 py-2.5 px-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer text-xs ${
                    signUpStep === 2 && techStack.length === 0
                      ? "bg-[#FFF5F7] text-zinc-400 cursor-not-allowed border border-[#FCE7F3]"
                      : "bg-[#2C2B27] hover:bg-[#1E1D1A] text-white shadow-sm active:scale-95"
                  }`}
                >
                  {signUpStep === 4 ? "Complete Calibration" : "Continue"}
                  {signUpStep < 4 && <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-[10px] text-[#7C786E] font-bold tracking-widest uppercase pt-2">
          PinkyPow AI © 2026 • Secure & Sandbox Calibrated
        </div>
      </div>
    </main>
  );
}
