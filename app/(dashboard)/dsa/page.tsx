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
  ArrowLeft
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
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-2 border-b border-[#FDF2F8]">
        <div>
          <h1 className="text-4xl font-normal text-[#1E1D1A] tracking-tight">
            Dynamic Coding Engine
          </h1>
          <p className="text-[#7C786E] text-sm mt-2 max-w-xl">
            Prepare with a custom AI roadmap tailored to your target focus areas and difficulty level.
          </p>
        </div>

        {/* Streak & Score Widget */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FCE7F3] border border-[#E8DFB3] text-[#be185d] font-bold text-xs">
            <Flame className="w-4 h-4 text-[#ec4899] fill-current" />
            <span>Streak: {dailyStreak} Days</span>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-white border border-[#FCE7F3] font-bold text-xs text-[#1E1D1A] shadow-sm">
            Points: <span className="text-[#be185d]">{streakPoints}</span>
          </div>

          <button
            onClick={handleResetPlan}
            className="p-2 rounded-xl bg-white border border-[#FCE7F3] hover:bg-[#FFF5F7] text-[#7C786E] hover:text-[#1E1D1A] transition-all cursor-pointer shadow-sm"
            title="Reset Plan"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Plan Timeline / Schedule (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="warm-card p-6 bg-white space-y-5">
            <div>
              <h3 className="text-xs font-bold text-[#7C786E] uppercase tracking-widest">
                Plan Overview
              </h3>
              <div className="mt-3 space-y-2 text-xs font-semibold text-[#1E1D1A]">
                <div className="flex justify-between py-1.5 border-b border-[#FFF5F7]">
                  <span className="text-[#7C786E]">Intensity Level</span>
                  <span>{planData.level}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#FFF5F7]">
                  <span className="text-[#7C786E]">Roadmap Duration</span>
                  <span>{planData.totalDays} Days</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#FFF5F7]">
                  <span className="text-[#7C786E]">Target Pace</span>
                  <span>{planData.problemsPerDay} Problems / Day</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-[#7C786E] uppercase tracking-widest mb-3">
                Syllabus Roadmap
              </h3>
              
              {/* Timeline Track */}
              <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                {planData.planRoadmap?.map((dayItem: any) => {
                  const isCompleted = dayItem.day < planData.currentDayIndex;
                  const isActive = dayItem.day === planData.currentDayIndex;
                  const isLocked = dayItem.day > planData.currentDayIndex;

                  return (
                    <div
                      key={dayItem.day}
                      className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                        isActive
                          ? "bg-[#FCE7F3] border-[#E8DFB3] shadow-sm"
                          : isCompleted
                          ? "bg-[#FFF5F7] border-[#FCE7F3] opacity-75"
                          : "bg-[#FFF5F7]/40 border-[#FCE7F3] opacity-50"
                      }`}
                    >
                      <div className="shrink-0 mt-0.5">
                        {isCompleted ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        ) : isActive ? (
                          <div className="w-5 h-5 rounded-full bg-[#2C2B27] text-white flex items-center justify-center text-[10px] font-bold animate-pulse">
                            {dayItem.day}
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-zinc-200 text-zinc-500 flex items-center justify-center">
                            <Lock className="w-3 h-3" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <h4 className={`text-xs font-bold leading-tight ${isActive ? "text-[#be185d]" : "text-[#1E1D1A]"}`}>
                          Day {dayItem.day}: {dayItem.topic}
                        </h4>
                        <p className="text-[10px] text-[#7C786E] leading-normal mt-0.5 line-clamp-1">
                          {dayItem.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Today's Focus Arena (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="warm-card p-6 bg-white space-y-6">
            
            {/* Header info */}
            <div className="border-b border-[#FDF2F8] pb-4 flex justify-between items-start gap-4">
              <div className="space-y-1">
                <span className="text-[10px] text-[#7C786E] font-bold uppercase tracking-wider">
                  Active Challenge • Day {planData.currentDayIndex} of {planData.totalDays}
                </span>
                <h2 className="text-xl font-bold text-[#1E1D1A] tracking-tight">
                  {activeDayPlan?.topic || "Focus Area"}
                </h2>
                <p className="text-xs text-[#7C786E] leading-relaxed max-w-xl">
                  {activeDayPlan?.description || "Master the scheduled data structures and patterns for today."}
                </p>
              </div>

              <div className="px-3.5 py-1.5 rounded-xl bg-[#FFF5F7] border border-[#FCE7F3] font-bold text-xs text-[#7C786E]">
                Target: {planData.problemsPerDay} Solves
              </div>
            </div>

            {/* Content states */}
            {generatingProblems ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
                <Loader2 className="w-8 h-8 text-[#2C2B27] animate-spin" />
                <div>
                  <p className="text-xs font-bold text-[#1E1D1A]">AI Coach Customizing Problems...</p>
                  <p className="text-[10px] text-[#7C786E] mt-1">Reviewing completed history to select unique tasks.</p>
                </div>
              </div>
            ) : currentProblems.length === 0 ? (
              /* State A: Problems not generated yet */
              <div className="p-8 border-2 border-dashed border-[#FCE7F3] rounded-3xl text-center space-y-5 bg-[#FFF5F7]/50">
                <div className="w-12 h-12 rounded-2xl bg-[#FCE7F3] border border-[#E8DFB3] flex items-center justify-center text-[#be185d] mx-auto">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-[#1E1D1A]">Problems are ready to calibrate</h4>
                  <p className="text-xs text-[#7C786E] max-w-sm mx-auto leading-relaxed">
                    Our AI scans databases to locate appropriate target tasks with active LeetCode, GeeksforGeeks, or CodeChef matching links.
                  </p>
                </div>
                <button
                  onClick={handleGenerateTodayProblems}
                  className="py-2.5 px-6 rounded-xl bg-[#2C2B27] hover:bg-[#1E1D1A] text-white font-bold text-xs transition-all shadow-sm cursor-pointer inline-flex items-center gap-2"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Give Today's Problems
                </button>
              </div>
            ) : (
              /* State B: Problems list */
              <div className="space-y-4">
                <div className="space-y-3.5">
                  {currentProblems.map((problem) => (
                    <div
                      key={problem.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        problem.completed
                          ? "bg-[#FFF5F7] border-[#FCE7F3] opacity-75"
                          : "bg-[#FFF5F7] border border-[#FCE7F3] hover:border-[#ec4899] hover:bg-white shadow-sm"
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
                            <div className="w-5 h-5 rounded-md border border-[#FCE7F3] bg-white hover:border-[#be185d] flex items-center justify-center text-transparent hover:text-[#7C786E]/40 transition-colors">
                              <Check className="w-3 h-3 stroke-[2]" />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 space-y-1">
                          <h4 className={`text-sm font-bold tracking-tight ${problem.completed ? "text-[#7C786E] line-through" : "text-[#1E1D1A]"}`}>
                            {problem.title}
                          </h4>
                          <p className="text-[11px] text-[#7C786E] leading-relaxed line-clamp-2">
                            {problem.description}
                          </p>
                          
                          <div className="flex items-center gap-3 pt-1">
                            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">
                              {problem.category}
                            </span>
                            <span className="text-zinc-300">•</span>
                            <a
                              href={problem.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[9px] text-[#be185d] hover:underline font-bold uppercase flex items-center gap-1"
                            >
                              <span>{problem.platform} Link</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Difficulty, Points, Solve CTAs */}
                      <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wide border ${
                          problem.difficulty === "Easy"
                            ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                            : problem.difficulty === "Medium"
                            ? "text-[#be185d] bg-[#FCE7F3] border-[#E8DFB3]"
                            : "text-red-700 bg-red-50 border-red-200"
                        }`}>
                          {problem.difficulty}
                        </span>

                        <button
                          onClick={() => handleOpenSolveModal(problem)}
                          disabled={problem.completed}
                          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-sm ${
                            problem.completed
                              ? "bg-zinc-100 text-zinc-400 border border-transparent cursor-not-allowed"
                              : "bg-[#2C2B27] text-white hover:bg-[#1E1D1A]"
                          }`}
                        >
                          <Play className="w-3.5 h-3.5 fill-current shrink-0" />
                          <span>{problem.completed ? "Solved" : "Solve"}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Day Completed & Advance trigger */}
                {allCompletedToday && (
                  <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in zoom-in-95">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-emerald-800">Day {planData.currentDayIndex} Completed!</h4>
                        <p className="text-[10px] text-emerald-600 leading-relaxed mt-0.5">
                          You solved all scheduled challenges. Advance to unlock tomorrow's focus.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleAdvanceDay}
                      className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all cursor-pointer shadow-sm flex items-center gap-1"
                    >
                      <span>Unlock Next Day</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}
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
