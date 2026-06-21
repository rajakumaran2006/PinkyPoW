"use client";

import React from "react";
import { Mail, Target, RefreshCcw, ShieldCheck } from "lucide-react";

export default function Profile() {
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("currentUser");
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const profileInfo = {
    name: user?.name || "Raja Kumaran",
    email: user?.email || "raja@pinkypow.dev",
    role: user 
      ? `${user.course || "Placement Candidate"} (${user.yearOfStudy || "Class of 2027"})` 
      : "Placement Candidate (Class of 2027)",
    college: user?.college || "College of Engineering",
    collegeLocation: user?.collegeLocation 
      ? [user.collegeLocation, user.collegeState, user.collegeCountry].filter(Boolean).join(", ")
      : "Chennai, India",
    score: user?.placementScore || 820,
    solvedCount: 142,
    speechRecordings: 24,
    linkedAccounts: [
      { platform: "LeetCode", username: user?.platformUsernames?.leetcode || "rajakumaran_dev", status: "Synced", syncTime: "1 hour ago" },
      { platform: "CodeChef", username: user?.platformUsernames?.codechef || "rajakumaran2006", status: "Synced", syncTime: "12 hours ago" },
      { platform: "HackerRank", username: user?.platformUsernames?.hackerrank || "raja_poW", status: "Synced", syncTime: "1 day ago" }
    ]
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-12">

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="warm-card rounded-3xl p-6 md:p-8 space-y-6 lg:col-span-1 bg-white border border-[#FDF2F8] shadow-sm">
          <div className="flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#be185d] to-[#2C2B27] flex items-center justify-center font-black text-white text-3xl shadow-lg shadow-[#be185d]/10 mb-4">
              {profileInfo.name.split(" ").map((n: string) => n[0]).join("").toUpperCase()}
            </div>
            
            <h2 className="text-xl font-extrabold text-[#1E1D1A] tracking-tight">{profileInfo.name}</h2>
            <p className="text-xs text-[#be185d] font-semibold mt-1">{profileInfo.role}</p>
            <p className="text-[11px] text-[#7C786E] font-medium mt-1">{profileInfo.college} | {profileInfo.collegeLocation}</p>
            
            <div className="flex items-center gap-1.5 mt-3 text-xs text-[#7C786E]">
              <Mail className="w-3.5 h-3.5 text-[#7C786E]" />
              <span>{profileInfo.email}</span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="space-y-3 pt-6 border-t border-[#FDF2F8]">
            <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-[#FFF5F7] border border-[#FCE7F3]">
              <span className="text-[#7C786E] font-bold uppercase tracking-wider">Placement Score</span>
              <span className="font-extrabold text-[#1E1D1A]">{profileInfo.score} / 1000</span>
            </div>

            <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-[#FFF5F7] border border-[#FCE7F3]">
              <span className="text-[#7C786E] font-bold uppercase tracking-wider">DSA Solved</span>
              <span className="font-extrabold text-[#1E1D1A]">{profileInfo.solvedCount} problems</span>
            </div>

            <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-[#FFF5F7] border border-[#FCE7F3]">
              <span className="text-[#7C786E] font-bold uppercase tracking-wider">Speech Tasks</span>
              <span className="font-extrabold text-[#1E1D1A]">{profileInfo.speechRecordings} complete</span>
            </div>
          </div>
        </div>

        {/* Linked Accounts */}
        <div className="warm-card rounded-3xl p-6 md:p-8 space-y-6 lg:col-span-2 bg-white border border-[#FDF2F8] shadow-sm">
          <div className="flex justify-between items-center pb-4 border-b border-[#FDF2F8]">
            <div className="flex items-center gap-2">
  
              <h3 className="font-bold text-[#1E1D1A] tracking-tight">Linked Coder Profiles</h3>
            </div>
            
            <button className="flex items-center gap-1.5 text-xs text-[#be185d] font-bold bg-white border border-[#E8DFB3] px-2.5 py-1 rounded-xl cursor-pointer hover:bg-[#FAF2CD] transition-all shadow-sm">
              <RefreshCcw className="w-3.5 h-3.5" />
              <span>Resync All</span>
            </button>
          </div>

          <div className="space-y-4">
            {profileInfo.linkedAccounts.map((account, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white border border-[#FCE7F3] flex items-center justify-between gap-4 hover:border-[#ec4899] transition-all duration-300 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#FCE7F3] flex items-center justify-center font-bold text-[#1E1D1A] text-xs">
                    {account.platform[0]}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1E1D1A]">{account.platform}</h4>
                    <p className="text-xs text-[#7C786E] mt-0.5">Username: {account.username || "Not Linked"}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500 border border-emerald-250 text-white font-bold text-[10px] uppercase flex items-center gap-1.5 shadow-sm">
                    <ShieldCheck className="w-3 h-3 text-emerald-650" />
                    {account.status}
                  </span>
                  <p className="text-[10px] text-[#7C786E] mt-1.5">Last synced {account.syncTime}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
