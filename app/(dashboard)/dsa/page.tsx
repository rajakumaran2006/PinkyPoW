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
  ChevronRight
} from "lucide-react";

interface Problem {
  id: string;
  title: string;
  platform: "LeetCode" | "HackerRank";
  difficulty: "Easy" | "Medium" | "Hard";
  scoreValue: number;
  category: string;
  codeTemplate: string;
}

const PROBLEM_BANK = {
  "30": {
    Easy: [
      { id: "30-e1", title: "Two Sum", platform: "LeetCode", difficulty: "Easy", scoreValue: 15, category: "Arrays", codeTemplate: "function twoSum(nums, target) {\n  // Write your code here\n}" },
      { id: "30-e2", title: "Valid Palindrome", platform: "LeetCode", difficulty: "Easy", scoreValue: 15, category: "Strings", codeTemplate: "function isPalindrome(s) {\n  // Write your code here\n}" },
      { id: "30-e3", title: "Merge Sorted Array", platform: "LeetCode", difficulty: "Easy", scoreValue: 20, category: "Arrays", codeTemplate: "function merge(nums1, m, nums2, n) {\n  // Write your code here\n}" },
      { id: "30-e4", title: "Fizz Buzz Custom", platform: "HackerRank", difficulty: "Easy", scoreValue: 10, category: "Basic", codeTemplate: "function fizzBuzz(n) {\n  // Write your code here\n}" }
    ] as Problem[],
    Medium: [
      { id: "30-m1", title: "3Sum Closest", platform: "LeetCode", difficulty: "Medium", scoreValue: 30, category: "Arrays", codeTemplate: "function threeSumClosest(nums, target) {\n  // Write your code here\n}" },
      { id: "30-m2", title: "Group Anagrams", platform: "LeetCode", difficulty: "Medium", scoreValue: 30, category: "Strings", codeTemplate: "function groupAnagrams(strs) {\n  // Write your code here\n}" },
      { id: "30-m3", title: "Longest Substring Without Repeating Characters", platform: "LeetCode", difficulty: "Medium", scoreValue: 35, category: "Sliding Window", codeTemplate: "function lengthOfLongestSubstring(s) {\n  // Write your code here\n}" },
      { id: "30-m4", title: "Subarray Sum Equals K", platform: "HackerRank", difficulty: "Medium", scoreValue: 25, category: "Arrays", codeTemplate: "function subarraySum(nums, k) {\n  // Write your code here\n}" }
    ] as Problem[],
    Hard: [
      { id: "30-h1", title: "Sliding Window Maximum", platform: "LeetCode", difficulty: "Hard", scoreValue: 50, category: "Sliding Window", codeTemplate: "function maxSlidingWindow(nums, k) {\n  // Write your code here\n}" },
      { id: "30-h2", title: "Minimum Window Substring", platform: "LeetCode", difficulty: "Hard", scoreValue: 55, category: "Strings", codeTemplate: "function minWindow(s, t) {\n  // Write your code here\n}" }
    ] as Problem[]
  },
  "45": {
    Easy: [
      { id: "45-e1", title: "Reverse Linked List", platform: "LeetCode", difficulty: "Easy", scoreValue: 15, category: "Linked List", codeTemplate: "function reverseList(head) {\n  // Write your code here\n}" },
      { id: "45-e2", title: "Merge Two Sorted Lists", platform: "LeetCode", difficulty: "Easy", scoreValue: 20, category: "Linked List", codeTemplate: "function mergeTwoLists(list1, list2) {\n  // Write your code here\n}" },
      { id: "45-e3", title: "Maximum Depth of Binary Tree", platform: "LeetCode", difficulty: "Easy", scoreValue: 15, category: "Trees", codeTemplate: "function maxDepth(root) {\n  // Write your code here\n}" },
      { id: "45-e4", title: "Balanced Binary Tree", platform: "HackerRank", difficulty: "Easy", scoreValue: 20, category: "Trees", codeTemplate: "function isBalanced(root) {\n  // Write your code here\n}" }
    ] as Problem[],
    Medium: [
      { id: "45-m1", title: "Remove Nth Node From End of List", platform: "LeetCode", difficulty: "Medium", scoreValue: 30, category: "Linked List", codeTemplate: "function removeNthFromEnd(head, n) {\n  // Write your code here\n}" },
      { id: "45-m2", title: "Binary Tree Level Order Traversal", platform: "LeetCode", difficulty: "Medium", scoreValue: 30, category: "Trees", codeTemplate: "function levelOrder(root) {\n  // Write your code here\n}" },
      { id: "45-m3", title: "Kth Smallest Element in a BST", platform: "LeetCode", difficulty: "Medium", scoreValue: 35, category: "Trees", codeTemplate: "function kthSmallest(root, k) {\n  // Write your code here\n}" },
      { id: "45-m4", title: "Find Minimum in Rotated Sorted Array", platform: "HackerRank", difficulty: "Medium", scoreValue: 30, category: "Binary Search", codeTemplate: "function findMin(nums) {\n  // Write your code here\n}" }
    ] as Problem[],
    Hard: [
      { id: "45-h1", title: "Reverse Nodes in k-Group", platform: "LeetCode", difficulty: "Hard", scoreValue: 60, category: "Linked List", codeTemplate: "function reverseKGroup(head, k) {\n  // Write your code here\n}" },
      { id: "45-h2", title: "Serialize and Deserialize Binary Tree", platform: "LeetCode", difficulty: "Hard", scoreValue: 55, category: "Trees", codeTemplate: "function serialize(root) {\n  // Write your code here\n}; function deserialize(data) {\n  // Write your code here\n}" }
    ] as Problem[]
  },
  "90": {
    Easy: [
      { id: "90-e1", title: "Flood Fill", platform: "LeetCode", difficulty: "Easy", scoreValue: 15, category: "Graphs", codeTemplate: "function floodFill(image, sr, sc, color) {\n  // Write your code here\n}" },
      { id: "90-e2", title: "Climbing Stairs", platform: "LeetCode", difficulty: "Easy", scoreValue: 15, category: "Dynamic Programming", codeTemplate: "function climbStairs(n) {\n  // Write your code here\n}" }
    ] as Problem[],
    Medium: [
      { id: "90-m1", title: "Course Schedule II", platform: "LeetCode", difficulty: "Medium", scoreValue: 35, category: "Graphs", codeTemplate: "function findOrder(numCourses, prerequisites) {\n  // Write your code here\n}" },
      { id: "90-m2", title: "Longest Palindromic Substring", platform: "LeetCode", difficulty: "Medium", scoreValue: 30, category: "Dynamic Programming", codeTemplate: "function longestPalindrome(s) {\n  // Write your code here\n}" },
      { id: "90-m3", title: "House Robber", platform: "LeetCode", difficulty: "Medium", scoreValue: 25, category: "Dynamic Programming", codeTemplate: "function rob(nums) {\n  // Write your code here\n}" },
      { id: "90-m4", title: "Trie Implementation", platform: "HackerRank", difficulty: "Medium", scoreValue: 30, category: "Advanced Structures", codeTemplate: "class Trie {\n  constructor() {}\n  insert(word) {}\n  search(word) {}\n}" }
    ] as Problem[],
    Hard: [
      { id: "90-h1", title: "Edit Distance", platform: "LeetCode", difficulty: "Hard", scoreValue: 55, category: "Dynamic Programming", codeTemplate: "function minDistance(word1, word2) {\n  // Write your code here\n}" },
      { id: "90-h2", title: "Median of Two Sorted Arrays", platform: "LeetCode", difficulty: "Hard", scoreValue: 55, category: "Divide & Conquer", codeTemplate: "function findMedianSortedArrays(nums1, nums2) {\n  // Write your code here\n}" },
      { id: "90-h3", title: "Alien Dictionary", platform: "LeetCode", difficulty: "Hard", scoreValue: 65, category: "Graphs", codeTemplate: "function alienOrder(words) {\n  // Write your code here\n}" }
    ] as Problem[]
  }
};

const TOMORROW_MOCK_PROBLEMS: Problem[] = [
  {
    id: "t-1",
    title: "Graph Valid Tree",
    platform: "LeetCode",
    difficulty: "Medium",
    scoreValue: 30,
    category: "Graphs",
    codeTemplate: ""
  },
  {
    id: "t-2",
    title: "Decode Ways",
    platform: "LeetCode",
    difficulty: "Medium",
    scoreValue: 30,
    category: "Dynamic Programming",
    codeTemplate: ""
  }
];

export default function DynamicCodingEngine() {
  const [track, setTrack] = useState<"30" | "45" | "90">("45");
  const [hours, setHours] = useState(3);
  const [todayProblems, setTodayProblems] = useState<Problem[]>([]);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  
  // Interactive Code Workspace Simulation Modal
  const [activeSolveProblem, setActiveSolveProblem] = useState<Problem | null>(null);
  const [editorCode, setEditorCode] = useState("");
  const [testOutput, setTestOutput] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [streakPoints, setStreakPoints] = useState(820);

  // Generate today's battleplan dynamically based on track and hours
  useEffect(() => {
    const bank = PROBLEM_BANK[track];
    let generated: Problem[] = [];

    if (hours === 1) {
      generated = [bank.Easy[0]];
    } else if (hours === 2) {
      generated = [bank.Easy[0], bank.Medium[0]];
    } else if (hours === 3) {
      generated = [bank.Medium[0], bank.Medium[1]];
    } else if (hours === 4) {
      generated = [bank.Easy[0], bank.Medium[0], bank.Medium[1]];
    } else if (hours === 5) {
      generated = [bank.Easy[0], bank.Medium[0], bank.Hard[0]];
    } else if (hours === 6) {
      generated = [bank.Medium[0], bank.Medium[1], bank.Hard[0]];
    } else if (hours === 7) {
      generated = [bank.Easy[0], bank.Medium[0], bank.Medium[1], bank.Hard[0]];
    } else {
      // 8 or more hours
      generated = [bank.Medium[0], bank.Medium[1], bank.Hard[0], bank.Hard[1]];
    }

    setTodayProblems(generated);
    // Reset completed list when generating a new battleplan
    setCompletedIds(new Set());
  }, [track, hours]);

  // Toggle problem completion
  const handleToggleComplete = (problemId: string) => {
    const next = new Set(completedIds);
    if (next.has(problemId)) {
      next.delete(problemId);
      // Remove points
      const prob = todayProblems.find((p) => p.id === problemId);
      if (prob) setStreakPoints((prev) => prev - prob.scoreValue);
    } else {
      next.add(problemId);
      // Add points
      const prob = todayProblems.find((p) => p.id === problemId);
      if (prob) setStreakPoints((prev) => prev + prob.scoreValue);
    }
    setCompletedIds(next);
  };

  const handleOpenSolveModal = (problem: Problem) => {
    setActiveSolveProblem(problem);
    setEditorCode(problem.codeTemplate);
    setTestOutput([]);
    setIsSubmitting(false);
  };

  const handleCloseSolveModal = () => {
    setActiveSolveProblem(null);
  };

  const handleRunTests = () => {
    setTestOutput(["Running tests...", "✓ Test Case 1: Passed", "✓ Test Case 2: Passed", "✓ Test Case 3: Passed"]);
  };

  const handleSubmitSolution = () => {
    setIsSubmitting(true);
    setTestOutput((prev) => [...prev, "Compiling production bundle...", "Verifying edge cases..."]);

    setTimeout(() => {
      setTestOutput((prev) => [
        ...prev,
        "✓ All 12 test cases passed successfully!",
        "✓ Time Complexity: O(N) calibrated",
        "✓ Space Complexity: O(1)",
        "STATUS: ACCEPTED"
      ]);
      setIsSubmitting(false);
      
      // Auto check off the problem
      if (activeSolveProblem) {
        if (!completedIds.has(activeSolveProblem.id)) {
          const next = new Set(completedIds);
          next.add(activeSolveProblem.id);
          setCompletedIds(next);
          setStreakPoints((prev) => prev + activeSolveProblem.scoreValue);
        }
      }
      
      // Keep modal open for a split second, then close
      setTimeout(() => {
        handleCloseSolveModal();
      }, 1000);
    }, 1500);
  };

  const isTodayComplete = todayProblems.length > 0 && completedIds.size === todayProblems.length;

  return (
    <div className="space-y-10 animate-in fade-in duration-500 relative">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Dynamic Coding Engine
          </h1>
          <p className="text-zinc-400 text-sm mt-1 max-w-xl">
            Calibrate your daily coding threshold and target track. PinkyPow builds a dynamic problem list focused on the highest frequency patterns.
          </p>
        </div>

        {/* Streak & Score Widget */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 font-bold text-xs">
            <Flame className="w-4 h-4 text-orange-500 animate-bounce" />
            <span>7-Day Streak</span>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 font-bold text-xs text-white">
            Points: <span className="text-pink-500">{streakPoints}</span>
          </div>
        </div>
      </div>

      {/* Configuration Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Track Selector & Hours Control - Glassmorphic */}
        <div className="lg:col-span-1 glass-panel rounded-3xl p-6 border border-white/5 space-y-6 flex flex-col justify-between">
          <div className="space-y-5">
            <div>
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">
                Velocity Track
              </h3>
              
              {/* Custom Track Toggles */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "30", label: "30 Days", desc: "Basic" },
                  { id: "45", label: "45 Days", desc: "Interm." },
                  { id: "90", label: "90 Days", desc: "Pro" }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setTrack(item.id as any)}
                    className={`py-2 px-1.5 rounded-xl border flex flex-col items-center justify-center transition-all duration-300 cursor-pointer ${
                      track === item.id
                        ? "bg-white text-black border-white shadow-md font-bold scale-[1.03]"
                        : "bg-white/5 border-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <span className="text-xs font-bold">{item.label}</span>
                    <span className={`text-[9px] mt-0.5 font-medium ${track === item.id ? "text-zinc-600" : "text-zinc-500"}`}>
                      {item.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Slider control */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-zinc-400 uppercase tracking-widest">
                  Daily Intensity
                </span>
                <span className="text-pink-500 font-extrabold bg-pink-500/10 px-2 py-0.5 rounded border border-pink-500/10">
                  {hours} {hours === 1 ? "Hour" : "Hours"}
                </span>
              </div>

              <input
                type="range"
                min="1"
                max="8"
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-pink-500"
              />

              <div className="flex justify-between text-[9px] text-zinc-500 font-bold">
                <span>1 HR (MAINTAIN)</span>
                <span>4 HRS (FOCUS)</span>
                <span>8 HRS (PRO)</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="pt-4 border-t border-white/5 space-y-2 text-[10px] text-zinc-400 font-medium">
            <div className="flex justify-between">
              <span>Track Focus:</span>
              <span className="text-white font-semibold">
                {track === "30" ? "Arrays & Strings" : track === "45" ? "Linked Lists & BST" : "DP & Advanced Graphs"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Target Challenges:</span>
              <span className="text-white font-semibold">
                {todayProblems.length} Problems
              </span>
            </div>
          </div>
        </div>

        {/* Today's Battleplan Column */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 border border-white/5 space-y-5">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-pink-500" />
              <h2 className="text-base font-bold text-white tracking-tight">Today's Battleplan</h2>
            </div>
            
            {/* Progress status */}
            <div className="text-xs font-bold text-zinc-400">
              <span className="text-pink-500">{completedIds.size}</span> / {todayProblems.length} Solved
            </div>
          </div>

          {/* Problems list */}
          <div className="space-y-3.5">
            {todayProblems.map((problem) => {
              const isDone = completedIds.has(problem.id);
              
              return (
                <div
                  key={problem.id}
                  className={`p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-4 group ${
                    isDone
                      ? "bg-white/[0.02] border-emerald-500/10 opacity-70"
                      : "bg-white/5 border-white/5 hover:border-pink-500/20 hover:bg-white/[0.08]"
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Checkbox wrapper */}
                    <button
                      onClick={() => handleToggleComplete(problem.id)}
                      className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                        isDone
                          ? "bg-emerald-500 border-emerald-500 text-black"
                          : "border-zinc-600 hover:border-pink-500 bg-black/45"
                      }`}
                    >
                      {isDone && <Check className="w-3.5 h-3.5 stroke-[3px]" />}
                    </button>

                    <div className="min-w-0">
                      <h4 className={`text-xs md:text-sm font-bold tracking-tight transition-colors ${
                        isDone ? "text-zinc-500 line-through" : "text-white group-hover:text-pink-400"
                      }`}>
                        {problem.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1 text-[9px] text-zinc-500 font-bold uppercase tracking-wider">
                        <span>{problem.category}</span>
                        <span>•</span>
                        <span className="text-zinc-400">{problem.platform}</span>
                      </div>
                    </div>
                  </div>

                  {/* Difficulty, Points & CTA */}
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wide border ${
                      problem.difficulty === "Easy"
                        ? "text-emerald-400 bg-emerald-400/5 border-emerald-400/10"
                        : problem.difficulty === "Medium"
                        ? "text-yellow-500 bg-yellow-500/5 border-yellow-500/10"
                        : "text-rose-500 bg-rose-500/5 border-rose-500/10"
                    }`}>
                      {problem.difficulty}
                    </span>

                    <span className="text-[10px] text-zinc-400 font-bold">
                      +{problem.scoreValue} XP
                    </span>

                    <button
                      onClick={() => handleOpenSolveModal(problem)}
                      disabled={isDone}
                      className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        isDone
                          ? "bg-zinc-800/30 text-zinc-600 border border-transparent cursor-not-allowed"
                          : "bg-white text-black hover:bg-zinc-200 hover:scale-[1.02] shadow-sm"
                      }`}
                    >
                      <Play className="w-3 h-3 fill-black shrink-0" />
                      <span className="hidden sm:inline">Solve</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tomorrow's Locked problems */}
      <div className="space-y-4 relative">
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
          <Lock className="w-3.5 h-3.5" />
          Tomorrow's Challenges Track
        </h3>

        {/* Lock Overlay wrapper */}
        <div className="relative rounded-3xl overflow-hidden group">
          {/* Main lock banner */}
          <div className={`absolute inset-0 bg-black/60 backdrop-blur-[6px] z-20 flex flex-col items-center justify-center p-6 border border-white/5 rounded-3xl transition-all duration-700 ${
            isTodayComplete ? "opacity-0 pointer-events-none scale-95" : "opacity-100"
          }`}>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 shadow-xl mb-4 group-hover:scale-110 transition-transform duration-500">
              <Lock className="w-8 h-8 text-pink-500" />
            </div>
            
            <h4 className="text-white font-bold text-sm tracking-tight text-center">
              Today's track is in progress
            </h4>
            
            <p className="text-zinc-400 text-[10px] md:text-xs mt-1 text-center max-w-xs leading-relaxed">
              Completing today's problems unlocks tomorrow's track to prevent burnout and enforce daily habits.
            </p>

            <div className="mt-4 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[9px] text-zinc-500 font-bold uppercase tracking-wider">
              Solve {todayProblems.length - completedIds.size} more to unlock preview
            </div>
          </div>

          {/* Celebration Banner when completed */}
          {isTodayComplete && (
            <div className="absolute inset-0 bg-emerald-500/[0.02] border border-emerald-500/25 rounded-3xl z-20 pointer-events-none flex flex-col items-center justify-center p-6 animate-pulse">
              <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-bold text-emerald-400 tracking-wide uppercase">
                <Unlock className="w-3 h-3" />
                Tomorrow's Track Unlocked
              </div>
            </div>
          )}

          {/* Locked Grid Cards */}
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 transition-all duration-700 ${
            isTodayComplete ? "opacity-100 filter-none" : "opacity-35 blur-[2px] pointer-events-none"
          }`}>
            {TOMORROW_MOCK_PROBLEMS.map((problem) => (
              <div
                key={problem.id}
                className="p-5 rounded-3xl bg-white/5 border border-white/5 flex flex-col justify-between min-h-[120px] relative overflow-hidden"
              >
                {/* Glow bar */}
                {isTodayComplete && (
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500/40 to-teal-500/40" />
                )}

                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                      {problem.category}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase border ${
                      problem.difficulty === "Easy" ? "text-emerald-400 bg-emerald-400/5 border-emerald-400/10" : "text-yellow-500 bg-yellow-500/5 border-yellow-500/10"
                    }`}>
                      {problem.difficulty}
                    </span>
                  </div>

                  <h4 className="text-white font-bold text-sm tracking-tight">
                    {problem.title}
                  </h4>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-white/5 text-[10px] text-zinc-500 font-medium">
                  <span>Platform: {problem.platform}</span>
                  <span className="text-pink-500/80 font-bold">+{problem.scoreValue} XP</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Simulated Code Workspace Modal */}
      {activeSolveProblem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300">
          <div className="glass-panel w-full max-w-4xl h-[85vh] rounded-3xl overflow-hidden flex flex-col border border-white/10 shadow-2xl relative">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-black/45">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-500">
                  <Code className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm md:text-base leading-none">
                    {activeSolveProblem.title}
                  </h3>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-1 block">
                    {activeSolveProblem.category} • {activeSolveProblem.platform}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCloseSolveModal}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body (2 Panels on larger displays) */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              {/* Left Panel: Problem Description */}
              <div className="w-full md:w-5/12 border-r border-white/5 p-6 overflow-y-auto space-y-6">
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                    Problem Statement
                  </h4>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Write an efficient function that solves <strong className="text-white">{activeSolveProblem.title}</strong>, meeting the platform constraints. Complete the function signature in the editor panel.
                  </p>
                </div>

                <div className="space-y-3.5">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                    Constraints & Performance
                  </h4>
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-2 text-[11px] font-mono text-zinc-400">
                    <div>• Time limit: 1.0s</div>
                    <div>• Memory limit: 256MB</div>
                    <div>• Target complexity: O(N) or better</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] text-zinc-500 font-bold uppercase">
                    <span>Reward Value</span>
                    <span className="text-emerald-400">Streak Points</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between text-xs font-bold">
                    <span className="text-white">PinkyPow XP</span>
                    <span className="text-pink-500">+{activeSolveProblem.scoreValue} Points</span>
                  </div>
                </div>
              </div>

              {/* Right Panel: Code Editor Simulation */}
              <div className="flex-1 flex flex-col bg-black/40 overflow-hidden">
                {/* Editor Top Options Bar */}
                <div className="px-4 py-2 bg-black/60 border-b border-white/5 flex items-center justify-between text-[10px] font-bold text-zinc-500 font-mono">
                  <span>main.js</span>
                  <span>ES6 Javascript</span>
                </div>

                {/* Editor Content Area */}
                <div className="flex-1 p-4 font-mono text-xs text-white relative">
                  <textarea
                    value={editorCode}
                    onChange={(e) => setEditorCode(e.target.value)}
                    className="w-full h-full bg-transparent resize-none focus:outline-none font-mono text-pink-300 border-none leading-relaxed"
                    spellCheck="false"
                  />
                </div>

                {/* Terminal Outputs Panel */}
                {testOutput.length > 0 && (
                  <div className="h-40 border-t border-white/5 bg-[#09090b] p-4 font-mono text-[10px] text-zinc-400 overflow-y-auto space-y-1 shadow-inner">
                    <div className="flex items-center gap-1.5 border-b border-white/5 pb-1 mb-1 text-zinc-500 font-bold uppercase">
                      <Terminal className="w-3.5 h-3.5 text-pink-500" />
                      <span>Console Logs</span>
                    </div>
                    {testOutput.map((out, index) => (
                      <div
                        key={index}
                        className={
                          out.includes("STATUS: ACCEPTED") || out.includes("passed")
                            ? "text-emerald-400 font-bold"
                            : out.includes("Running") || out.includes("Compiling")
                            ? "text-pink-500/70"
                            : "text-zinc-300"
                        }
                      >
                        {out}
                      </div>
                    ))}
                  </div>
                )}

                {/* Editor Footer / CTA Button Row */}
                <div className="px-6 py-4 border-t border-white/5 bg-black/45 flex items-center justify-end gap-3">
                  <button
                    onClick={handleRunTests}
                    className="py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    Run Tests
                  </button>

                  <button
                    onClick={handleSubmitSolution}
                    disabled={isSubmitting}
                    className="py-2.5 px-5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer hover:scale-[1.02]"
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
