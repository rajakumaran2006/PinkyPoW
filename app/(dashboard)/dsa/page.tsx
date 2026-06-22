"use client";

import React, { useState, useEffect } from "react";
import {
  Code,
  Flame,
  Clock,
  BookOpen,
  CheckCircle2,
  Lock,
  Unlock,
  Play,
  Pause,
  Check,
  X,
  Award,
  Terminal,
  ExternalLink,
  ChevronRight,
  Loader2,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Bot,
  Send,
  User as UserIcon,
  ArrowLeft,
  Search,
  Layers,
  Volume2
} from "lucide-react";

interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  platform: "LeetCode" | "GeeksforGeeks" | "CodeChef";
  url: string;
  codeTemplate: string;
  completed: boolean;
}

export default function DynamicCodingEngine() {
  const [loading, setLoading] = useState(true);
  const [planData, setPlanData] = useState<any>(null);
  
  // Onboarding Form States
  const [level, setLevel] = useState<"Beginner" | "Intermediate" | "Advanced">("Intermediate");
  const [totalDays, setTotalDays] = useState<number>(10);
  const [problemsPerDay, setProblemsPerDay] = useState<number>(2);
  const [selectedTopics, setSelectedTopics] = useState<string[]>(["Arrays", "Strings"]);
  const [submittingPlan, setSubmittingPlan] = useState(false);
  const [planLoadingStatus, setPlanLoadingStatus] = useState("");

  // Conversational Onboarding States
  const [chatStep, setChatStep] = useState<number>(0);
  const [chatMessages, setChatMessages] = useState<Array<{
    id: string;
    sender: "ai" | "user";
    text: string;
    timestamp: string;
  }>>([]);
  const [typedInput, setTypedInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Engaging variables collected during the chat
  const [userGoal, setUserGoal] = useState("Crack FAANG / Tier-1 companies 🚀");
  const [userLang, setUserLang] = useState("Python 🐍");
  const [userHours, setUserHours] = useState("2 Hours ⏰");
  const [userPlatform, setUserPlatform] = useState("Balanced Mix of All 🔀");
  const [userTimeline, setUserTimeline] = useState("Within 3 Months 🗓️");

  const chatEndRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, isTyping]);

  const triggerAiResponse = (stepIndex: number) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const questions = [
        "Welcome to your DSA Prep Track! I'm Pinky, your AI DSA Coach. 🚀 Let's start with your coding background: What is your current target calibration level? (Beginner, Intermediate, or Advanced)",
        "Got it! To tailor your problem choices, what is your primary goal for this prep? (e.g., crack FAANG, college placements, speed)",
        "Nice! Which programming language do you plan to use for your solutions? (JavaScript, Python, C++, Java, etc.)",
        "Perfect. Let's select the roadmap duration: How many days would you like your prep cycle to run? (5, 10, 15, 30, 45, or 90 days)",
        "Got it. And what is your preferred daily problem volume? How many challenges would you like to solve each day?",
        "Awesome! Now, select the core DSA topics you want to schedule and master in this plan. You can select multiple!",
        "Understood. How much time (in hours) can you dedicate to DSA prep daily?",
        "Got it. Where do you usually practice or find problem links? We support multiple external coding platforms.",
        "Almost done! When is your target placement or job application timeline? (e.g., immediate, within 3 months, 6+ months)",
        "All calibrated! I've put together a summary of your profile. Review the details below and let's craft your custom syllabus! 🌟"
      ];
      
      const newAiMsg = {
        id: `ai-${Date.now()}`,
        sender: "ai" as const,
        text: questions[stepIndex],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatMessages((prev) => [...prev, newAiMsg]);
      setChatStep(stepIndex);
    }, 800);
  };

  const handleGoBack = () => {
    if (chatStep === 0) return;
    
    setChatMessages((prev) => {
      const lastUserIdx = [...prev].reverse().findIndex(m => m.sender === "user");
      if (lastUserIdx === -1) return prev;
      const indexToRemove = prev.length - 1 - lastUserIdx;
      return prev.slice(0, indexToRemove);
    });
    
    setChatStep((prev) => prev - 1);
  };

  const resetChat = () => {
    setChatStep(0);
    setChatMessages([]);
    setLevel("Intermediate");
    setTotalDays(10);
    setProblemsPerDay(2);
    setSelectedTopics(["Arrays", "Strings"]);
    setUserGoal("Crack FAANG / Tier-1 companies 🚀");
    setUserLang("Python 🐍");
    setUserHours("2 Hours ⏰");
    setUserPlatform("Balanced Mix of All 🔀");
    setUserTimeline("Within 3 Months 🗓️");
  };

  // Daily Challenge Generation States
  const [generatingProblems, setGeneratingProblems] = useState(false);
  const [streakPoints, setStreakPoints] = useState(820);
  const [dailyStreak, setDailyStreak] = useState(5);

  // Interactive Code Workspace Simulation Modal
  const [activeSolveProblem, setActiveSolveProblem] = useState<Problem | null>(null);
  const [editorCode, setEditorCode] = useState("");
  const [testOutput, setTestOutput] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Audio Player Widget Simulation States
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioTime, setAudioTime] = useState(0);

  // Practice Stopwatch/Countdown Timer States (2 hours = 7200 seconds)
  const [practiceTimerSec, setPracticeTimerSec] = useState(7200);
  const [isTimerActive, setIsTimerActive] = useState(false);

  // Cheatsheet stack state
  const [expandedCheatCard, setExpandedCheatCard] = useState<string | null>(null);

  // Concept Search query state
  const [conceptSearchQuery, setConceptSearchQuery] = useState("");

  // Audio timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAudioPlaying) {
      interval = setInterval(() => {
        setAudioTime((prev) => {
          if (prev >= 19) {
            setIsAudioPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isAudioPlaying]);

  // Practice countdown timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive && practiceTimerSec > 0) {
      interval = setInterval(() => {
        setPracticeTimerSec((prev) => prev - 1);
      }, 1000);
    } else if (practiceTimerSec === 0) {
      setIsTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, practiceTimerSec]);


  const topicOptions = [
    "Arrays",
    "Strings",
    "Linked Lists",
    "Trees",
    "Stacks & Queues",
    "Graphs",
    "Dynamic Programming",
    "Recursion & Backtracking",
    "Greedy Algorithms",
    "Heap & Priority Queue",
    "Searching & Sorting"
  ];

  // Fetch plan status on load
  const fetchPlan = async () => {
    try {
      const response = await fetch("/api/ai/dsa");
      const data = await response.json();
      if (data.success) {
        setPlanData(data.dsaProgress);
        setStreakPoints(data.placementScore || 820);
        setDailyStreak(data.dailyStreak || 5);
      }
    } catch (error) {
      console.error("Error fetching DSA plan:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && (!planData || !planData.hasCustomPlan) && chatMessages.length === 0) {
      triggerAiResponse(0);
    }
  }, [loading, planData, chatMessages]);

  useEffect(() => {
    fetchPlan();
  }, []);

  // Handle user answer during conversational onboarding
  const handleUserAnswer = (answerText: string, value: any) => {
    const newUserMsg = {
      id: `user-${Date.now()}`,
      sender: "user" as const,
      text: answerText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setChatMessages((prev) => [...prev, newUserMsg]);

    switch (chatStep) {
      case 0:
        setLevel(value as "Beginner" | "Intermediate" | "Advanced");
        break;
      case 1:
        setUserGoal(value);
        break;
      case 2:
        setUserLang(value);
        break;
      case 3:
        setTotalDays(value as number);
        break;
      case 4:
        setProblemsPerDay(value as number);
        break;
      case 5:
        // selectedTopics is handled separately
        break;
      case 6:
        setUserHours(value);
        break;
      case 7:
        setUserPlatform(value);
        break;
      case 8:
        setUserTimeline(value);
        break;
      default:
        break;
    }

    if (chatStep < 9) {
      triggerAiResponse(chatStep + 1);
    }
  };

  // Handle manual typed inputs inside conversational onboarding
  const handleSendTypedMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedInput.trim()) return;

    const text = typedInput.trim();
    setTypedInput("");

    if (chatStep === 0) {
      const lower = text.toLowerCase();
      if (lower.includes("begin")) {
        handleUserAnswer("Beginner Level 🟢", "Beginner");
      } else if (lower.includes("adv")) {
        handleUserAnswer("Advanced Level 🔴", "Advanced");
      } else if (lower.includes("inter") || lower.includes("med")) {
        handleUserAnswer("Intermediate Level 🟡", "Intermediate");
      } else {
        handleUserAnswer(`Level: ${level}`, level);
      }
    } else if (chatStep === 1) {
      handleUserAnswer(text, text);
    } else if (chatStep === 2) {
      handleUserAnswer(text, text);
    } else if (chatStep === 3) {
      const match = text.match(/\b(5|10|15|30|45|90)\b/);
      if (match) {
        const days = parseInt(match[1]);
        handleUserAnswer(`${days} Days roadmap 📅`, days);
      } else {
        handleUserAnswer(`${totalDays} Days roadmap 📅`, totalDays);
      }
    } else if (chatStep === 4) {
      const match = text.match(/\b(1|2|3)\b/);
      if (match) {
        const probs = parseInt(match[1]);
        handleUserAnswer(`${probs} ${probs === 1 ? "problem" : "problems"} / day 🚀`, probs);
      } else {
        handleUserAnswer(`${problemsPerDay} ${problemsPerDay === 1 ? "problem" : "problems"} / day 🚀`, problemsPerDay);
      }
    } else if (chatStep === 5) {
      if (selectedTopics.length === 0) {
        alert("Please select at least one topic from the choices above before sending!");
        return;
      }
      handleUserAnswer(`Target Topics: ${selectedTopics.join(", ")}`, selectedTopics);
    } else if (chatStep === 6) {
      handleUserAnswer(`${text} ⏱️`, text);
    } else if (chatStep === 7) {
      handleUserAnswer(`${text} 💻`, text);
    } else if (chatStep === 8) {
      handleUserAnswer(text, text);
    } else if (chatStep === 9) {
      handleCreatePlan();
    }
  };

  // Handle plan creation
  const handleCreatePlan = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setSubmittingPlan(true);
    
    const statuses = [
      "Analyzing selected target topics...",
      "Distributing focus categories across schedule...",
      "Applying placement score matching matrices...",
      "Formatting system onboarding blueprints...",
      "Finalizing study roadmap..."
    ];

    let statusIdx = 0;
    setPlanLoadingStatus(statuses[0]);
    const statusInterval = setInterval(() => {
      statusIdx++;
      if (statusIdx < statuses.length) {
        setPlanLoadingStatus(statuses[statusIdx]);
      }
    }, 1200);

    try {
      const res = await fetch("/api/ai/dsa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create-plan",
          level,
          totalDays,
          problemsPerDay,
          topics: selectedTopics
        })
      });
      const data = await res.json();
      if (data.success) {
        setPlanData(data.dsaProgress);
        setDailyStreak(data.dailyStreak || 5);
      }
    } catch (err) {
      console.error("Error creating plan:", err);
    } finally {
      clearInterval(statusInterval);
      setSubmittingPlan(false);
    }
  };

  // Toggle topics select
  const handleTopicToggle = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter((t) => t !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  // Generate today's problems
  const handleGenerateTodayProblems = async () => {
    if (!planData) return;
    setGeneratingProblems(true);
    try {
      const res = await fetch("/api/ai/dsa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate-problem",
          dayNumber: planData.currentDayIndex
        })
      });
      const data = await res.json();
      if (data.success) {
        setPlanData(data.dsaProgress);
        setDailyStreak(data.dailyStreak || 5);
      }
    } catch (err) {
      console.error("Error generating problems:", err);
    } finally {
      setGeneratingProblems(false);
    }
  };

  // Advance to next day
  const handleAdvanceDay = async () => {
    if (!planData) return;
    try {
      const res = await fetch("/api/ai/dsa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "advance-day"
        })
      });
      const data = await res.json();
      if (data.success) {
        setPlanData(data.dsaProgress);
        setDailyStreak(data.dailyStreak || 5);
      }
    } catch (err) {
      console.error("Error advancing day:", err);
    }
  };

  // Reset plan
  const handleResetPlan = async () => {
    if (!confirm("Are you sure you want to reset your custom study plan? This will clear your current roadmap history.")) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai/dsa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reset-plan"
        })
      });
      const data = await res.json();
      if (data.success) {
        setPlanData(data.dsaProgress);
        setDailyStreak(data.dailyStreak || 5);
        resetChat();
      }
    } catch (err) {
      console.error("Error resetting plan:", err);
    } finally {
      setLoading(false);
    }
  };

  // Open Solve Modal
  const handleOpenSolveModal = (problem: Problem) => {
    setActiveSolveProblem(problem);
    setEditorCode(problem.codeTemplate || `function solve() {\n  // Write your code here\n}`);
    setTestOutput([]);
    setIsSubmitting(false);
  };

  const handleCloseSolveModal = () => {
    setActiveSolveProblem(null);
  };

  const handleToggleProblemCheckbox = async (problemId: string, completed: boolean) => {
    try {
      const res = await fetch("/api/ai/dsa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "toggle-problem",
          problemId,
          completed
        })
      });
      const data = await res.json();
      if (data.success) {
        setPlanData(data.dsaProgress);
        setStreakPoints(data.placementScore || 820);
        setDailyStreak(data.dailyStreak || 5);
      }
    } catch (err) {
      console.error("Error toggling problem status:", err);
    }
  };

  const handleRunTests = () => {
    setTestOutput(["Running tests...", "✓ Test Case 1: Passed", "✓ Test Case 2: Passed", "✓ Test Case 3: Passed"]);
  };

  const handleSubmitSolution = async () => {
    if (!activeSolveProblem) return;
    setIsSubmitting(true);
    setTestOutput((prev) => [...prev, "Verifying constraints...", "Checking edge cases..."]);

    try {
      const res = await fetch("/api/ai/dsa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "submit-solution",
          problemId: activeSolveProblem.id
        })
      });
      const data = await res.json();
      
      if (data.success) {
        setTestOutput((prev) => [
          ...prev,
          "✓ All test cases passed successfully!",
          "✓ Time Complexity: Optimal O(N)",
          "STATUS: ACCEPTED"
        ]);
        setStreakPoints(data.placementScore || 820);
        setDailyStreak(data.dailyStreak || 5);
        // Refresh local plan status
        setPlanData(data.dsaProgress);

        setTimeout(() => {
          setIsSubmitting(false);
          handleCloseSolveModal();
        }, 1500);
      } else {
        setTestOutput((prev) => [...prev, "❌ Compilation or logical check failed."]);
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error("Error submitting solution:", err);
      setTestOutput((prev) => [...prev, "❌ Connection error."]);
      setIsSubmitting(false);
    }
  };

  // Helper to retrieve problems for the active day
  const getProblemsForActiveDay = (): Problem[] => {
    if (!planData || !planData.dailyProblems) return [];
    const found = planData.dailyProblems.find((dp: any) => dp.dayNumber === planData.currentDayIndex);
    return found ? found.problems : [];
  };

  const currentProblems = getProblemsForActiveDay();
  const allCompletedToday = currentProblems.length > 0 && currentProblems.every((p) => p.completed);

  // Initial loader
  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-[#2C2B27] animate-spin" />
        <p className="text-sm text-[#7C786E] font-medium">Syncing placements dashboard...</p>
      </div>
    );
  }

  // ══════════════════════════════════════════════════
  // RENDER 1: ONBOARDING QUESTIONNAIRE
  // ══════════════════════════════════════════════════
  if (!planData || !planData.hasCustomPlan) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto pb-12 text-[#1E1D1A]">
        {/* Header */}
        <div className="text-center space-y-2 border-b border-[#FDF2F8] pb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FCE7F3] border border-[#E8DFB3] text-[#be185d] text-xs font-semibold tracking-wide uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            DSA Path Calibration
          </div>
          <h1 className="text-3xl font-normal text-[#1E1D1A] tracking-tight">
            AI Coach Calibration Onboarding
          </h1>
          <p className="text-[#7C786E] text-xs max-w-xl mx-auto leading-relaxed">
            Let's customize your DSA preparation journey. Answer the coach's questions to configure your track duration, topics, and problem volume.
          </p>
        </div>

        {submittingPlan ? (
          <div className="warm-card p-12 bg-white flex flex-col items-center justify-center space-y-6 text-center shadow-lg min-h-[400px]">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-4 border-[#FCE7F3] animate-pulse" />
              <div className="absolute inset-0 rounded-full border-4 border-t-[#2C2B27] animate-spin" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1E1D1A]">AI Coach Crafting Your Syllabus</h3>
              <p className="text-xs text-[#7C786E] mt-2 max-w-xs mx-auto animate-pulse">{planLoadingStatus}</p>
            </div>
          </div>
        ) : (
          <div className="warm-card bg-white flex flex-col overflow-hidden shadow-lg h-[650px] relative border border-[#FDF2F8] rounded-3xl">
            {/* Coach Chat Header */}
            <div className="px-6 py-4 border-b border-[#FDF2F8] bg-[#FFF5F7] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FCE7F3] border border-[#E8DFB3] flex items-center justify-center text-[#be185d] relative shadow-inner">
                  <Bot className="w-5 h-5" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1E1D1A] leading-tight">Coach Pinky</h3>
                  <span className="text-[10px] text-[#7C786E] font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                    Online • Active Guidance
                  </span>
                </div>
              </div>

              {/* Progress and Actions */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] text-[#7C786E] font-bold block uppercase tracking-wider">
                    Calibration Progress
                  </span>
                  <span className="text-xs font-bold text-[#be185d]">
                    Step {chatStep + 1} of 10
                  </span>
                </div>
                
                {/* Visual Progress Bar */}
                <div className="w-20 h-1.5 bg-[#FCE7F3] rounded-full overflow-hidden border border-[#E8DFB3]">
                  <div 
                    className="h-full bg-[#be185d] transition-all duration-300"
                    style={{ width: `${(chatStep + 1) * 10}%` }}
                  />
                </div>

                {chatStep > 0 && (
                  <button
                    onClick={handleGoBack}
                    className="p-2 rounded-xl bg-white border border-[#FCE7F3] hover:bg-[#FFF5F7] text-[#7C786E] hover:text-[#1E1D1A] transition-all cursor-pointer shadow-sm flex items-center gap-1 text-[10px] font-bold"
                    title="Go back a question"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                )}
              </div>
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-[#FAF9F6]/30 animate-in fade-in duration-200">
              {chatMessages.map((msg) => {
                const isAi = msg.sender === "ai";
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 max-w-[85%] ${
                      isAi ? "self-start" : "self-end flex-row-reverse ml-auto"
                    } animate-in fade-in slide-in-from-bottom-2 duration-300`}
                  >
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                      isAi 
                        ? "bg-[#FCE7F3] border border-[#E8DFB3] text-[#be185d]" 
                        : "bg-[#2C2B27] text-white"
                    }`}>
                      {isAi ? <Bot className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
                    </div>

                    {/* Speech Bubble */}
                    <div className="space-y-1">
                      <div className={`px-4 py-3 rounded-2xl text-xs md:text-sm leading-relaxed shadow-sm ${
                        isAi 
                          ? "bg-white text-[#1E1D1A] border border-[#FCE7F3] rounded-tl-none" 
                          : "bg-[#2C2B27] text-white rounded-tr-none font-medium"
                      }`}>
                        <span className="whitespace-pre-line">{msg.text}</span>
                      </div>
                      
                      {/* Timestamp */}
                      <span className={`text-[9px] text-[#7C786E] block px-1 ${
                        isAi ? "text-left" : "text-right"
                      }`}>
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex items-start gap-2.5 max-w-[80%] self-start animate-in fade-in duration-200">
                  <div className="w-8 h-8 rounded-full bg-[#FCE7F3] border border-[#E8DFB3] text-[#be185d] flex items-center justify-center shrink-0 shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="px-4 py-3 bg-white border border-[#FCE7F3] rounded-2xl rounded-tl-none shadow-sm flex items-center space-x-1.5 h-[38px]">
                    <span className="w-1.5 h-1.5 bg-[#7C786E]/80 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-[#7C786E]/80 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-[#7C786E]/80 rounded-full animate-bounce" />
                  </div>
                </div>
              )}

              {/* Anchor for Auto-scroll */}
              <div ref={chatEndRef} />
            </div>

            {/* Interactive Options Dock */}
            <div className="px-6 py-4 bg-[#FFF5F7] border-t border-[#FDF2F8] space-y-3">
              <span className="text-[10px] text-[#7C786E] font-bold block uppercase tracking-wider mb-1">
                Select Your Choice:
              </span>

              {/* Step 0: Calibration */}
              {chatStep === 0 && !isTyping && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 animate-in zoom-in-95 duration-200">
                  {(["Beginner", "Intermediate", "Advanced"] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => handleUserAnswer(`${lvl} Level 🟢`, lvl)}
                      className={`p-3 rounded-2xl border bg-white flex flex-col items-center justify-center transition-all cursor-pointer shadow-sm border-[#FCE7F3] hover:border-[#FCE7F3] hover:scale-[1.01]`}
                    >
                      <span className="text-xs font-bold text-[#1E1D1A]">{lvl}</span>
                      <span className="text-[9px] text-[#7C786E] text-center mt-1 font-medium leading-tight">
                        {lvl === "Beginner" && "Basic arrays/strings & sort"}
                        {lvl === "Intermediate" && "Sliding window, stacks, medium patterns"}
                        {lvl === "Advanced" && "Dynamic Programming & Graphs"}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Step 1: Goal */}
              {chatStep === 1 && !isTyping && (
                <div className="flex flex-wrap gap-2 animate-in zoom-in-95 duration-200">
                  {[
                    "Crack FAANG / Tier-1 companies 🚀",
                    "Prepare for upcoming college placement tests 🎓",
                    "Improve standard problem-solving speed ⚡",
                    "General skill upgrading & mastering algorithms 🛠️"
                  ].map((goal) => (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => handleUserAnswer(goal, goal)}
                      className="py-2.5 px-4 rounded-xl border border-[#FCE7F3] bg-white text-xs font-bold text-[#1E1D1A] hover:border-[#FCE7F3] hover:bg-[#FFF5F7] transition-all cursor-pointer shadow-sm"
                    >
                      {goal}
                    </button>
                  ))}
                </div>
              )}

              {/* Step 2: Language */}
              {chatStep === 2 && !isTyping && (
                <div className="flex flex-wrap gap-2 animate-in zoom-in-95 duration-200">
                  {[
                    "JavaScript (ES6) 🟨",
                    "TypeScript 🟦",
                    "Python 🐍",
                    "Java ☕",
                    "C++ 🔵"
                  ].map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => handleUserAnswer(lang, lang)}
                      className="py-2.5 px-4 rounded-xl border border-[#FCE7F3] bg-white text-xs font-bold text-[#1E1D1A] hover:border-[#FCE7F3] hover:bg-[#FFF5F7] transition-all cursor-pointer shadow-sm"
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              )}

              {/* Step 3: Duration */}
              {chatStep === 3 && !isTyping && (
                <div className="flex flex-wrap gap-2 animate-in zoom-in-95 duration-200">
                  {[
                    { label: "5 Days (Sprint) 🏃", value: 5 },
                    { label: "10 Days (Short-term) 📅", value: 10 },
                    { label: "15 Days (Balanced) ⚖️", value: 15 },
                    { label: "30 Days (Standard) 🗓️", value: 30 },
                    { label: "45 Days (Thorough) 🔍", value: 45 },
                    { label: "90 Days (Ultimate Mastery) 🏆", value: 90 }
                  ].map((dur) => (
                    <button
                      key={dur.value}
                      type="button"
                      onClick={() => handleUserAnswer(dur.label, dur.value)}
                      className="py-2.5 px-4 rounded-xl border border-[#FCE7F3] bg-white text-xs font-bold text-[#1E1D1A] hover:border-[#FCE7F3] hover:bg-[#FFF5F7] transition-all cursor-pointer shadow-sm"
                    >
                      {dur.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Step 4: Daily Volume */}
              {chatStep === 4 && !isTyping && (
                <div className="grid grid-cols-3 gap-2.5 animate-in zoom-in-95 duration-200">
                  {[
                    { label: "1 problem / day (Casual) ☕", value: 1 },
                    { label: "2 problems / day (Steady) 🚀", value: 2 },
                    { label: "3 problems / day (Intensive) 🔥", value: 3 }
                  ].map((num) => (
                    <button
                      key={num.value}
                      type="button"
                      onClick={() => handleUserAnswer(num.label, num.value)}
                      className="py-3 px-2 rounded-2xl border border-[#FCE7F3] bg-white text-xs font-bold text-[#1E1D1A] hover:border-[#FCE7F3] hover:bg-[#FFF5F7] transition-all cursor-pointer text-center shadow-sm"
                    >
                      {num.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Step 5: Topics (Multi-select) */}
              {chatStep === 5 && !isTyping && (
                <div className="space-y-3 animate-in zoom-in-95 duration-200">
                  <div className="flex flex-wrap gap-1.5 max-h-[120px] overflow-y-auto pr-1">
                    {topicOptions.map((topic) => {
                      const isSelected = selectedTopics.includes(topic);
                      return (
                        <button
                          key={topic}
                          type="button"
                          onClick={() => handleTopicToggle(topic)}
                          className={`py-1.5 px-3 rounded-lg border text-[11px] font-bold transition-all cursor-pointer ${
                            isSelected
                              ? "bg-[#FCE7F3] text-[#be185d] border-[#E8DFB3] scale-[1.01]"
                              : "bg-white border-[#FCE7F3] text-[#7C786E] hover:text-[#1E1D1A] hover:border-[#FCE7F3]"
                          }`}
                        >
                          {topic}
                        </button>
                      );
                    })}
                  </div>
                  
                  <div className="flex justify-between items-center pt-1.5 border-t border-[#FCE7F3]">
                    <span className="text-[10px] text-[#7C786E] font-medium">
                      Selected: <span className="font-bold text-[#be185d]">{selectedTopics.length} topics</span>
                    </span>
                    
                    <button
                      type="button"
                      disabled={selectedTopics.length === 0}
                      onClick={() => handleUserAnswer(`Target Topics: ${selectedTopics.join(", ")}`, selectedTopics)}
                      className="py-1.5 px-4 rounded-xl bg-[#2C2B27] hover:bg-[#1E1D1A] text-white font-bold text-xs transition-all shadow-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Confirm Topics & Proceed ➔
                    </button>
                  </div>
                </div>
              )}

              {/* Step 6: Daily Hours */}
              {chatStep === 6 && !isTyping && (
                <div className="flex flex-wrap gap-2 animate-in zoom-in-95 duration-200">
                  {[
                    "1 Hour ⏱️",
                    "2 Hours ⏰",
                    "3+ Hours ⚡"
                  ].map((hours) => (
                    <button
                      key={hours}
                      type="button"
                      onClick={() => handleUserAnswer(hours, hours)}
                      className="py-2.5 px-4 rounded-xl border border-[#FCE7F3] bg-white text-xs font-bold text-[#1E1D1A] hover:border-[#FCE7F3] hover:bg-[#FFF5F7] transition-all cursor-pointer shadow-sm"
                    >
                      {hours}
                    </button>
                  ))}
                </div>
              )}

              {/* Step 7: Practice Platforms */}
              {chatStep === 7 && !isTyping && (
                <div className="flex flex-wrap gap-2 animate-in zoom-in-95 duration-200">
                  {[
                    "LeetCode Focused 💻",
                    "GeeksforGeeks Focused 📝",
                    "CodeChef Focused 🏆",
                    "Balanced Mix of All 🔀"
                  ].map((platform) => (
                    <button
                      key={platform}
                      type="button"
                      onClick={() => handleUserAnswer(platform, platform)}
                      className="py-2.5 px-4 rounded-xl border border-[#FCE7F3] bg-white text-xs font-bold text-[#1E1D1A] hover:border-[#FCE7F3] hover:bg-[#FFF5F7] transition-all cursor-pointer shadow-sm"
                    >
                      {platform}
                    </button>
                  ))}
                </div>
              )}

              {/* Step 8: Placement Timeline */}
              {chatStep === 8 && !isTyping && (
                <div className="flex flex-wrap gap-2 animate-in zoom-in-95 duration-200">
                  {[
                    "Immediate (this month) 📅",
                    "Within 3 Months 🗓️",
                    "6+ Months ⏳",
                    "No rush, just learning 🚀"
                  ].map((timeline) => (
                    <button
                      key={timeline}
                      type="button"
                      onClick={() => handleUserAnswer(timeline, timeline)}
                      className="py-2.5 px-4 rounded-xl border border-[#FCE7F3] bg-white text-xs font-bold text-[#1E1D1A] hover:border-[#FCE7F3] hover:bg-[#FFF5F7] transition-all cursor-pointer shadow-sm"
                    >
                      {timeline}
                    </button>
                  ))}
                </div>
              )}

              {/* Step 9: Final Review & Confirm */}
              {chatStep === 9 && !isTyping && (
                <div className="space-y-4 animate-in zoom-in-95 duration-200">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 p-4 rounded-2xl bg-white border border-[#FCE7F3] text-xs font-semibold shadow-inner">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-[#7C786E] block">Calibration</span>
                      <span className="text-[#1E1D1A] font-bold">{level}</span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-[#7C786E] block">Duration</span>
                      <span className="text-[#1E1D1A] font-bold">{totalDays} Days</span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-[#7C786E] block">Pace</span>
                      <span className="text-[#1E1D1A] font-bold">{problemsPerDay} Probs/Day</span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-[#7C786E] block">Language</span>
                      <span className="text-[#1E1D1A] font-bold">{userLang}</span>
                    </div>
                    <div className="col-span-2 space-y-0.5">
                      <span className="text-[10px] text-[#7C786E] block">Primary Goal</span>
                      <span className="text-[#1E1D1A] font-bold line-clamp-1">{userGoal}</span>
                    </div>
                    <div className="col-span-2 space-y-0.5">
                      <span className="text-[10px] text-[#7C786E] block">Focus Topics</span>
                      <span className="text-[#1E1D1A] font-bold line-clamp-1">{selectedTopics.join(", ")}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCreatePlan()}
                    className="w-full py-3.5 rounded-2xl bg-[#2C2B27] hover:bg-[#1E1D1A] text-white font-extrabold text-sm tracking-wider transition-all shadow-md hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer pulse-glow"
                  >
                    <Sparkles className="w-4.5 h-4.5 text-[#ec4899]" />
                    <span>🚀 BUILD MY CUSTOM STUDY PLAN</span>
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Text Input Bar */}
            <form onSubmit={handleSendTypedMessage} className="p-4 border-t border-[#FDF2F8] flex gap-2.5 bg-white">
              <input
                type="text"
                value={typedInput}
                onChange={(e) => setTypedInput(e.target.value)}
                disabled={chatStep === 5 || chatStep === 9 || isTyping}
                placeholder={
                  chatStep === 5
                    ? "Select topics using the selector tags above..."
                    : chatStep === 9
                    ? "Confirm your profile summary above to generate the plan!"
                    : "Type your message or custom response here..."
                }
                className="flex-1 py-2.5 px-4 rounded-xl border border-[#FCE7F3] text-xs md:text-sm focus:outline-none focus:border-[#be185d] transition-colors bg-[#FFF5F7]/40 disabled:bg-[#FFF5F7]/20 disabled:cursor-not-allowed text-[#1E1D1A]"
              />
              <button
                type="submit"
                disabled={!typedInput.trim() || chatStep === 5 || chatStep === 9 || isTyping}
                className="p-2.5 rounded-xl bg-[#2C2B27] text-white hover:bg-[#1E1D1A] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm flex items-center justify-center shrink-0 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    );
  }

  // ══════════════════════════════════════════════════
  // RENDER 2: STUDY PLAN ROADMAP DASHBOARD
  // ══════════════════════════════════════════════════
  const activeDayPlan = planData.planRoadmap?.find((p: any) => p.day === planData.currentDayIndex);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative text-[#1E1D1A] max-w-[1360px] mx-auto pb-12">
      
      {/* Page Header (Styled like the May 2025 calendar view header) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-4 border-b border-[#E5E2D6]/60">
        <div>
          <span className="text-[10px] text-[#7C786E] font-bold uppercase tracking-wider block">
            June 2026
          </span>
          <h1 className="text-3xl font-black text-[#1E1D1A] tracking-tighter mt-1 flex items-center gap-2">
            <span className="uppercase">Dynamic Coding Engine</span>
            <span className="text-sm text-justify font-semibold px-2 py-0.5 rounded-full bg-white border uppercase border-[#FCE7F3] text-[#be185d] tracking-widest">
              {planData.level}
            </span>
          </h1>
        </div>

        {/* Calendar stats & Pill style actions */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E8DFB3] text-[#be185d] font-bold text-[11px] shadow-sm">
            <Flame className="w-3.5 h-3.5 text-[#ec4899] fill-current" />
            <span>Streak: {dailyStreak} Days</span>
          </div>

          <div className="px-3.5 py-1.5 rounded-full bg-white border border-[#FCE7F3] font-bold text-[11px] text-[#1E1D1A] shadow-sm">
            Points: <span className="text-[#be185d]">{streakPoints}</span>
          </div>

          <button
            onClick={handleResetPlan}
            className="px-4 py-1.5 rounded-full bg-[#2C2B27] hover:bg-[#1E1D1A] text-white font-extrabold text-[11px] flex items-center gap-1 shadow-sm transition-all cursor-pointer"
            title="Reset Plan"
          >
            <RotateCcw className="w-3 h-3 text-[#ec4899] stroke-[3]" />
            <span>Reset Path</span>
          </button>
        </div>
      </div>

      {/* Bento Grid Layout (Timeline + Widgets Panels) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left/Center Panel: Main Timeline Days View (col-span-8) */}
        <div className="lg:col-span-8 space-y-8">
          {planData.planRoadmap?.map((dayItem: any) => {
            const isCompleted = dayItem.day < planData.currentDayIndex;
            const isActive = dayItem.day === planData.currentDayIndex;
            const isLocked = dayItem.day > planData.currentDayIndex;

            return (
              <div 
                key={dayItem.day} 
                className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-4 md:gap-6 border-b border-[#E5E2D6]/30 pb-8 last:border-0 last:pb-0"
              >
                {/* Left Column: Big Date/Day display */}
                <div className="flex md:flex-col items-baseline md:items-start gap-2 pt-1">
                  <span className={`text-6xl md:text-7xl font-black tracking-tighter leading-none ${
                    isActive ? "text-[#be185d]" : "text-[#2C2B27]/85"
                  }`}>
                    {dayItem.day < 10 ? `0${dayItem.day}` : dayItem.day}
                  </span>
                  <span className={`text-[10px] font-extrabold uppercase tracking-widest block md:mt-1 ${
                    isActive ? "text-[#be185d]" : "text-[#7C786E]"
                  }`}>
                    {isActive ? "Active" : isCompleted ? "Solved ✓" : "Locked"}
                  </span>
                </div>

                {/* Right Column: Cards representing syllabus items / challenges */}
                <div className="space-y-4">
                  {isActive ? (
                    /* Dotted border wrapper mimicking the active slot in reference mockup */
                    <div className="border-2 border-dashed border-[#FCE7F3] rounded-[28px] p-5 md:p-6 bg-white/45 relative space-y-4">
                      {/* Red bar highlighting active day */}
                      <div className="absolute top-0 left-0 h-[3px] bg-[#be185d] rounded-full" />

                      {/* Header containing topic summary */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#FDF2F8]">
                        <div>
                          <span className="text-[9px] text-[#7C786E] font-bold uppercase tracking-widest block">
                            Active  • Day {dayItem.day}
                          </span>
                          <h2 className="text-xl font-bold text-[#1E1D1A] tracking-tight mt-0.5">
                            {dayItem.topic}
                          </h2>
                          <p className="text-xs text-[#7C786E] leading-relaxed mt-1 max-w-xl">
                            {dayItem.description}
                          </p>
                        </div>
                        <div className="px-3.5 py-1 uppercase rounded-xl bg-white border border-[#FCE7F3] font-bold text-xs text-[#be185d] self-start sm:self-auto shadow-sm">
                          Target: {planData.problemsPerDay} Solves
                        </div>
                      </div>

                      {/* Problem lists for active day */}
                      {generatingProblems ? (
                        <div className="py-8 flex flex-col items-center justify-center space-y-3 text-center">
                          <Loader2 className="w-8 h-8 text-[#be185d] animate-spin" />
                          <div>
                            <p className="text-xs font-bold text-[#1E1D1A]">AI Coach Customizing Problems...</p>
                            <p className="text-[10px] text-[#7C786E] mt-1">Reviewing completed history to select unique tasks.</p>
                          </div>
                        </div>
                      ) : currentProblems.length === 0 ? (
                        /* State: problems not generated yet */
                        <div className="p-6 border-2 border-dashed border-[#FCE7F3] rounded-2xl text-center space-y-4 bg-[#FFF5F7]/30">
                          <div className="w-10 h-10 rounded-xl bg-[#FCE7F3] border border-[#E8DFB3] flex items-center justify-center text-[#be185d] mx-auto">
                            <BookOpen className="w-5 h-5" />
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-bold text-xs text-[#1E1D1A]">Syllabus challenges are ready to initialize</h4>
                            <p className="text-[10px] text-[#7C786E] max-w-xs mx-auto leading-relaxed">
                              Select from active LeetCode, GeeksforGeeks, or CodeChef matching links.
                            </p>
                          </div>
                          <button
                            onClick={handleGenerateTodayProblems}
                            className="py-2 px-5 rounded-full bg-[#2C2B27] hover:bg-[#1E1D1A] text-white font-bold text-xs transition-all shadow-sm cursor-pointer inline-flex items-center gap-1.5"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Load Today's Problems</span>
                          </button>
                        </div>
                      ) : (
                        /* State: problems generated and listed */
                        <div className="space-y-3">
                          {currentProblems.map((problem) => (
                            <div
                              key={problem.id}
                              className={`p-4 rounded-[20px] border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white ${
                                problem.completed
                                  ? "border-[#FCE7F3] bg-[#FFF5F7]/20 opacity-75"
                                  : "border-[#FCE7F3] hover:border-[#be185d] hover:shadow-sm"
                              }`}
                            >
                              <div className="flex items-start gap-3.5 min-w-0">
                                {/* Interactive Checkbox */}
                                <div
                                  className="shrink-0 mt-1 cursor-pointer select-none"
                                  onClick={() => handleToggleProblemCheckbox(problem.id, !problem.completed)}
                                  title={problem.completed ? "Mark incomplete" : "Mark completed"}
                                >
                                  {problem.completed ? (
                                    <div className="w-5 h-5 rounded-md bg-emerald-600 border border-emerald-700 text-white flex items-center justify-center shadow-sm hover:scale-105 transition-all">
                                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                                    </div>
                                  ) : (
                                    <div className="w-5 h-5 rounded-md border border-[#FCE7F3] bg-white hover:border-[#be185d] flex items-center justify-center" />
                                  )}
                                </div>

                                <div className="min-w-0 space-y-1">
                                  <div className="flex items-center gap-2">
                                    {/* Small indicator bar */}
                                    <div className={`w-1 h-3.5 rounded-full ${
                                      problem.difficulty === "Easy" ? "bg-emerald-500" :
                                      problem.difficulty === "Medium" ? "bg-[#be185d]" : "bg-red-500"
                                    }`} />
                                    <h4 className={`text-xs md:text-sm font-extrabold tracking-tight ${
                                      problem.completed ? "text-[#7C786E] line-through" : "text-[#1E1D1A]"
                                    }`}>
                                      {problem.title}
                                    </h4>
                                  </div>
                                  <p className="text-[10px] md:text-[11px] text-[#7C786E] leading-relaxed line-clamp-1 pl-3">
                                    {problem.description}
                                  </p>
                                  
                                  <div className="flex items-center gap-2.5 pt-0.5 pl-3 text-[9px] font-bold text-[#7C786E]">
                                    <span className="uppercase tracking-wider">{problem.category}</span>
                                    <span>•</span>
                                    <a
                                      href={problem.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-[#be185d] hover:underline uppercase flex items-center gap-0.5"
                                    >
                                      <span>{problem.platform} Link</span>
                                      <ExternalLink className="w-2.5 h-2.5" />
                                    </a>
                                  </div>
                                </div>
                              </div>

                              {/* Difficulty tag & Solve actions */}
                              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                                <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wide border ${
                                  problem.difficulty === "Easy"
                                    ? "text-emerald-700 bg-white border-black"
                                    : problem.difficulty === "Medium"
                                    ? "text-[#be185d] bg-[#FCE7F3] border-[#E8DFB3]"
                                    : "text-red-700 bg-red-50 border-red-200"
                                }`}>
                                  {problem.difficulty}
                                </span>

                                <button
                                  onClick={() => handleOpenSolveModal(problem)}
                                  disabled={problem.completed}
                                  className={`py-1.5 px-3.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                                    problem.completed
                                      ? "bg-zinc-100 text-zinc-400 border border-transparent cursor-not-allowed"
                                      : "bg-[#2C2B27] text-white hover:bg-[#1E1D1A]"
                                  }`}
                                >
                                  <Play className="w-2.5 h-2.5 fill-current shrink-0" />
                                  <span>{problem.completed ? "Solved" : "Solve"}</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Day Completed & Advance Day button */}
                      {allCompletedToday && (
                        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in zoom-in-95 mt-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                              <Award className="w-4.5 h-4.5" />
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-emerald-800">Day {dayItem.day} Completed!</h4>
                              <p className="text-[9px] text-emerald-600 leading-normal mt-0.5">
                                You solved all daily targets. Unlock tomorrow's syllabus area.
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={handleAdvanceDay}
                            className="py-1.5 px-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all cursor-pointer shadow-sm flex items-center gap-1"
                          >
                            <span>Unlock Next Day</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  ) : isCompleted ? (
                    /* Completed Day details card (compact) */
                    <div className="p-4 rounded-[20px] border border-[#FCE7F3] bg-[#FFF5F7]/30 flex items-center justify-between gap-4 opacity-80 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-600/10 border border-emerald-500/20 text-emerald-700 flex items-center justify-center shrink-0">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-[#7C786E] leading-none">
                            Day {dayItem.day}: {dayItem.topic}
                          </h4>
                          <p className="text-[10px] text-[#7C786E]/80 mt-1 line-clamp-1">
                            {dayItem.description}
                          </p>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold uppercase text-[#7C786E] tracking-wider px-2 py-0.5 rounded-md bg-white border border-[#FCE7F3]">
                        Completed
                      </span>
                    </div>
                  ) : (
                    /* Locked Day details card (Empty meeting calendar look) */
                    <div className="p-5 rounded-[24px] border border-[#FCE7F3] bg-[#FFF5F7]/10 flex flex-col justify-center items-center text-center space-y-2 opacity-60">
                      <div className="w-8 h-8 rounded-full bg-zinc-200/50 flex items-center justify-center text-zinc-500">
                        <Lock className="w-3.5 h-3.5" />
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-[#1E1D1A]">Day {dayItem.day}: {dayItem.topic}</h4>
                        <p className="text-[10px] text-[#7C786E] leading-normal">{dayItem.description}</p>
                      </div>
                      <span className="text-[9px] font-bold text-[#7C786E] uppercase tracking-wide">
                        Locked until previous days are solved
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Panel: AI Assistant & Widgets Column (col-span-4) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Widget 1: Ai Sumari (AI Summary with Soundwaves) */}
          <div className="warm-card p-6 bg-white space-y-4">
            <div className="flex items-center justify-between pb-1 border-b border-[#FDF2F8]">
              <div>
                <h3 className="text-xs font-bold text-[#7C786E] uppercase tracking-widest">
                  Ai Sumarry
                </h3>
                <span className="text-[9px] text-[#be185d] font-semibold">Active Coach Guidance</span>
              </div>
              <div className="w-7 h-7 rounded-full bg-[#FCE7F3] border border-[#E8DFB3] flex items-center justify-center text-[#be185d]">
                <Bot className="w-4 h-4" />
              </div>
            </div>

            {/* Simulated sound waves visual */}
            <div className="flex items-center justify-between bg-gray-100 p-3 rounded-2xl border border-[#FCE7F3]">
              <button
                onClick={() => setIsAudioPlaying(!isAudioPlaying)}
                className="w-8 h-8 rounded-full bg-[#2C2B27] hover:bg-[#1E1D1A] text-white flex items-center justify-center shadow-sm shrink-0 transition-all cursor-pointer"
              >
                {isAudioPlaying ? (
                  <Pause className="w-3.5 h-3.5 text-[#ec4899] fill-current" />
                ) : (
                  <Play className="w-3.5 h-3.5 text-[#ec4899] fill-current ml-0.5" />
                )}
              </button>

              {/* Waves animated when active */}
              <div className="flex-1 flex items-center justify-center gap-0.5 px-4 h-6">
                {[...Array(14)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-0.5 rounded-full transition-all duration-300 ${
                      isAudioPlaying ? "bg-[#be185d] animate-wave-bar" : "bg-[#7C786E]/40"
                    }`}
                    style={{
                      height: isAudioPlaying 
                        ? `${Math.floor(Math.random() * 16) + 4}px` 
                        : "4px",
                      animationDelay: `${i * 0.06}s`,
                      animationDuration: "0.8s"
                    }}
                  />
                ))}
              </div>

              {/* Time display */}
              <span className="text-[10px] font-mono font-bold text-[#7C786E] w-[26px]">
                {audioTime < 10 ? `0:${audioTime}` : `0:${audioTime}`}
              </span>
            </div>

            {/* Dialogue bubble */}
            <div className="bg-[#FAF9F6] border border-[#FCE7F3]/70 p-4 rounded-2xl relative shadow-inner">
              <p className="text-[11px] text-[#1E1D1A] leading-relaxed italic">
                {generatingProblems 
                  ? "Calibrating targets... Keep your focus high, placement prep is a marathon, not a sprint!"
                  : currentProblems.length === 0 
                  ? "Click 'Load Problems' to fetch today's syllabus tasks. We are targeting " + (activeDayPlan?.topic || "your custom schedule") + "!"
                  : allCompletedToday 
                  ? "Magnificent progress! You cleared all challenges for Day " + planData.currentDayIndex + ". Unlock the next day to keep the streak hot."
                  : "Great! Today is Day " + planData.currentDayIndex + " of your " + planData.totalDays + "-day sprint. We are practicing " + (activeDayPlan?.topic || "DSA") + ". Solve the problem targets to gain Points!"
                }
              </p>
              <div className="absolute -top-1.5 left-6 w-3 h-3 bg-[#FAF9F6] border-t border-l border-[#FCE7F3]/70 rotate-45" />
            </div>
          </div>

          {/* Widget 2: Practice Stopwatch Timer */}
          <div className="warm-card p-6 bg-white space-y-4">
            <div className="flex justify-between items-center pb-1 border-b border-[#FDF2F8]">
              <div>
                <h3 className="text-xs font-bold text-[#7C786E] uppercase tracking-widest">
                  Practice Clock
                </h3>
                <span className="text-[9px] text-[#be185d] font-semibold">Daily Prep Target</span>
              </div>
              <Clock className="w-4.5 h-4.5 text-[#7C786E]" />
            </div>

            {/* Circular stopwatch layout */}
            <div className="flex items-center justify-center gap-6 py-2">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    className="stroke-[#FFF5F7]"
                    strokeWidth="5"
                    fill="transparent"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    className="stroke-[#be185d] transition-all duration-1000 ease-out"
                    strokeWidth="5"
                    fill="transparent"
                    strokeDasharray="251.3"
                    strokeDashoffset={251.3 - (251.3 * (practiceTimerSec / 7200))}
                    strokeLinecap="round"
                  />
                </svg>

                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-[11px] font-black text-[#1E1D1A] tracking-tight">
                    {Math.floor(practiceTimerSec / 3600) < 10 ? `0${Math.floor(practiceTimerSec / 3600)}` : Math.floor(practiceTimerSec / 3600)}:
                    {Math.floor((practiceTimerSec % 3600) / 60) < 10 ? `0${Math.floor((practiceTimerSec % 3600) / 60)}` : Math.floor((practiceTimerSec % 3600) / 60)}:
                    {practiceTimerSec % 60 < 10 ? `0${practiceTimerSec % 60}` : practiceTimerSec % 60}
                  </span>
                  <span className="text-[8px] uppercase font-bold text-[#7C786E] tracking-wider -mt-0.5">Focus</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setIsTimerActive(!isTimerActive)}
                  className="w-9 h-9 rounded-full bg-[#2C2B27] hover:bg-[#1E1D1A] text-white flex items-center justify-center shadow-sm cursor-pointer transition-colors"
                >
                  {isTimerActive ? (
                    <Pause className="w-4 h-4 text-[#ec4899]" />
                  ) : (
                    <Play className="w-4 h-4 fill-white text-white ml-0.5" />
                  )}
                </button>
                <button
                  onClick={() => {
                    setIsTimerActive(false);
                    setPracticeTimerSec(7200);
                  }}
                  className="w-9 h-9 rounded-full bg-[#FFF5F7] border border-[#FCE7F3] hover:bg-white text-[#2C2B27] flex items-center justify-center shadow-sm cursor-pointer"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Yellow card block mimicking meeting reminder in mockup */}
            <div className="p-3.5 rounded-2xl bg-[#FEF08A] border border-[#FEF08A] shadow-sm text-zinc-900 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/60 flex items-center justify-center text-amber-700">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-amber-900 leading-tight">Daily Target Session</h4>
                <p className="text-[9px] font-semibold text-amber-800 mt-0.5">Solve problems within 2 hours to earn +150 Points.</p>
              </div>
            </div>
          </div>

          {/* Widget 3: Cheatsheet Deck (stacked cards) */}
          <div className="warm-card p-6 bg-white space-y-4">
            <div className="flex items-center justify-between pb-1 border-b border-[#FDF2F8]">
              <div>
                <h3 className="text-xs font-bold text-[#7C786E] uppercase tracking-widest">
                  Docs & Cheatsheets
                </h3>
                <span className="text-[9px] text-[#be185d] font-semibold">Quick Concept Reference</span>
              </div>
              <Layers className="w-4.5 h-4.5 text-[#7C786E]" />
            </div>

            {/* Overlay card deck */}
            <div className="relative h-44 mt-2">
              {[
                {
                  id: "arrays",
                  title: "Arrays Cheat Sheet",
                  bg: "bg-[#FFF5F7] border-[#FCE7F3]",
                  text: "text-[#be185d]",
                  content: "Search: O(N)\nAccess: O(1)\nInsert/Delete: O(N)\nCommon patterns: Two Pointers, Sliding Window."
                },
                {
                  id: "recursion",
                  title: "Recursion & Trees",
                  bg: "bg-white border-[#FCE7F3]",
                  text: "text-[#1E1D1A]",
                  content: "Base Case verification is crucial.\nPreorder: Root -> L -> R\nInorder: L -> Root -> R\nPostorder: L -> R -> Root"
                },
                {
                  id: "complexity",
                  title: "Complexity Matrix",
                  bg: "bg-[#2C2B27] border-[#1E1D1A] text-white",
                  text: "text-emerald-400",
                  content: "N <= 10^5: O(N) or O(N log N) expected.\nN <= 100: O(N^3) accepted.\nN <= 20: O(2^N) backtracking."
                }
              ].map((card, index) => {
                const isExpanded = expandedCheatCard === card.id;
                const offset = index * 10;
                return (
                  <div
                    key={card.id}
                    onClick={() => setExpandedCheatCard(isExpanded ? null : card.id)}
                    className={`absolute left-0 right-0 p-4 border rounded-2xl cursor-pointer transition-all duration-300 shadow-sm ${
                      card.bg
                    }`}
                    style={{
                      top: isExpanded ? "-15px" : `${offset}px`,
                      zIndex: isExpanded ? 30 : index + 10,
                      transform: isExpanded ? "scale(1.02)" : "scale(1)",
                    }}
                  >
                    <div className="flex justify-between items-center pb-1.5 border-b border-dashed border-[#FCE7F3]/40">
                      <span className="text-xs font-black truncate">{card.title}</span>
                      <span className={`text-[8px] font-bold uppercase tracking-wider ${card.text}`}>
                        {isExpanded ? "Collapse" : "Click to Read"}
                      </span>
                    </div>
                    {isExpanded ? (
                      <p className="text-[10px] leading-relaxed mt-2 whitespace-pre-line font-mono font-semibold">
                        {card.content}
                      </p>
                    ) : (
                      <p className="text-[10px] leading-relaxed mt-2 line-clamp-2 opacity-60">
                        {card.content}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Widget 4: Concept Search / Patterns */}
          <div className="warm-card p-6 bg-white space-y-4">
            <div className="flex items-center justify-between pb-1 border-b border-[#FDF2F8]">
              <div>
                <h3 className="text-xs font-bold text-[#7C786E] uppercase tracking-widest">
                  Search Patterns
                </h3>
                <span className="text-[9px] text-[#be185d] font-semibold">Explore DSA Recipes</span>
              </div>
              <Search className="w-4.5 h-4.5 text-[#7C786E]" />
            </div>

            {/* Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search dp, sliding window..."
                value={conceptSearchQuery}
                onChange={(e) => setConceptSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-[#FCE7F3] text-xs focus:outline-none focus:border-[#be185d] bg-[#FFF5F7]/30 text-zinc-900"
              />
              <Search className="w-3.5 h-3.5 text-[#7C786E] absolute left-2.5 top-2.5" />
            </div>

            {/* Filtered Concept Results */}
            <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
              {[
                { name: "Sliding Window", desc: "For contiguous subarrays/substrings. Time: O(N)." },
                { name: "Two Pointers", desc: "For sorted arrays. Meets in the middle or slow/fast. Time: O(N)." },
                { name: "Binary Search", desc: "For sorted bounds / search space. Time: O(log N)." },
                { name: "Dynamic Programming", desc: "Subproblem optimal structure + overlap memoization." },
                { name: "Backtracking", desc: "DFS search space exploration. Time: Exponential O(2^N)." }
              ]
                .filter(c => c.name.toLowerCase().includes(conceptSearchQuery.toLowerCase()) || c.desc.toLowerCase().includes(conceptSearchQuery.toLowerCase()))
                .map((concept, index) => (
                  <div key={index} className="p-2.5 rounded-xl bg-[#FFF5F7]/40 border border-[#FCE7F3] space-y-0.5 hover:bg-white transition-colors text-xs">
                    <span className="font-extrabold text-[#be185d] block text-[11px]">{concept.name}</span>
                    <span className="text-[10px] text-[#7C786E] leading-normal block">{concept.desc}</span>
                  </div>
                ))}
            </div>
          </div>

        </div>

      </div>


      {/* Simulated Code Workspace Modal */}
      {activeSolveProblem && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-250">
          <div className="bg-[#FFF5F7] w-full max-w-4xl h-[85vh] rounded-3xl overflow-hidden flex flex-col border border-[#FCE7F3] shadow-2xl relative">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#FDF2F8] flex justify-between items-center bg-white">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#FFF5F7] border border-[#FCE7F3] flex items-center justify-center text-[#1E1D1A]">
                  <Code className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-[#1E1D1A] text-sm md:text-base leading-none">
                    {activeSolveProblem.title}
                  </h3>
                  <span className="text-[10px] text-[#7C786E] font-bold uppercase tracking-wider mt-1.5 block">
                    {activeSolveProblem.category} • {activeSolveProblem.platform}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCloseSolveModal}
                className="p-1.5 rounded-xl bg-[#FFF5F7] hover:bg-[#FFF5F7] border border-[#FCE7F3] text-[#7C786E] hover:text-[#1E1D1A] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              {/* Left Panel: Problem Description */}
              <div className="w-full md:w-5/12 border-r border-[#FDF2F8] p-6 overflow-y-auto space-y-6">
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-[#7C786E] uppercase tracking-widest">
                    Problem Statement
                  </h4>
                  <p className="text-xs text-[#1E1D1A] leading-relaxed whitespace-pre-line">
                    {activeSolveProblem.description}
                  </p>
                </div>

                <div className="space-y-3.5">
                  <h4 className="text-xs font-bold text-[#7C786E] uppercase tracking-widest">
                    Constraints & Performance
                  </h4>
                  <div className="p-3.5 rounded-2xl bg-[#FFF5F7] border border-[#FCE7F3] space-y-2 text-[11px] font-mono text-[#7C786E]">
                    <div>• Time limit: 1.0s</div>
                    <div>• Memory limit: 256MB</div>
                    <div>• Target complexity: O(N) or better</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] text-[#7C786E] font-bold uppercase">
                    <span>Target URL Link</span>
                    <span className="text-emerald-700">Solve & Submit</span>
                  </div>
                  
                  <a
                    href={activeSolveProblem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3.5 rounded-2xl bg-white border border-[#FCE7F3] hover:border-[#FCE7F3] flex items-center justify-between text-xs font-bold text-[#be185d] hover:bg-[#FFF5F7] transition-all group"
                  >
                    <span className="flex items-center gap-1">
                      <span>Open on {activeSolveProblem.platform}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </div>
              </div>

              {/* Right Panel: Code Editor Simulation */}
              <div className="flex-1 flex flex-col bg-[#21201D] overflow-hidden">
                {/* Editor Top Options Bar */}
                <div className="px-4 py-2 bg-[#1E1D1A] border-b border-[#2D2C28] flex items-center justify-between text-[10px] font-bold text-zinc-400 font-mono">
                  <span>main.js</span>
                  <span>ES6 Javascript</span>
                </div>

                {/* Editor Content Area */}
                <div className="flex-1 p-4 font-mono text-xs text-white relative">
                  <textarea
                    value={editorCode}
                    onChange={(e) => setEditorCode(e.target.value)}
                    className="w-full h-full bg-transparent resize-none focus:outline-none font-mono text-[#ec4899] border-none leading-relaxed"
                    spellCheck="false"
                  />
                </div>

                {/* Terminal Outputs Panel */}
                {testOutput.length > 0 && (
                  <div className="h-40 border-t border-[#2D2C28] bg-[#1E1D1A] p-4 font-mono text-[10px] text-zinc-400 overflow-y-auto space-y-1 shadow-inner">
                    <div className="flex items-center gap-1.5 border-b border-zinc-800 pb-1 mb-1 text-zinc-500 font-bold uppercase">
                      <Terminal className="w-3.5 h-3.5 text-[#ec4899]" />
                      <span>Console Logs</span>
                    </div>
                    {testOutput.map((out, index) => (
                      <div
                        key={index}
                        className={
                          out.includes("STATUS: ACCEPTED") || out.includes("passed")
                            ? "text-emerald-400 font-bold"
                            : out.includes("Running") || out.includes("Verifying") || out.includes("Checking")
                            ? "text-[#ec4899]/70"
                            : "text-zinc-350"
                        }
                      >
                        {out}
                      </div>
                    ))}
                  </div>
                )}

                {/* Editor Footer / CTA Button Row */}
                <div className="px-6 py-4 border-t border-[#FDF2F8] bg-white flex items-center justify-end gap-3">
                  <button
                    onClick={handleRunTests}
                    className="py-2.5 px-4 rounded-xl bg-white border border-[#FCE7F3] text-[#7C786E] hover:text-[#1E1D1A] hover:bg-[#FFF5F7] font-bold text-xs transition-colors cursor-pointer shadow-sm"
                  >
                    Run Tests
                  </button>

                  <button
                    onClick={handleSubmitSolution}
                    disabled={isSubmitting}
                    className="py-2.5 px-5 rounded-xl bg-[#2C2B27] hover:bg-[#1E1D1A] text-white font-bold text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer hover:scale-[1.02]"
                  >
                    {isSubmitting ? "Compiling..." : "Submit Solution"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
