"use client";

import React, { useState } from "react";
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
  UserCheck,
  Mail,
  User,
  AlertCircle,
  Eye,
  EyeOff,
  GraduationCap,
  BookOpen,
  MapPin,
  Target
} from "lucide-react";

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  
  // Account state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Academic Profiling State
  const [college, setCollege] = useState("");
  const [collegeLocation, setCollegeLocation] = useState("");
  const [collegeCountry, setCollegeCountry] = useState("");
  const [collegeState, setCollegeState] = useState("");
  const [course, setCourse] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("");
  const [gpa, setGpa] = useState("");
  const [graduationDate, setGraduationDate] = useState("");

  // Placement & career probe preferences
  const [priorHackathons, setPriorHackathons] = useState("None");
  const [preferredLocationType, setPreferredLocationType] = useState("Remote");
  const [preferredRole, setPreferredRole] = useState("Full Stack");
  const [certInterests, setCertInterests] = useState<string[]>([]);

  // Calibration state
  const [techStack, setTechStack] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [skillLevel, setSkillLevel] = useState(5);
  const [usernames, setUsernames] = useState({
    leetcode: "",
    codechef: "",
    hackerrank: "",
  });

  // Full-Stack Specific State
  const [fullStackStack, setFullStackStack] = useState("");
  const [fullStackLevel, setFullStackLevel] = useState("");
  const [fullStackBuiltApps, setFullStackBuiltApps] = useState("");
  
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

  const interestOptions = [
    "Web Applications",
    "Mobile Development",
    "Machine Learning",
    "System Design",
    "Open Source Contribution",
    "Competitive Programming",
    "DevOps & Cloud",
    "UI/UX Design",
    "Web Scraping / Automation",
    "Game Development",
    "Cybersecurity / Pentesting",
    "Blockchain / Smart Contracts",
    "Data Engineering / Pipelines",
    "Product Management",
    "Technical Writing / Developer Relations"
  ];

  const certOptions = [
    "AWS Certified Cloud Practitioner",
    "Google Cloud Associate Cloud Engineer",
    "Azure Fundamentals",
    "Meta React Developer",
    "Next.js Certified Associate",
    "CompTIA Security+",
    "TensorFlow Developer Certificate",
    "Certified Kubernetes Administrator (CKA)"
  ];

  const handleTechToggle = (tech: string) => {
    if (techStack.includes(tech)) {
      setTechStack(techStack.filter((t) => t !== tech));
    } else {
      setTechStack([...techStack, tech]);
    }
  };

  const handleInterestToggle = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter((i) => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const handleNext = () => {
    setError("");
    if (step === 1) {
      if (!username.trim() || !password.trim() || !name.trim() || !email.trim()) {
        setError("All account fields are required.");
        return;
      }
    }
    if (step === 2) {
      if (!college.trim() || !collegeLocation.trim() || !collegeCountry.trim() || !collegeState.trim() || !course.trim() || !yearOfStudy || !gpa.trim() || !graduationDate.trim()) {
        setError("All academic fields are required.");
        return;
      }
    }
    if (step === 3) {
      if (techStack.length === 0) {
        setError("Please select at least one tech stack domain.");
        return;
      }
      if (techStack.includes("fullstack")) {
        setStep(4);
      } else {
        setStep(5);
      }
      return;
    }
    if (step === 4) {
      if (!fullStackStack || !fullStackLevel || !fullStackBuiltApps) {
        setError("Please answer all follow-up questions.");
        return;
      }
      setStep(5);
      return;
    }
    if (step === 5) {
      if (!preferredRole || !preferredLocationType || !priorHackathons) {
        setError("Please answer all career preference questions.");
        return;
      }
      setStep(6);
      return;
    }
    if (step === 6) {
      setStep(7);
      return;
    }
    if (step === 7) {
      handleSubmitOnboarding();
    }
  };

  const handleBack = () => {
    setError("");
    if (step === 5) {
      if (techStack.includes("fullstack")) {
        setStep(4);
      } else {
        setStep(3);
      }
      return;
    }
    if (step === 6) {
      setStep(5);
      return;
    }
    if (step === 7) {
      setStep(6);
      return;
    }
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmitOnboarding = async () => {
    setIsAnalyzing(true);
    setError("");
    
    try {
      const res = await fetch("/api/users/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          password,
          name: name.trim(),
          email: email.trim(),
          techStack,
          platformUsernames: usernames,
          skillLevel,
          college: college.trim(),
          collegeLocation: collegeLocation.trim(),
          collegeCountry: collegeCountry.trim(),
          collegeState: collegeState.trim(),
          course: course.trim(),
          yearOfStudy,
          interests,
          fullStackStack,
          fullStackLevel,
          fullStackBuiltApps,
          gpa: gpa.trim(),
          graduationDate: graduationDate.trim(),
          priorHackathons,
          preferredLocationType,
          preferredRole,
          certInterests
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Profile calibration failed.");
      }

      // Save user session in localStorage
      localStorage.setItem("currentUser", JSON.stringify(data.user));

      // Trigger the AI calibration animation
      triggerAnalysis();
    } catch (err: any) {
      setIsAnalyzing(false);
      setError(err.message || "Something went wrong. Please check your credentials.");
      setStep(1); // Return to step 1 so they can fix credentials
    }
  };

  const triggerAnalysis = () => {
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

  // Check navigation button disable condition
  const isContinueDisabled = () => {
    if (step === 1) {
      return !username.trim() || !password.trim() || !name.trim() || !email.trim();
    }
    if (step === 2) {
      return !college.trim() || !collegeLocation.trim() || !collegeCountry.trim() || !collegeState.trim() || !course.trim() || !yearOfStudy || !gpa.trim() || !graduationDate.trim();
    }
    if (step === 3) {
      return techStack.length === 0;
    }
    if (step === 4) {
      return !fullStackStack || !fullStackLevel || !fullStackBuiltApps;
    }
    if (step === 5) {
      return !preferredRole || !preferredLocationType || !priorHackathons;
    }
    return false;
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
              Answer a few quick calibration questions to initialize your placement preparation track.
            </p>
          </div>

          {/* Glassmorphic step container */}
          <div className="bg-zinc-900/40 border border-zinc-800/60 backdrop-blur-md rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-xl">
            
            {error && (
              <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2 animate-in fade-in duration-300">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Step Indicators */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
              {[1, 2, 3, 4, 5, 6, 7].map((s) => {
                // Determine display logic for dynamic Step 4 dot
                const isStep4Skipped = !techStack.includes("fullstack");
                
                // If skipped, we can style it differently or just render it
                const dotClass = isStep4Skipped && s === 4
                  ? "hidden md:flex opacity-30 cursor-not-allowed bg-zinc-950 text-zinc-700 border border-white/5"
                  : step >= s
                  ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md shadow-pink-500/25"
                  : "bg-white/5 text-zinc-500 border border-white/5";

                return (
                  <div key={s} className={`flex items-center flex-1 last:flex-none ${isStep4Skipped && s === 4 ? "hidden md:flex flex-none mx-1" : ""}`}>
                    <div
                      className={`w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center text-xs md:text-sm font-semibold transition-all duration-300 ${dotClass}`}
                      title={s === 4 ? "Web dev focus (dynamic)" : ""}
                    >
                      {step > s ? <Check className="w-4 h-4" /> : s}
                    </div>
                    {s < 7 && (
                      <div
                        className={`h-0.5 flex-1 mx-2 rounded-full transition-all duration-500 ${isStep4Skipped && s === 4 ? "hidden md:block" : ""} ${
                          step > s ? "bg-gradient-to-r from-pink-500 to-purple-600" : "bg-white/5"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Step Contents */}
            <div className="min-h-[280px] flex flex-col justify-between">
              
              {/* STEP 1: Account Setup */}
              {step === 1 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-4">
                  <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-pink-500" />
                    Account Creation
                  </h2>
                  <p className="text-xs text-zinc-400 mb-2">
                    Set up your login credentials so you can return to your calibrated profile dashboard later.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                        <input
                          type="text"
                          placeholder="e.g. Najla"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 focus:border-pink-500 focus:outline-none rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-zinc-600 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                        <input
                          type="email"
                          placeholder="e.g. najla@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 focus:border-pink-500 focus:outline-none rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-zinc-600 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Username</label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                        <input
                          type="text"
                          placeholder="e.g. najla_dev"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 focus:border-pink-500 focus:outline-none rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-zinc-600 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 focus:border-pink-500 focus:outline-none rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-zinc-600 transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-zinc-500 hover:text-zinc-300 focus:outline-none cursor-pointer"
                          tabIndex={-1}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Academic Profile */}
              {step === 2 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-4">
                  <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-pink-500" />
                    Academic Profile
                  </h2>
                  <p className="text-xs text-zinc-400 mb-2">
                    Tell us where and what you are studying to find eligible internships, hackathons, and certifications.
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">College / University Name</label>
                      <div className="relative">
                        <GraduationCap className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                        <input
                          type="text"
                          placeholder="e.g. IIT Madras"
                          value={college}
                          onChange={(e) => setCollege(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 focus:border-pink-500 focus:outline-none rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-zinc-600 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">College Location (City)</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                        <input
                          type="text"
                          placeholder="e.g. Chennai"
                          value={collegeLocation}
                          onChange={(e) => setCollegeLocation(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 focus:border-pink-500 focus:outline-none rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-zinc-600 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">State / Province</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                          <input
                            type="text"
                            placeholder="e.g. Tamil Nadu"
                            value={collegeState}
                            onChange={(e) => setCollegeState(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 focus:border-pink-500 focus:outline-none rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-zinc-600 transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Country</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                          <input
                            type="text"
                            placeholder="e.g. India"
                            value={collegeCountry}
                            onChange={(e) => setCollegeCountry(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 focus:border-pink-500 focus:outline-none rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-zinc-600 transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">State / Province</label>
                        <input
                          type="text"
                          placeholder="e.g. Tamil Nadu"
                          value={collegeState}
                          onChange={(e) => setCollegeState(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 focus:border-pink-500 focus:outline-none rounded-xl px-3 py-2.5 text-xs text-white placeholder-zinc-600 transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Country</label>
                        <input
                          type="text"
                          placeholder="e.g. India"
                          value={collegeCountry}
                          onChange={(e) => setCollegeCountry(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 focus:border-pink-500 focus:outline-none rounded-xl px-3 py-2.5 text-xs text-white placeholder-zinc-600 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">GPA / CGPA Rating</label>
                        <input
                          type="text"
                          placeholder="e.g. 8.5/10 or 3.8/4.0"
                          value={gpa}
                          onChange={(e) => setGpa(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 focus:border-pink-500 focus:outline-none rounded-xl px-3 py-2.5 text-xs text-white placeholder-zinc-600 transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Graduation Date (Month, Year)</label>
                        <input
                          type="text"
                          placeholder="e.g. May 2027"
                          value={graduationDate}
                          onChange={(e) => setGraduationDate(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 focus:border-pink-500 focus:outline-none rounded-xl px-3 py-2.5 text-xs text-white placeholder-zinc-600 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Stream / Course of Study</label>
                        <div className="relative">
                          <BookOpen className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                          <input
                            type="text"
                            placeholder="e.g. B.Tech Computer Science"
                            value={course}
                            onChange={(e) => setCourse(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 focus:border-pink-500 focus:outline-none rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-zinc-600 transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Current Year of Study</label>
                        <div className="relative">
                          <select
                            value={yearOfStudy}
                            onChange={(e) => setYearOfStudy(e.target.value)}
                            className="w-full bg-zinc-900 border border-white/10 focus:border-pink-500 focus:outline-none rounded-xl px-3 py-2.5 text-xs text-white transition-colors appearance-none cursor-pointer"
                          >
                            <option value="">Select Year</option>
                            <option value="1st Year">1st Year</option>
                            <option value="2nd Year">2nd Year</option>
                            <option value="3rd Year">3rd Year</option>
                            <option value="4th Year">4th Year</option>
                            <option value="Post-Graduate">Post-Graduate</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-zinc-400 text-[10px]">
                            ▼
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Tech Domains & Basic Interests */}
              {step === 3 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-5">
                  <div>
                    <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                      <Code className="w-5 h-5 text-pink-500" />
                      Focus Domains & Interests
                    </h2>
                    <p className="text-xs text-zinc-400">
                      Select domain paths you want to calibrate and choose your basic interests.
                    </p>
                  </div>
                  
                  {/* Domains */}
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Primary Domain Paths (Select at least one)</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {techOptions.map((option) => {
                        const isSelected = techStack.includes(option.id);
                        const Icon = option.icon;
                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => handleTechToggle(option.id)}
                            className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all duration-300 cursor-pointer ${
                              isSelected
                                ? "bg-white/10 border-pink-500/50 shadow-md text-white font-semibold"
                                : "bg-white/5 border-white/5 text-zinc-400 hover:bg-white/8 hover:text-white"
                            }`}
                          >
                            <Icon className={`w-4 h-4 shrink-0 ${option.color}`} />
                            <span className="text-[11px]">{option.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Basic Interests */}
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Basic Interests / Tech Topics</label>
                    <div className="flex flex-wrap gap-1.5">
                      {interestOptions.map((interest) => {
                        const isSelected = interests.includes(interest);
                        return (
                          <button
                            key={interest}
                            type="button"
                            onClick={() => handleInterestToggle(interest)}
                            className={`px-3 py-1.5 rounded-full border text-xs transition-all duration-200 cursor-pointer ${
                              isSelected
                                ? "bg-gradient-to-r from-pink-500/20 to-purple-600/20 border-pink-500/40 text-pink-400 font-semibold"
                                : "bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10 hover:text-zinc-300"
                            }`}
                          >
                            {interest}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Web Tech Stack Follow-up (Conditional) */}
              {step === 4 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-4">
                  <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-pink-500" />
                    Web Dev Deep Dive
                  </h2>
                  <p className="text-xs text-zinc-400 mb-4">
                    Since you chose Full-Stack Development, tell us a bit more about your web development experience.
                  </p>

                  <div className="space-y-4">
                    {/* Primary Web Stack */}
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Primary Web Tech Stack</label>
                      <select
                        value={fullStackStack}
                        onChange={(e) => setFullStackStack(e.target.value)}
                        className="w-full bg-zinc-900 border border-white/10 focus:border-pink-500 focus:outline-none rounded-xl px-3 py-2.5 text-xs text-white appearance-none cursor-pointer"
                      >
                        <option value="">Select Stack</option>
                        <option value="MERN (MongoDB, Express, React, Node)">MERN (MongoDB, Express, React, Node)</option>
                        <option value="Next.js + SQL/PostgreSQL">Next.js + SQL/PostgreSQL</option>
                        <option value="Python (Django / FastAPI)">Python (Django / FastAPI)</option>
                        <option value="Java (Spring Boot) + Angular/React">Java (Spring Boot) + Angular/React</option>
                        <option value="Ruby on Rails">Ruby on Rails</option>
                        <option value="LAMP / Laravel (PHP)">LAMP / Laravel (PHP)</option>
                        <option value="Other Stack">Other / General Frontend & Backend</option>
                      </select>
                    </div>

                    {/* Skill Level in Web Stack */}
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Skill Level in this Stack</label>
                      <div className="grid grid-cols-3 gap-2">
                        {["Beginner", "Intermediate", "Advanced"].map((level) => {
                          const isSelected = fullStackLevel === level;
                          return (
                            <button
                              key={level}
                              type="button"
                              onClick={() => setFullStackLevel(level)}
                              className={`py-2 px-3 rounded-xl border text-center transition-all duration-300 cursor-pointer text-xs ${
                                isSelected
                                  ? "bg-gradient-to-r from-pink-500/20 to-purple-600/20 border-pink-500/50 text-white font-semibold"
                                  : "bg-white/5 border-white/5 text-zinc-400 hover:bg-white/8 hover:text-white"
                              }`}
                            >
                              {level}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Deployed Web App Experience */}
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Have you built dynamic web applications / APIs?</label>
                      <select
                        value={fullStackBuiltApps}
                        onChange={(e) => setFullStackBuiltApps(e.target.value)}
                        className="w-full bg-zinc-900 border border-white/10 focus:border-pink-500 focus:outline-none rounded-xl px-3 py-2.5 text-xs text-white appearance-none cursor-pointer"
                      >
                        <option value="">Select Experience</option>
                        <option value="Yes, multiple deployed to cloud (Vercel, Heroku, AWS etc.)">Yes, multiple deployed to cloud</option>
                        <option value="Yes, built locally on my machine">Yes, built locally on my machine</option>
                        <option value="No, just started learning and building simple pages">No, just started learning</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: Placement & Career Match */}
              {step === 5 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-4">
                  <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    <Target className="w-5 h-5 text-pink-500" />
                    Career & Placement Preferences
                  </h2>
                  <p className="text-xs text-zinc-400 mb-4">
                    Calibrate your preferences to customize hackathon match rankings, internship eligibility, and certifications.
                  </p>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Preferred Role */}
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Target Engineering Role</label>
                        <select
                          value={preferredRole}
                          onChange={(e) => setPreferredRole(e.target.value)}
                          className="w-full bg-zinc-900 border border-white/10 focus:border-pink-500 focus:outline-none rounded-xl px-3 py-2.5 text-xs text-white appearance-none cursor-pointer"
                        >
                          <option value="Frontend">Frontend Dev / UI / UX</option>
                          <option value="Backend">Backend Engineer</option>
                          <option value="Full Stack">Full Stack Developer</option>
                          <option value="Data Science/AI">Data Science / ML / AI</option>
                          <option value="Mobile Dev">Mobile App Developer</option>
                          <option value="Systems/DevOps">Systems Engineer / DevOps</option>
                        </select>
                      </div>

                      {/* Preferred Location Type */}
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Preferred Workspace Mode</label>
                        <select
                          value={preferredLocationType}
                          onChange={(e) => setPreferredLocationType(e.target.value)}
                          className="w-full bg-zinc-900 border border-white/10 focus:border-pink-500 focus:outline-none rounded-xl px-3 py-2.5 text-xs text-white appearance-none cursor-pointer"
                        >
                          <option value="Remote">Remote / Global</option>
                          <option value="In-person (Domestic)">In-person (Domestic / Regional)</option>
                          <option value="In-person (International)">In-person (International / Global)</option>
                          <option value="Hybrid">Hybrid Office Mode</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Prior Hackathon Experience */}
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Prior Hackathon Experience</label>
                        <select
                          value={priorHackathons}
                          onChange={(e) => setPriorHackathons(e.target.value)}
                          className="w-full bg-zinc-900 border border-white/10 focus:border-pink-500 focus:outline-none rounded-xl px-3 py-2.5 text-xs text-white appearance-none cursor-pointer"
                        >
                          <option value="None">None (First time hacker)</option>
                          <option value="1-2 Hackathons">1-2 Hackathons completed</option>
                          <option value="3+ Hackathons">3+ Hackathons (Competed & Built)</option>
                          <option value="Won Track Prizes">Won Sponsor/Track Prizes before</option>
                        </select>
                      </div>
                    </div>

                    {/* Certifications Interests */}
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Interested Certifications (Choose paths to unlock)</label>
                      <div className="flex flex-wrap gap-1.5">
                        {certOptions.map((cert) => {
                          const isSelected = certInterests.includes(cert);
                          return (
                            <button
                              key={cert}
                              type="button"
                              onClick={() => {
                                if (isSelected) {
                                  setCertInterests(certInterests.filter(c => c !== cert));
                                } else {
                                  setCertInterests([...certInterests, cert]);
                                }
                              }}
                              className={`px-3 py-1.5 rounded-full border text-xs transition-all duration-200 cursor-pointer ${
                                isSelected
                                  ? "bg-gradient-to-r from-pink-500/20 to-purple-600/20 border-pink-500/40 text-pink-400 font-semibold"
                                  : "bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10 hover:text-zinc-300"
                              }`}
                            >
                              {cert}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 6: Skill Calibration Slider */}
              {step === 6 && (
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

              {/* STEP 7: Platform Usernames */}
              {step === 7 && (
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
                <button
                  onClick={step === 1 ? () => router.push("/") : handleBack}
                  className="flex-1 py-3 px-4 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer text-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {step === 1 ? "Cancel" : "Back"}
                </button>
                
                <button
                  onClick={handleNext}
                  disabled={isContinueDisabled()}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer text-sm ${
                    isContinueDisabled()
                      ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700"
                      : step === 7
                      ? "bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white shadow-lg shadow-pink-500/20 pulse-glow active:scale-95"
                      : "bg-white text-black hover:bg-zinc-200"
                  }`}
                >
                  {step === 7 ? "Analyze My Profile" : "Continue"}
                  {step < 7 && <ArrowRight className="w-4 h-4" />}
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
