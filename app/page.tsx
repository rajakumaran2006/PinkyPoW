"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Brain, ArrowRight, Target, LayoutDashboard } from "lucide-react";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col justify-center items-center px-4 py-16 relative bg-[#0B0A09] text-zinc-100 min-h-screen">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-pink-500/10 to-purple-600/5 blur-[120px] pointer-events-none" />

      {/* Main landing container */}
      <div className="max-w-2xl w-full text-center space-y-12 animate-in zoom-in-95 duration-500 z-10">
        
        {/* Logo and Tag */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-pink-500 animate-spin duration-1000" />
            <span>Next-Gen Placement Platform</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white leading-none">
            Pinky<span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">Pow</span>
          </h1>

          <p className="text-zinc-400 text-sm md:text-base max-w-md mx-auto leading-relaxed">
            Calibrate your technical skills, master DSA problem patterns, track speech clarity, and fast-track your placement preparation.
          </p>
        </div>

        {/* Gateways - Two large beautiful glass cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          {/* Card 1: Onboarding */}
          <Link 
            href="/onboarding" 
            className="bg-zinc-900/40 border border-zinc-800/60 backdrop-blur-md rounded-3xl p-6 text-left flex flex-col justify-between min-h-[210px] hover:border-pink-500/40 hover:bg-zinc-900/60 transition-all duration-300 group cursor-pointer shadow-xl"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-500">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-pink-400 transition-colors duration-300">
                Calibrate Profile
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Start the multi-step AI onboarding sequence to sync your hacker profiles and calculate your initial score.
              </p>
            </div>
            
            <div className="flex items-center gap-1.5 text-xs text-pink-500 font-bold mt-4 pt-4 border-t border-white/5">
              <span>Launch Onboarding</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 2: Dashboard */}
          <Link 
            href="/dashboard" 
            className="bg-zinc-900/40 border border-zinc-800/60 backdrop-blur-md rounded-3xl p-6 text-left flex flex-col justify-between min-h-[210px] hover:border-purple-500/40 hover:bg-zinc-900/60 transition-all duration-300 group cursor-pointer shadow-xl"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-purple-400 transition-colors duration-300">
                Placement Dashboard
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Directly enter the master bento board to review recommended challenges, applications, and certifications.
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-purple-400 font-bold mt-4 pt-4 border-t border-white/5">
              <span>Enter Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        {/* Footer */}
        <div className="text-[10px] text-zinc-600 font-medium tracking-widest uppercase pt-4">
          PinkyPow AI © 2026 • Secure & Sandbox Calibrated
        </div>
      </div>
    </main>
  );
}
