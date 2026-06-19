"use client";

import React from "react";
import { User, ShieldCheck, Mail, Target, Award, Code, CheckCircle, RefreshCcw } from "lucide-react";

export default function Profile() {
  const profileInfo = {
    name: "Raja Kumaran",
    email: "raja@pinkypow.dev",
    role: "Placement Candidate (Class of 2027)",
    score: 820,
    solvedCount: 142,
    speechRecordings: 24,
    linkedAccounts: [
      { platform: "LeetCode", username: "rajakumaran_dev", status: "Synced", syncTime: "1 hour ago" },
      { platform: "CodeChef", username: "rajakumaran2006", status: "Synced", syncTime: "12 hours ago" },
      { platform: "HackerRank", username: "raja_poW", status: "Synced", syncTime: "1 day ago" }
    ]
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          Candidate Profile
        </h1>
        <p className="text-zinc-400 text-sm mt-1">
          Review your credentials, linked platform profiles, and cumulative placement readiness calibration.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="glass-panel rounded-3xl p-6 md:p-8 space-y-6 lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center font-black text-white text-3xl shadow-lg shadow-pink-500/20 mb-4">
              RK
            </div>
            
            <h2 className="text-xl font-extrabold text-white tracking-tight">{profileInfo.name}</h2>
            <p className="text-xs text-pink-500 font-semibold mt-1">{profileInfo.role}</p>
            
            <div className="flex items-center gap-1.5 mt-3 text-xs text-zinc-400">
              <Mail className="w-3.5 h-3.5" />
              <span>{profileInfo.email}</span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="space-y-3 pt-6 border-t border-white/5">
            <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-white/5 border border-white/5">
              <span className="text-zinc-500 font-bold uppercase tracking-wider">Placement Score</span>
              <span className="font-extrabold text-white">{profileInfo.score} / 1000</span>
            </div>

            <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-white/5 border border-white/5">
              <span className="text-zinc-500 font-bold uppercase tracking-wider">DSA Solved</span>
              <span className="font-extrabold text-white">{profileInfo.solvedCount} problems</span>
            </div>

            <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-white/5 border border-white/5">
              <span className="text-zinc-500 font-bold uppercase tracking-wider">Speech Tasks</span>
              <span className="font-extrabold text-white">{profileInfo.speechRecordings} complete</span>
            </div>
          </div>
        </div>

        {/* Linked Accounts */}
        <div className="glass-panel rounded-3xl p-6 md:p-8 space-y-6 lg:col-span-2">
          <div className="flex justify-between items-center pb-4 border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-500">
                <Target className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-white tracking-tight">Linked Coder Profiles</h3>
            </div>
            
            <button className="flex items-center gap-1.5 text-xs text-pink-500 font-bold bg-pink-500/10 border border-pink-500/20 px-2.5 py-1 rounded-xl cursor-pointer">
              <RefreshCcw className="w-3.5 h-3.5" />
              <span>Resync All</span>
            </button>
          </div>

          <div className="space-y-4">
            {profileInfo.linkedAccounts.map((account, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-white text-xs">
                    {account.platform[0]}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{account.platform}</h4>
                    <p className="text-xs text-zinc-500 mt-0.5">Username: {account.username}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-[10px] uppercase">
                    {account.status}
                  </span>
                  <p className="text-[10px] text-zinc-500 mt-1">Last synced {account.syncTime}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
