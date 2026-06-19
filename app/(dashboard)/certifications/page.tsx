"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Award,
  Plus,
  Search,
  Filter,
  CheckCircle,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  X,
  Loader2,
  RefreshCw,
  TrendingUp,
  BookOpen,
  Calendar,
  Globe
} from "lucide-react";

interface Certification {
  id: string;
  title: string;
  provider: string;
  date: string;
  link: string;
  status: "Verified" | "Validating" | "Active";
  category: "Cloud" | "AI" | "Frontend" | "Backend" | "General";
}

interface RecommendedCert {
  id: string;
  title: string;
  provider: string;
  platform: string;
  category: "Cloud" | "AI" | "Frontend" | "Backend";
  duration: string;
  valueScore: number; // 1-100
  skills: string[];
  link: string;
}

export default function Certifications() {
  // --- STATE ---
  const [myCerts, setMyCerts] = useState<Certification[]>([
    {
      id: "cert-1",
      title: "AWS Certified Solutions Architect",
      provider: "Amazon Web Services",
      date: "December 2025",
      link: "https://aws.amazon.com/verification",
      status: "Verified",
      category: "Cloud"
    },
    {
      id: "cert-2",
      title: "Responsive Web Design Certification",
      provider: "freeCodeCamp",
      date: "January 2026",
      link: "https://freecodecamp.org/certification",
      status: "Verified",
      category: "Frontend"
    },
    {
      id: "cert-3",
      title: "Introduction to Machine Learning",
      provider: "Stanford Online",
      date: "May 2026",
      link: "https://coursera.org/verification",
      status: "Verified",
      category: "AI"
    }
  ]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCertTitle, setNewCertTitle] = useState("");
  const [newCertProvider, setNewCertProvider] = useState("");
  const [newCertDate, setNewCertDate] = useState("");
  const [newCertLink, setNewCertLink] = useState("");
  const [newCertCategory, setNewCertCategory] = useState<Certification["category"]>("Cloud");

  // Discovery Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"All" | "Cloud" | "AI" | "Frontend" | "Backend">("All");

  // Web Scan State
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(true);

  // Recommended Certs (Initially empty or partially populated, fully populated after scan)
  const initialRecommendations: RecommendedCert[] = [
    {
      id: "rec-1",
      title: "CS50's Introduction to Computer Science",
      provider: "Harvard University",
      platform: "edX (Free Audit)",
      category: "Backend",
      duration: "12 Weeks (10-20 hrs/week)",
      valueScore: 98,
      skills: ["C", "Python", "SQL", "Algorithms", "Data Structures"],
      link: "https://cs50.harvard.edu/x"
    },
    {
      id: "rec-2",
      title: "Deep Learning Specialization",
      provider: "DeepLearning.AI",
      platform: "Coursera (Audit / Financial Aid)",
      category: "AI",
      duration: "16 Weeks (5-8 hrs/week)",
      valueScore: 96,
      skills: ["TensorFlow", "Neural Networks", "Deep Learning", "Python"],
      link: "https://www.coursera.org/specializations/deep-learning"
    },
    {
      id: "rec-3",
      title: "Meta Front-End Developer Professional Certificate",
      provider: "Meta",
      platform: "Coursera (Free Trial / Audit)",
      category: "Frontend",
      duration: "7 Months (6 hrs/week)",
      valueScore: 94,
      skills: ["React", "JavaScript", "HTML/CSS", "UI/UX", "Git"],
      link: "https://www.coursera.org/professional-certificates/meta-front-end-developer"
    },
    {
      id: "rec-4",
      title: "Google Cloud Digital Leader",
      provider: "Google Cloud",
      platform: "Google Cloud Skills Boost",
      category: "Cloud",
      duration: "4 Weeks (4 hrs/week)",
      valueScore: 90,
      skills: ["GCP Core Infrastructure", "Cloud Computing", "ML on Google Cloud"],
      link: "https://cloud.google.com/learn/certification/cloud-digital-leader"
    },
    {
      id: "rec-5",
      title: "LangChain & LlamaIndex for AI Assistants",
      provider: "ActiveLoop AI",
      platform: "Deep Lake Academy (Free Access)",
      category: "AI",
      duration: "8 Hours",
      valueScore: 95,
      skills: ["RAG", "LangChain", "Vector Databases", "LLMs"],
      link: "https://www.activeloop.ai/resources/lang-chain-course/"
    },
    {
      id: "rec-6",
      title: "AWS Fundamentals: Going Cloud-Native",
      provider: "Amazon Web Services",
      platform: "Coursera (Free Audit)",
      category: "Cloud",
      duration: "4 Weeks (3 hrs/week)",
      valueScore: 89,
      skills: ["EC2", "S3", "RDS", "AWS IAM", "Serverless Architecture"],
      link: "https://www.coursera.org/learn/aws-fundamentals-cloud-native"
    }
  ];

  const [recommendedCerts, setRecommendedCerts] = useState<RecommendedCert[]>(initialRecommendations);

  // --- ACTIONS ---

  // Handle Form Submission inside Add Certificate Modal
  const handleAddCertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCertTitle || !newCertProvider) return;

    const newCert: Certification = {
      id: `cert-${Date.now()}`,
      title: newCertTitle,
      provider: newCertProvider,
      date: newCertDate || "June 2026",
      link: newCertLink || "#",
      status: "Validating",
      category: newCertCategory
    };

    setMyCerts([newCert, ...myCerts]);

    // Reset Form & Close Modal
    setNewCertTitle("");
    setNewCertProvider("");
    setNewCertDate("");
    setNewCertLink("");
    setNewCertCategory("Cloud");
    setIsModalOpen(false);

    // Simulated background validation
    setTimeout(() => {
      setMyCerts((prev) =>
        prev.map((c) => (c.id === newCert.id ? { ...c, status: "Verified" } : c))
      );
    }, 4000);
  };

  // Web Scan simulation
  const startWebScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setScanLogs([]);

    const steps = [
      { text: "Initializing search queries across major providers...", delay: 400 },
      { text: "Parsing Coursera, edX, and freeCodeCamp index API...", delay: 1000 },
      { text: "Crawling YouTube developer directories & Github repository courses...", delay: 1800 },
      { text: "Analyzing technical relevancy weighting against market requirements...", delay: 2600 },
      { text: "Filtering out paid modules & searching for active voucher codes...", delay: 3400 },
      { text: "AI verification check: calculating credential authority & validation score...", delay: 4200 },
      { text: "Discovery complete! Found 6 premium free certifications.", delay: 5000 }
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setScanLogs((prev) => [...prev, step.text]);
        setScanProgress(Math.min(Math.round(((idx + 1) / steps.length) * 100), 100));

        if (idx === steps.length - 1) {
          setTimeout(() => {
            setIsScanning(false);
            // Slightly modify recommendation orders or add an extra mock certificate to show state changes
            const extraCert: RecommendedCert = {
              id: `rec-${Date.now()}`,
              title: "Harvard CS50's Web Programming with Python and JS",
              provider: "Harvard University",
              platform: "edX (Free Audit)",
              category: "Frontend",
              duration: "12 Weeks (6-9 hrs/week)",
              valueScore: 97,
              skills: ["Django", "React", "SQL", "Git", "CI/CD"],
              link: "https://cs50.harvard.edu/web"
            };
            setRecommendedCerts((prev) => {
              if (prev.some((c) => c.title === extraCert.title)) return prev;
              return [extraCert, ...prev];
            });
            setShowRecommendations(true);
          }, 800);
        }
      }, step.delay);
    });
  };

  // Filter & Search Logic
  const filteredRecommendations = useMemo(() => {
    return recommendedCerts.filter((cert) => {
      const matchSearch =
        cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchCategory = activeCategory === "All" || cert.category === activeCategory;

      return matchSearch && matchCategory;
    });
  }, [recommendedCerts, searchQuery, activeCategory]);

  return (
    <div className="space-y-12 animate-in fade-in duration-500 max-w-6xl mx-auto">
      
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-white/5 pb-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/25 text-pink-400 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" /> Credentials & discovery
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Award className="w-10 h-10 text-pink-500 shrink-0" />
            Verified Credentials
          </h1>
          <p className="text-zinc-400 text-sm max-w-xl">
            Track your certs and let AI find high-impact, free industry certifications.
          </p>
        </div>

        {/* Quick Credentials Summary Card */}
        <div className="flex items-center gap-6 p-5 rounded-3xl bg-white/5 border border-white/5 glass-panel">
          <div className="text-center px-4 border-r border-white/10">
            <span className="block text-[10px] text-zinc-500 font-bold uppercase tracking-wider">My Certs</span>
            <span className="text-2xl font-black text-white">{myCerts.length}</span>
          </div>
          <div className="text-center px-4 border-r border-white/10">
            <span className="block text-[10px] text-zinc-500 font-bold uppercase tracking-wider">AI Scanned</span>
            <span className="text-2xl font-black text-pink-500">{recommendedCerts.length}</span>
          </div>
          <div className="text-center px-4">
            <span className="block text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Avg Value</span>
            <span className="text-2xl font-black text-emerald-400">93%</span>
          </div>
        </div>
      </div>

      {/* 2. My Certifications (Top Section) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              My Certifications
            </h2>
            <p className="text-xs text-zinc-500 mt-1">Currently verified developer credentials</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 text-zinc-200 hover:text-white text-xs font-bold transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-pink-500" />
            Add Certificate
          </button>
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myCerts.map((cert) => (
            <div
              key={cert.id}
              className="glass-panel rounded-2xl p-6 flex flex-col justify-between border border-white/5 hover:border-pink-500/25 transition-all duration-300 relative overflow-hidden group"
            >
              {/* Subtle top ambient color gradient based on category */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 opacity-60" />

              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
                      {cert.provider}
                    </span>
                    <h3 className="font-bold text-white text-base leading-snug mt-1 group-hover:text-pink-400 transition-colors">
                      {cert.title}
                    </h3>
                  </div>
                  
                  {cert.status === "Verified" ? (
                    <div className="p-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="p-1 rounded bg-amber-500/10 border border-amber-500/25 text-amber-400 animate-pulse flex items-center gap-1">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                  <span className="text-zinc-500 text-[10px] uppercase font-bold">Category</span>
                  <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-zinc-300 text-[10px] font-semibold">
                    {cert.category}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-zinc-400">
                  <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{cert.date}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                      cert.status === "Verified"
                        ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                        : cert.status === "Validating"
                        ? "bg-amber-500/10 border border-amber-500/20 text-amber-400"
                        : "bg-white/5 text-zinc-400"
                    }`}
                  >
                    {cert.status}
                  </span>
                  
                  {cert.link && cert.link !== "#" && (
                    <a
                      href={cert.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-400 hover:text-white transition-colors"
                      title="Verify Credential URL"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. AI Discovery Engine (Main Section) */}
      <div className="border-t border-white/5 pt-12 space-y-8">
        
        {/* Banner with engine summary */}
        <div className="glass-panel rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-gradient-to-br from-white/[0.02] via-transparent to-pink-500/[0.02]">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              AI Discovery Engine
            </h3>
            <p className="text-xs text-zinc-400 max-w-xl">
              Our autonomous scanner combs premium directories, developer community registries, and free course catalogues to aggregate high-weight industry certifications for your career target.
            </p>
          </div>

          <button
            onClick={startWebScan}
            disabled={isScanning}
            className={`w-full md:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-xs tracking-wide shadow-lg shadow-pink-500/15 hover:shadow-pink-500/25 transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 ${
              isScanning ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {isScanning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Scanning Web...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 animate-spin-slow" />
                <span>Scan Web for Free Certs</span>
              </>
            )}
          </button>
        </div>

        {/* Simulated scanning console */}
        {isScanning && (
          <div className="glass-panel rounded-2xl p-5 border border-pink-500/10 bg-black/40 space-y-4 animate-in slide-in-from-top-4 duration-300">
            <div className="flex justify-between items-center pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping" />
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">AI Crawler Pipeline</span>
              </div>
              <span className="text-xs text-pink-500 font-bold">{scanProgress}%</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-zinc-800/80 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-300"
                style={{ width: `${scanProgress}%` }}
              />
            </div>

            {/* Logs console */}
            <div className="space-y-1.5 font-mono text-[10px] text-zinc-500 max-h-[140px] overflow-y-auto scrollbar-none pt-1">
              {scanLogs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-pink-500/70 shrink-0">&gt;</span>
                  <span className="text-zinc-300">{log}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {showRecommendations && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pb-2">
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Filter certifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/5 focus:outline-none focus:border-pink-500/50 text-xs text-white placeholder-zinc-500 transition-colors"
                />
              </div>

              {/* Filtering Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
                <Filter className="w-3.5 h-3.5 text-zinc-500 mr-1.5 shrink-0 hidden md:block" />
                {(["All", "Cloud", "AI", "Frontend", "Backend"] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-bold tracking-wide transition-all duration-300 whitespace-nowrap cursor-pointer ${
                      activeCategory === cat
                        ? "bg-white text-black font-semibold shadow-sm"
                        : "bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 border border-white/5"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Recommendations Grid */}
            {filteredRecommendations.length === 0 ? (
              <div className="glass-panel rounded-3xl p-12 text-center text-zinc-500 space-y-4">
                <Search className="w-12 h-12 text-zinc-700 mx-auto" />
                <h4 className="font-bold text-zinc-400 text-sm">No matched recommendations</h4>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  Try checking your search filters or running a new web scan.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredRecommendations.map((cert) => (
                  <div
                    key={cert.id}
                    className="glass-panel rounded-2xl p-6 border border-white/5 hover:border-pink-500/20 transition-all duration-300 flex flex-col justify-between space-y-6 group"
                  >
                    <div className="space-y-4">
                      {/* Top Header Row with AI Badge */}
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
                            <span>{cert.provider}</span>
                            <span>•</span>
                            <span className="text-zinc-400">{cert.platform}</span>
                          </div>
                          <h4 className="font-bold text-white text-base leading-snug tracking-tight mt-1.5 group-hover:text-pink-400 transition-colors">
                            {cert.title}
                          </h4>
                        </div>

                        {/* STRIKING AI VALIDATED BADGE */}
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-400 text-[10px] font-extrabold tracking-wide shrink-0 shadow-[0_0_12px_rgba(16,185,129,0.15)] group-hover:shadow-[0_0_16px_rgba(16,185,129,0.3)] transition-all duration-300">
                          <CheckCircle className="w-3.5 h-3.5 fill-emerald-500/10" />
                          <span>AI Validated</span>
                        </div>
                      </div>

                      {/* Technical skills acquired */}
                      <div className="flex flex-wrap gap-1">
                        {cert.skills.map((skill) => (
                          <span
                            key={skill}
                            className="text-[9px] font-medium px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-zinc-400"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Metadata Footer and Enroll Button */}
                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-4 text-[10px]">
                        <div>
                          <span className="block text-zinc-500 uppercase font-semibold">Duration</span>
                          <span className="font-bold text-zinc-300">{cert.duration}</span>
                        </div>
                        <div className="px-3 border-l border-white/5">
                          <span className="block text-zinc-500 uppercase font-semibold">Value Score</span>
                          <span className="font-bold text-emerald-400 flex items-center gap-0.5">
                            <TrendingUp className="w-3 h-3" /> {cert.valueScore}%
                          </span>
                        </div>
                      </div>

                      <a
                        href={cert.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-4 rounded-xl bg-white text-black hover:bg-zinc-200 text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <span>Enroll Free</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* --- ADD CERTIFICATE MOCK MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div
            className="w-full max-w-md glass-panel rounded-3xl p-6 space-y-6 border border-white/10 bg-[#09090b]/90 shadow-2xl relative animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-white/5 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <Award className="w-5 h-5 text-pink-500" />
                Add Certificate
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                Enter your certification details. PinkyPow AI will crawl the link to verify its validity.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleAddCertSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
                  Certification Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Google Cloud Professional Architect"
                  value={newCertTitle}
                  onChange={(e) => setNewCertTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/5 focus:outline-none focus:border-pink-500/50 text-xs text-white placeholder-zinc-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
                  Issuing Provider
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Google Cloud, AWS, freeCodeCamp"
                  value={newCertProvider}
                  onChange={(e) => setNewCertProvider(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/5 focus:outline-none focus:border-pink-500/50 text-xs text-white placeholder-zinc-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
                    Completion Date
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. June 2026"
                    value={newCertDate}
                    onChange={(e) => setNewCertDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/5 focus:outline-none focus:border-pink-500/50 text-xs text-white placeholder-zinc-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
                    Category
                  </label>
                  <select
                    value={newCertCategory}
                    onChange={(e) => setNewCertCategory(e.target.value as Certification["category"])}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#09090b] border border-white/5 focus:outline-none focus:border-pink-500/50 text-xs text-white transition-colors"
                  >
                    <option value="Cloud">Cloud</option>
                    <option value="AI">AI & ML</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="General">General CS</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
                  Credential Verification URL
                </label>
                <input
                  type="url"
                  placeholder="https://aws.amazon.com/verification/..."
                  value={newCertLink}
                  onChange={(e) => setNewCertLink(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/5 focus:outline-none focus:border-pink-500/50 text-xs text-white placeholder-zinc-500 transition-colors"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl hover:bg-white/5 border border-transparent text-zinc-400 hover:text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-bold transition-all cursor-pointer"
                >
                  Add Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
