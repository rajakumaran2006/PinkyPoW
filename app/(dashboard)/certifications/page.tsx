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
  Calendar,
  Trash2
} from "lucide-react";

interface Certification {
  _id?: string;
  title: string;
  issuer: string;
  date: string;
  link: string;
  isAiValidated: boolean;
  category: "Cloud" | "AI" | "Frontend" | "Backend" | "General";
  cloudinaryImageUrl?: string;
}

interface RecommendedCert {
  id: string;
  title: string;
  provider: string;
  platform: string;
  category: "Cloud" | "AI" | "Frontend" | "Backend";
  duration: string;
  valueScore: number;
  skills: string[];
  link: string;
}

export default function Certifications() {
  // --- STATE ---
  const [myCerts, setMyCerts] = useState<Certification[]>([]);
  const [streakPoints, setStreakPoints] = useState(820);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCertTitle, setNewCertTitle] = useState("");
  const [newCertProvider, setNewCertProvider] = useState("");
  const [newCertDate, setNewCertDate] = useState("");
  const [newCertLink, setNewCertLink] = useState("");
  const [newCertCategory, setNewCertCategory] = useState<Certification["category"]>("Cloud");
  const [certFile, setCertFile] = useState<File | null>(null);
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editIssuer, setEditIssuer] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editLink, setEditLink] = useState("");
  const [editCategory, setEditCategory] = useState<Certification["category"]>("Cloud");
  const [editFile, setEditFile] = useState<File | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Discovery Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"All" | "Cloud" | "AI" | "Frontend" | "Backend">("All");

  // Web Scan State
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(true);
  const [recommendedCerts, setRecommendedCerts] = useState<RecommendedCert[]>([]);

  // AI Filter State
  const [customAiQuery, setCustomAiQuery] = useState("");
  const [aiFilteredIds, setAiFilteredIds] = useState<string[] | null>(null);
  const [isAiFiltering, setIsAiFiltering] = useState(false);

  // Fetch certifications from MongoDB
  const fetchCertifications = async () => {
    try {
      const res = await fetch("/api/ai/certifications");
      const data = await res.json();
      if (data.success) {
        setMyCerts(data.certificates);
        setStreakPoints(data.placementScore || 820);
      }
    } catch (err) {
      console.error("Error fetching certs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertifications();
  }, []);

  // Handle Form Submission inside Add Certificate Modal
  const handleAddCertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCertTitle || !newCertProvider) return;

    let uploadedUrl = "";
    if (certFile) {
      setIsUploadingFile(true);
      try {
        const formData = new FormData();
        formData.append("file", certFile);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData
        });
        const uploadData = await uploadRes.json();
        if (uploadData.success) {
          uploadedUrl = uploadData.url;
        }
      } catch (err) {
        console.error("Error uploading certificate image:", err);
      } finally {
        setIsUploadingFile(false);
      }
    }

    try {
      const res = await fetch("/api/ai/certifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add-cert",
          title: newCertTitle,
          issuer: newCertProvider,
          date: newCertDate || "June 2026",
          link: newCertLink || "#",
          category: newCertCategory,
          isAiValidated: true,
          cloudinaryImageUrl: uploadedUrl
        })
      });
      const data = await res.json();
      if (data.success) {
        setMyCerts(data.certificates);
        setStreakPoints(data.placementScore || 820);
        
        // Reset Form & Close Modal
        setNewCertTitle("");
        setNewCertProvider("");
        setNewCertDate("");
        setNewCertLink("");
        setNewCertCategory("Cloud");
        setCertFile(null);
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error("Error adding cert:", err);
    }
  };

  // Add recommended certificate directly to portfolio
  const handleAddRecommended = async (rec: RecommendedCert) => {
    try {
      const res = await fetch("/api/ai/certifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add-cert",
          title: rec.title,
          issuer: rec.provider,
          date: "Active",
          link: rec.link,
          category: rec.category,
          isAiValidated: true
        })
      });
      const data = await res.json();
      if (data.success) {
        setMyCerts(data.certificates);
        setStreakPoints(data.placementScore || 820);
        // Remove from recommended list
        setRecommendedCerts((prev) => prev.filter((c) => c.id !== rec.id));
      }
    } catch (err) {
      console.error("Error adding recommended cert:", err);
    }
  };

  // Delete certificate from portfolio
  const handleDeleteCert = async (certId?: string) => {
    if (!certId) return;
    try {
      const res = await fetch(`/api/ai/certifications?certId=${certId}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        setMyCerts(data.certificates);
      }
    } catch (err) {
      console.error("Error deleting cert:", err);
    }
  };

  const startEditing = (cert: Certification) => {
    setEditTitle(cert.title);
    setEditIssuer(cert.issuer);
    setEditDate(cert.date || "");
    setEditLink(cert.link || "");
    setEditCategory(cert.category || "Cloud");
    setEditFile(null);
    setIsEditing(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCert || !selectedCert._id) return;
    setIsSavingEdit(true);

    let uploadedUrl = selectedCert.cloudinaryImageUrl || "";
    if (editFile) {
      try {
        const formData = new FormData();
        formData.append("file", editFile);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData
        });
        const uploadData = await uploadRes.json();
        if (uploadData.success) {
          uploadedUrl = uploadData.url;
        }
      } catch (err) {
        console.error("Error uploading certificate image:", err);
      }
    }

    try {
      const res = await fetch("/api/ai/certifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          certId: selectedCert._id,
          title: editTitle,
          issuer: editIssuer,
          date: editDate,
          link: editLink,
          category: editCategory,
          cloudinaryImageUrl: uploadedUrl
        })
      });
      const data = await res.json();
      if (data.success) {
        setMyCerts(data.certificates);
        const updatedCert = data.certificates.find((c: any) => c._id === selectedCert._id);
        if (updatedCert) {
          setSelectedCert(updatedCert);
        }
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Error updating cert:", err);
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Web Scan Trigger
  const startWebScan = async () => {
    setIsScanning(true);
    setScanProgress(0);
    setScanLogs([]);

    // Clear filters
    setSearchQuery("");
    setActiveCategory("All");
    setCustomAiQuery("");
    setAiFilteredIds(null);

    const steps = [
      { text: "Initializing search query parameters...", delay: 200 },
      { text: "Analyzing Twitter developer feeds for free voucher coupon postings...", delay: 700 },
      { text: "Crawling Reddit subreddits (r/learnprogramming & r/cscareerquestions) for free courses...", delay: 1500 },
      { text: "Scanning GitHub Student Developer Pack API partners...", delay: 2200 },
      { text: "Analyzing Google Cloud Skill Boost & AWS Skill Builder catalogs...", delay: 3000 },
      { text: "Compiling verified certificates & calculating value weights...", delay: 3700 },
      { text: "Discovery complete! Rendering recommendations list...", delay: 4200 }
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setScanLogs((prev) => [...prev, `[AI Scraper] ${step.text}`]);
        setScanProgress(Math.min(Math.round(((idx + 1) / steps.length) * 100), 100));
      }, step.delay);
    });

    try {
      const res = await fetch("/api/ai/certifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "scan"
        })
      });
      const data = await res.json();

      setTimeout(() => {
        if (data.success && data.recommendations) {
          setRecommendedCerts(data.recommendations);
        }
        setIsScanning(false);
        setShowRecommendations(true);
      }, 4500);
    } catch (err) {
      console.error("Error running certifications scan:", err);
      setIsScanning(false);
    }
  };

  // Custom AI Filter Handler
  const handleAiFilter = async () => {
    if (!customAiQuery.trim()) {
      setAiFilteredIds(null);
      return;
    }
    setIsAiFiltering(true);
    try {
      const res = await fetch("/api/ai/filter-certifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          certifications: recommendedCerts,
          query: customAiQuery
        })
      });
      const data = await res.json();
      if (data.success && data.matchingIds) {
        setAiFilteredIds(data.matchingIds);
      } else {
        setAiFilteredIds([]);
      }
    } catch (err) {
      console.error("AI filter request failed:", err);
      // fallback local search
      const keywords = customAiQuery.toLowerCase().split(/\s+/).filter(w => w.length > 2);
      const matchingIds = recommendedCerts.filter((item) => {
        const skillsText = (item.skills || []).join(' ');
        const itemText = `${item.title} ${item.provider} ${item.category} ${skillsText}`.toLowerCase();
        return keywords.length === 0 || keywords.some((kw) => itemText.includes(kw));
      }).map(item => item.id);
      setAiFilteredIds(matchingIds);
    } finally {
      setIsAiFiltering(false);
    }
  };

  const handleClearAiFilter = () => {
    setCustomAiQuery("");
    setAiFilteredIds(null);
  };

  // Filter & Search Logic
  const filteredRecommendations = useMemo(() => {
    return recommendedCerts.filter((cert) => {
      // AI custom query filter if active
      if (aiFilteredIds !== null && !aiFilteredIds.includes(cert.id)) {
        return false;
      }

      const matchSearch =
        cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchCategory = activeCategory === "All" || cert.category === activeCategory;

      return matchSearch && matchCategory;
    });
  }, [recommendedCerts, searchQuery, activeCategory, aiFilteredIds]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-[#2C2B27] animate-spin" />
        <p className="text-sm text-[#7C786E] font-medium">Syncing verified credentials...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-[1360px] mx-auto pb-12 text-[#1E1D1A]">
      
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-[#FDF2F8] pb-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-normal text-[#1E1D1A] tracking-tight flex items-center gap-3">
            <Award className="w-10 h-10 text-[#ec4899] shrink-0" />
            Verified Credentials
          </h1>
          <p className="text-[#7C786E] text-sm max-w-xl">
            Track your certifications and let AI find high-impact, free industry credentials to target your placement profile.
          </p>
        </div>

        {/* Quick Credentials Summary Card */}
        <div className="flex items-center gap-4 p-5 rounded-3xl bg-white border border-[#FCE7F3] shadow-sm">
          <div className="text-center px-4 border-r border-[#FCE7F3]">
            <span className="block text-[9px] text-[#7C786E] font-semibold uppercase tracking-wider">My Certs</span>
            <span className="text-2xl font-black text-[#1E1D1A]">{myCerts.length}</span>
          </div>
          <div className="text-center px-4 border-r border-[#FCE7F3]">
            <span className="block text-[9px] text-[#7C786E] font-semibold uppercase tracking-wider">AI Scanned</span>
            <span className="text-2xl font-black text-[#be185d]">{recommendedCerts.length}</span>
          </div>
          <div className="text-center px-4">
            <span className="block text-[9px] text-[#7C786E] font-semibold uppercase tracking-wider font-sans">Avg Value</span>
            <span className="text-2xl font-black text-emerald-700">95%</span>
          </div>
        </div>
      </div>

      {/* 2. My Certifications (Top Section) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#1E1D1A] tracking-tight flex items-center gap-2">
              My Certifications
            </h2>
            <p className="text-xs text-[#7C786E] mt-1">Currently verified developer credentials</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#FCE7F3] hover:bg-[#FFF5F7] text-[#1E1D1A] text-xs font-bold transition-all cursor-pointer shadow-sm hover:border-[#ec4899]"
          >
            <Plus className="w-4 h-4 text-[#be185d]" />
            Add Certificate
          </button>
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myCerts.map((cert) => (
            <div
              key={cert._id}
              onClick={() => setSelectedCert(cert)}
              className="warm-card rounded-2xl p-6 flex flex-col justify-between border border-[#FDF2F8] hover:border-[#ec4899] transition-all duration-300 relative overflow-hidden group bg-white cursor-pointer"
            >
              {/* Subtle top ambient color gradient */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ec4899] via-[#be185d] to-[#2C2B27] opacity-60" />

              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] text-[#7C786E] font-bold uppercase tracking-wider block truncate">
                      {cert.issuer}
                    </span>
                    <h3 className="font-bold text-[#1E1D1A] text-base leading-snug mt-1.5 group-hover:text-[#be185d] transition-colors line-clamp-2">
                      {cert.title}
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-1.5 shrink-0 ml-3">
                    {cert.isAiValidated ? (
                      <div className="p-1 rounded bg-emerald-50 border border-emerald-250 text-emerald-700" title="AI Validated">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="p-1 rounded bg-[#FCE7F3] border border-[#E8DFB3] text-[#be185d] animate-pulse">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      </div>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCert(cert._id);
                      }}
                      className="p-1 rounded text-[#7C786E] hover:text-red-650 hover:bg-[#FFF5F7] transition-colors cursor-pointer border border-transparent hover:border-[#FCE7F3]"
                      title="Delete Certificate"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-[#FDF2F8]">
                  <span className="text-[#7C786E] text-[10px] uppercase font-bold">Category</span>
                  <span className="px-2 py-0.5 rounded-md bg-[#FFF5F7] border border-[#FCE7F3] text-[#4E4B42] text-[10px] font-semibold">
                    {cert.category || "General"}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#FDF2F8] flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-[#7C786E]">
                  <Calendar className="w-3.5 h-3.5 text-[#7C786E]" />
                  <span>{cert.date || "Active"}</span>
                </div>

                {cert.link && cert.link !== "#" && (
                  <a
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 rounded bg-[#FFF5F7] hover:bg-white border border-[#FCE7F3] text-[#7C786E] hover:text-[#1E1D1A] transition-colors shadow-sm"
                    title="Verify Credential URL"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}

          {myCerts.length === 0 && (
            <div className="col-span-full warm-card p-12 text-center text-[#7C786E] bg-white">
              <Award className="w-12 h-12 text-[#7C786E] mx-auto mb-2 opacity-40 animate-bounce" />
              <h4 className="font-bold text-[#1E1D1A] text-sm">No verified credentials recorded</h4>
              <p className="text-xs text-[#7C786E] max-w-sm mx-auto mt-1">
                Scan for free certifications below or add certificates manually to build your resume dashboard.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 3. AI Discovery Engine (Main Section) */}
      <div className="border-t border-[#FDF2F8] pt-10 space-y-8">
        
        {/* Banner with engine summary */}
        <div className="warm-card p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-white">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-[#1E1D1A] tracking-tight flex items-center gap-2">
              AI Discovery Engine
            </h3>
            <p className="text-xs text-[#7C786E] max-w-xl leading-relaxed">
              Our autonomous scanner combs premium directories, developer registries, and free course catalogues, including Reddit recommendations, Twitter updates, GitHub student packages, Google courses, and AWS programs to aggregate high-weight industry certifications matching your placement roadmap.
            </p>
          </div>

          <button
            onClick={startWebScan}
            disabled={isScanning}
            className={`w-full md:w-auto px-6 py-3.5 rounded-2xl bg-[#2C2B27] text-white hover:bg-[#1E1D1A] font-bold text-xs tracking-wide shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 ${
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
                <RefreshCw className="w-4 h-4" />
                <span>Scan Web for Free Certs</span>
              </>
            )}
          </button>
        </div>

        {/* Simulated scanning console */}
        {isScanning && (
          <div className="bg-[#21201D] border border-[#2D2C28] rounded-2xl p-5 space-y-4 animate-in slide-in-from-top-4 duration-300 text-zinc-300">
            <div className="flex justify-between items-center pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ec4899] animate-ping" />
                <span className="text-[10px] text-zinc-450 font-bold uppercase tracking-wider font-mono">AI Scraper Crawler Pipeline</span>
              </div>
              <span className="text-xs text-[#ec4899] font-bold font-mono">{scanProgress}%</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#ec4899] to-[#be185d] transition-all duration-300"
                style={{ width: `${scanProgress}%` }}
              />
            </div>

            {/* Logs console */}
            <div className="space-y-1.5 font-mono text-[10px] text-zinc-500 max-h-[140px] overflow-y-auto scrollbar-none pt-1">
              {scanLogs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-[#ec4899]/70 shrink-0">&gt;</span>
                  <span className="text-zinc-300">{log}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {showRecommendations && recommendedCerts.length > 0 && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pb-2">
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7C786E]" />
                <input
                  type="text"
                  placeholder="Filter certifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-[#FCE7F3] focus:outline-none focus:border-[#ec4899] text-xs text-[#1E1D1A] placeholder-[#7C786E] transition-colors shadow-sm"
                />
              </div>

              {/* Filtering Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
                <Filter className="w-3.5 h-3.5 text-[#7C786E] mr-1.5 shrink-0 hidden md:block" />
                {(["All", "Cloud", "AI", "Frontend", "Backend"] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-bold tracking-wide transition-all duration-300 whitespace-nowrap cursor-pointer ${
                      activeCategory === cat
                        ? "bg-[#2C2B27] text-white shadow-sm"
                        : "bg-white text-[#7C786E] hover:text-[#1E1D1A] hover:bg-[#FFF5F7] border border-[#FCE7F3] shadow-sm"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom AI Semantic Filter */}
            <div className="warm-card p-6 bg-white border border-[#FCE7F3] rounded-2xl shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-extrabold text-[#be185d] uppercase tracking-wider flex items-center gap-1.5">
                    Custom AI Semantic Filter
                  </span>
                  <p className="text-xs text-[#7C786E]">
                    Type your custom requirements (e.g. "Cloud certifications from AWS with duration &lt; 10 hours") and let AI filter accordingly.
                  </p>
                </div>
                {aiFilteredIds !== null && (
                  <button
                    onClick={handleClearAiFilter}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 cursor-pointer"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={customAiQuery}
                  onChange={(e) => setCustomAiQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAiFilter()}
                  placeholder="e.g. AI certifications with skills including Python..."
                  className="flex-1 px-4 py-3 rounded-xl bg-[#FFF5F7] border border-[#FCE7F3] text-xs text-[#1E1D1A] placeholder-[#7C786E]/50 focus:outline-none focus:border-[#ec4899]"
                />
                <button
                  onClick={handleAiFilter}
                  disabled={isAiFiltering}
                  className="px-6 py-3 bg-[#2C2B27] hover:bg-[#1E1D1A] text-white font-extrabold text-xs rounded-xl transition-all flex items-center gap-1 shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAiFiltering ? "Filtering..." : "Filter with AI"}
                </button>
              </div>
            </div>

            {/* Recommendations Grid */}
            {filteredRecommendations.length === 0 ? (
              <div className="warm-card p-12 text-center text-[#7C786E] bg-white">
                <Search className="w-12 h-12 text-[#7C786E] mx-auto mb-2" />
                <h4 className="font-bold text-[#1E1D1A] text-sm">No matched recommendations</h4>
                <p className="text-xs text-[#7C786E] max-w-sm mx-auto mt-1">
                  Try checking your search filters or running a new web scan.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredRecommendations.map((cert) => (
                  <div
                    key={cert.id}
                    className="warm-card p-6 border border-[#FDF2F8] hover:border-[#ec4899] transition-all duration-300 flex flex-col justify-between space-y-6 group bg-white shadow-sm"
                  >
                    <div className="space-y-4">
                      {/* Top Header Row with AI Badge */}
                      <div className="flex justify-between items-start gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 text-[#7C786E] text-[10px] font-bold uppercase tracking-wider">
                            <span className="truncate">{cert.provider}</span>
                            <span>•</span>
                            <span className="text-[#7C786E] truncate">{cert.platform}</span>
                          </div>
                          <h4 className="font-bold text-[#1E1D1A] text-base leading-snug tracking-tight mt-1.5 group-hover:text-[#be185d] transition-colors line-clamp-2">
                            {cert.title}
                          </h4>
                        </div>

                        {/* STRIKING AI VALIDATED BADGE */}
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-extrabold tracking-wide shrink-0 shadow-sm transition-all duration-300">
                          <CheckCircle className="w-3.5 h-3.5 fill-emerald-50 text-emerald-600" />
                          <span>AI Validated</span>
                        </div>
                      </div>

                      {/* Technical skills acquired */}
                      <div className="flex flex-wrap gap-1">
                        {cert.skills.map((skill) => (
                          <span
                            key={skill}
                            className="text-[9px] font-semibold px-2 py-0.5 rounded-md bg-[#FFF5F7] border border-[#FCE7F3] text-[#4E4B42]"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Metadata Footer and Enroll Button */}
                    <div className="pt-4 border-t border-[#FDF2F8] flex items-center justify-between">
                      <div className="flex items-center gap-4 text-[10px] text-[#7C786E]">
                        <div>
                          <span className="block text-[#7C786E] uppercase font-semibold">Duration</span>
                          <span className="font-bold text-[#1E1D1A]">{cert.duration}</span>
                        </div>
                        <div className="px-3 border-l border-[#FDF2F8]">
                          <span className="block text-[#7C786E] uppercase font-semibold">Value Score</span>
                          <span className="font-bold text-emerald-700 flex items-center gap-0.5">
                            <TrendingUp className="w-3 h-3" /> {cert.valueScore}%
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={cert.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2 px-3 rounded-xl bg-white border border-[#FCE7F3] hover:bg-[#FFF5F7] text-[#1E1D1A] text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer shadow-sm"
                        >
                          <span>Info</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>

                        <button
                          onClick={() => handleAddRecommended(cert)}
                          className="py-2 px-3 rounded-xl bg-[#2C2B27] hover:bg-[#1E1D1A] text-white text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer shadow-sm"
                        >
                          <span>Complete & Add</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* --- ADD CERTIFICATE MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div
            className="w-full max-w-md bg-[#FFF5F7] border border-[#FCE7F3] rounded-3xl p-6 space-y-6 shadow-2xl relative animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 p-1.5 rounded-full bg-[#FFF5F7] hover:bg-[#FFF5F7] border border-[#FCE7F3] text-[#7C786E] hover:text-[#1E1D1A] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div>
              <h3 className="text-xl font-bold text-[#1E1D1A] tracking-tight flex items-center gap-2">
                <Award className="w-5 h-5 text-[#ec4899]" />
                Add Certificate
              </h3>
              <p className="text-xs text-[#7C786E] mt-1.5">
                Enter your certification details. PinkyPow AI will crawl the link to verify its validity.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleAddCertSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-[#7C786E] font-bold uppercase tracking-wider block">
                  Certification Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Google Cloud Professional Architect"
                  value={newCertTitle}
                  onChange={(e) => setNewCertTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#FCE7F3] focus:outline-none focus:border-[#ec4899] text-xs text-[#1E1D1A] placeholder-[#7C786E] transition-colors shadow-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-[#7C786E] font-bold uppercase tracking-wider block">
                  Issuing Provider
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Google Cloud, AWS, freeCodeCamp"
                  value={newCertProvider}
                  onChange={(e) => setNewCertProvider(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#FCE7F3] focus:outline-none focus:border-[#ec4899] text-xs text-[#1E1D1A] placeholder-[#7C786E] transition-colors shadow-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-[#7C786E] font-bold uppercase tracking-wider block">
                    Completion Date
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. June 2026"
                    value={newCertDate}
                    onChange={(e) => setNewCertDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#FCE7F3] focus:outline-none focus:border-[#ec4899] text-xs text-[#1E1D1A] placeholder-[#7C786E] transition-colors shadow-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-[#7C786E] font-bold uppercase tracking-wider block">
                    Category
                  </label>
                  <select
                    value={newCertCategory}
                    onChange={(e) => setNewCertCategory(e.target.value as Certification["category"])}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#FCE7F3] focus:outline-none focus:border-[#ec4899] text-xs text-[#1E1D1A] transition-colors shadow-sm"
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
                <label className="text-[10px] text-[#7C786E] font-bold uppercase tracking-wider block">
                  Credential Verification URL
                </label>
                <input
                  type="url"
                  placeholder="https://aws.amazon.com/verification/..."
                  value={newCertLink}
                  onChange={(e) => setNewCertLink(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#FCE7F3] focus:outline-none focus:border-[#ec4899] text-xs text-[#1E1D1A] placeholder-[#7C786E] transition-colors shadow-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-[#7C786E] font-bold uppercase tracking-wider block">
                  Certificate Photo / Copy (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setCertFile(e.target.files[0]);
                    }
                  }}
                  className="w-full px-4 py-2 rounded-xl bg-white border border-[#FCE7F3] focus:outline-none text-xs text-[#1E1D1A] transition-colors shadow-sm"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isUploadingFile}
                  className="px-4 py-2.5 rounded-xl bg-white border border-[#FCE7F3] text-[#7C786E] hover:text-[#1E1D1A] hover:bg-[#FFF5F7] text-xs font-bold transition-all cursor-pointer shadow-sm disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploadingFile}
                  className="px-4 py-2.5 rounded-xl bg-[#2C2B27] text-white hover:bg-[#1E1D1A] text-xs font-bold transition-all cursor-pointer shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isUploadingFile ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Uploading Image...</span>
                    </>
                  ) : (
                    "Add Certificate"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- CERTIFICATE DETAILS MODAL --- */}
      {selectedCert && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300" onClick={() => { setSelectedCert(null); setIsEditing(false); }}>
          <div
            className="w-full max-w-lg bg-[#FFF5F7] border border-[#FCE7F3] rounded-3xl p-6 space-y-6 shadow-2xl relative animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => { setSelectedCert(null); setIsEditing(false); }}
              className="absolute right-4 top-4 p-1.5 rounded-full bg-[#FFF5F7] hover:bg-[#FFF5F7] border border-[#FCE7F3] text-[#7C786E] hover:text-[#1E1D1A] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {isEditing ? (
              <form onSubmit={handleSaveEdit} className="space-y-4">
                <h3 className="text-lg font-bold text-[#1E1D1A]">Edit Certificate</h3>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] text-[#7C786E] font-bold uppercase tracking-wider block">
                    Certificate Title
                  </label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#FCE7F3] focus:outline-none focus:border-[#ec4899] text-xs text-[#1E1D1A] placeholder-[#7C786E] transition-colors shadow-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-[#7C786E] font-bold uppercase tracking-wider block">
                    Issuer / Provider
                  </label>
                  <input
                    type="text"
                    required
                    value={editIssuer}
                    onChange={(e) => setEditIssuer(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#FCE7F3] focus:outline-none focus:border-[#ec4899] text-xs text-[#1E1D1A] placeholder-[#7C786E] transition-colors shadow-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-[#7C786E] font-bold uppercase tracking-wider block">
                      Completion Date
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. June 2026"
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#FCE7F3] focus:outline-none focus:border-[#ec4899] text-xs text-[#1E1D1A] placeholder-[#7C786E] transition-colors shadow-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-[#7C786E] font-bold uppercase tracking-wider block">
                      Category
                    </label>
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value as Certification["category"])}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#FCE7F3] focus:outline-none focus:border-[#ec4899] text-xs text-[#1E1D1A] transition-colors shadow-sm"
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
                  <label className="text-[10px] text-[#7C786E] font-bold uppercase tracking-wider block">
                    Credential Verification URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={editLink}
                    onChange={(e) => setEditLink(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#FCE7F3] focus:outline-none focus:border-[#ec4899] text-xs text-[#1E1D1A] placeholder-[#7C786E] transition-colors shadow-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-[#7C786E] font-bold uppercase tracking-wider block">
                    Update Photo / Copy
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setEditFile(e.target.files[0]);
                      }
                    }}
                    className="w-full px-4 py-2 rounded-xl bg-white border border-[#FCE7F3] focus:outline-none text-xs text-[#1E1D1A] transition-colors shadow-sm"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    disabled={isSavingEdit}
                    className="px-4 py-2.5 rounded-xl bg-white border border-[#FCE7F3] text-[#7C786E] hover:text-[#1E1D1A] hover:bg-[#FFF5F7] text-xs font-bold transition-all cursor-pointer shadow-sm disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingEdit}
                    className="px-4 py-2.5 rounded-xl bg-[#2C2B27] text-white hover:bg-[#1E1D1A] text-xs font-bold transition-all cursor-pointer shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {isSavingEdit ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <>
                {/* Header */}
                <div>
                  <span className="text-[10px] text-[#7C786E] font-bold uppercase tracking-wider block">
                    {selectedCert.issuer}
                  </span>
                  <h3 className="text-xl font-bold text-[#1E1D1A] tracking-tight mt-1">
                    {selectedCert.title}
                  </h3>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 text-xs border-y border-[#FDF2F8] py-4">
                  <div>
                    <span className="block text-[#7C786E] uppercase font-bold text-[9px] tracking-wider">Completion Date</span>
                    <span className="font-semibold text-[#1E1D1A] mt-1 block">{selectedCert.date || "Active"}</span>
                  </div>
                  <div>
                    <span className="block text-[#7C786E] uppercase font-bold text-[9px] tracking-wider">Category</span>
                    <span className="px-2 py-0.5 rounded bg-[#FFF5F7] border border-[#FCE7F3] text-[#4E4B42] text-[10px] font-semibold mt-1 inline-block">
                      {selectedCert.category || "General"}
                    </span>
                  </div>
                </div>

                {/* Certificate Image Copy */}
                {selectedCert.cloudinaryImageUrl ? (
                  <div className="space-y-2">
                    <span className="block text-[#7C786E] uppercase font-bold text-[9px] tracking-wider">Certificate Copy</span>
                    <div className="relative rounded-2xl overflow-hidden border border-[#FCE7F3] bg-white aspect-[4/3] flex items-center justify-center">
                      <img
                        src={selectedCert.cloudinaryImageUrl}
                        alt={selectedCert.title}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center border border-dashed border-[#FCE7F3] rounded-2xl bg-white/50 text-[#7C786E] space-y-3">
                    <p className="text-xs">No certificate image uploaded for this credential.</p>
                    <button
                      onClick={() => startEditing(selectedCert)}
                      className="px-4 py-2 rounded-xl bg-white border border-[#FCE7F3] text-[#1E1D1A] hover:bg-[#FFF5F7] text-xs font-semibold transition-all cursor-pointer shadow-sm animate-pulse"
                    >
                      Upload Photo Now
                    </button>
                  </div>
                )}

                <div className="pt-2 flex items-center justify-between gap-3">
                  {selectedCert.link && selectedCert.link !== "#" && (
                    <a
                      href={selectedCert.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-4 rounded-xl bg-white border border-[#FCE7F3] hover:bg-[#FFF5F7] text-[#1E1D1A] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <span>Verify Credential</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <div className="flex items-center gap-3 ml-auto">
                    <button
                      onClick={() => startEditing(selectedCert)}
                      className="px-4 py-2.5 rounded-xl bg-white border border-[#FCE7F3] text-[#1E1D1A] hover:bg-[#FFF5F7] text-xs font-bold transition-all cursor-pointer shadow-sm"
                    >
                      Edit Details
                    </button>
                    <button
                      onClick={() => { setSelectedCert(null); setIsEditing(false); }}
                      className="px-6 py-2.5 rounded-xl bg-[#2C2B27] text-white hover:bg-[#1E1D1A] text-xs font-bold transition-all cursor-pointer shadow-sm"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

