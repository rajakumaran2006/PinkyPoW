"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Home, Briefcase, Trophy, MessageSquare, Code,
  Award, FolderGit, User, Menu, X, ChevronLeft,
  Bell, Moon, Search, LogOut
} from "lucide-react";

/* ── Constants ──────────────────────────────────────── */
export const HEADER_H  = 48;   // px — top bar height
export const SIDEBAR_W = 240;  // px — sidebar width

/* ── Nav items & page meta ──────────────────────────── */
const navItems = [
  { name: "Dashboard",      href: "/dashboard",      Icon: Home },
  { name: "Jobs and Internships", href: "/internships",    Icon: Briefcase },
  { name: "Hackathons",     href: "/hackathons",     Icon: Trophy },
  { name: "Communication",  href: "/communication",  Icon: MessageSquare },
  { name: "DSA",            href: "/dsa",            Icon: Code },
  { name: "Certifications", href: "/certifications", Icon: Award },
  { name: "Projects",       href: "/projects",       Icon: FolderGit },
  { name: "Profile",        href: "/profile",        Icon: User },
];

const pageMeta: Record<string, { title: string; sub: string }> = {
  "/dashboard":      { title: "Dashboard",      sub: "Placement overview & performance metrics" },
  "/internships":    { title: "Jobs and Internships", sub: "Internships & full-time offers" },
  "/hackathons":     { title: "Hackathons",     sub: "Discover & track coding events" },
  "/communication":  { title: "Communication",  sub: "Speech practice & coach tasks" },
  "/dsa":            { title: "DSA",            sub: "Dynamic problem plans & battleground" },
  "/certifications": { title: "Certifications", sub: "Validate & earn skill certificates" },
  "/projects":       { title: "Projects",       sub: "Portfolio & resume engine" },
  "/profile":        { title: "Profile",        sub: "Your hacker identity & settings" },
};

/* ── Sidebar (header + nav panel) ──────────────────── */
interface SidebarProps { placementScore?: number; }

export default function Sidebar({ placementScore = 820 }: SidebarProps) {
  const pathname    = usePathname();
  const router      = useRouter();
  const [open, setOpen]         = useState(true);   // desktop collapse
  const [drawer, setDrawer]     = useState(false);  // mobile drawer
  const [search, setSearch]     = useState("");
  const [currentUser, setCurrentUser] = useState<{ name: string; placementScore: number } | null>(null);

  // Retrieve current user details from localStorage
  useEffect(() => {
    const session = localStorage.getItem("currentUser");
    if (session) {
      try {
        setCurrentUser(JSON.parse(session));
      } catch (e) {
        console.error("Failed to parse user session in Sidebar:", e);
      }
    }
  }, []);

  const scoreToUse = currentUser ? currentUser.placementScore : placementScore;
  const nameToUse = currentUser ? currentUser.name : "Raja Kumaran";

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    router.push("/");
  };

  const meta = pageMeta[pathname] ?? { title: "PinkyPow", sub: "AI Placement Preparation" };
  const items = navItems.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.style.setProperty(
        "--sidebar-desktop-width",
        open ? "240px" : "0px"
      );
    }
  }, [open]);

  // Extract initials
  const getInitials = (n: string) => {
    return n.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase();
  };

  /* ── JSX ── */
  return (
    <>
      {/* ══════════ FIXED TOP HEADER ══════════ */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0,
        height: `${HEADER_H}px`, zIndex: 50,
        display: "flex", alignItems: "stretch",
        background: "#ffffff",
        borderBottom: "1px solid #E8E5DC",
      }}>

        {/* Brand cell — mirrors sidebar width on desktop */}
        <div style={{
          width: open ? `${SIDEBAR_W}px` : "0px",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: open ? "0 16px" : "0px",
          borderRight: open ? "1px solid #E8E5DC" : "none",
          overflow: "hidden",
          transition: "width 0.3s ease, padding 0.3s ease, border-right 0.3s ease",
        }}
          className="sidebar-brand-cell"
        >
          <div style={{ width: 32, height: 32, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Image src="/logo-white.png" alt="PinkyPow" width={32} height={32} style={{ objectFit: "contain" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2, overflow: "hidden" }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: "#09090b", whiteSpace: "nowrap" }}>PinkyPow</span>
            <span style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#ec4899", whiteSpace: "nowrap" }}>AI Placement</span>
          </div>
        </div>

        {/* Collapse/expand button — desktop only */}
        <button
          onClick={() => setOpen(v => !v)}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 32, flexShrink: 0,
            background: "transparent", cursor: "pointer",
            color: "#a1a1aa",
            border: "none",
            borderRight: "1px solid #E8E5DC",
          }}
          className="sidebar-toggle-btn"
          aria-label="Toggle sidebar"
        >
          <ChevronLeft
            size={14}
            style={{ transition: "transform 0.3s", transform: open ? "rotate(0deg)" : "rotate(180deg)" }}
          />
        </button>

        {/* Page title + actions */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", minWidth: 0 }}>
          {/* Mobile: hamburger + logo */}
          <div className="mobile-brand" style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => setDrawer(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: 6, color: "#71717a" }}>
              <Menu size={20} />
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Image src="/logo-white.png" alt="PinkyPow" width={22} height={22} style={{ objectFit: "contain" }} />
              <span style={{ fontWeight: 700, fontSize: 14, color: "#09090b" }}>PinkyPow</span>
            </div>
          </div>

          {/* Desktop: page title */}
          <div className="desktop-title" style={{ display: "flex", flexDirection: "column", lineHeight: 1.3, minWidth: 0 }}>
            <span style={{ fontWeight: 700, fontSize: 13, letterSpacing: "0.08em", color: "#18181b", textTransform: "uppercase" }}>
              {meta.title}
            </span>
            <span style={{ fontSize: 10, color: "#a1a1aa", fontWeight: 500, letterSpacing: "0.04em", marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {meta.sub}
            </span>
          </div>

          {/* Right icons */}
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: "auto" }}>
            <button style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8, background: "none", border: "none", cursor: "pointer", color: "#a1a1aa" }}>
              <Moon size={16} />
            </button>
            <button style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8, background: "none", border: "none", cursor: "pointer", color: "#a1a1aa" }}>
              <Bell size={16} />
            </button>
            
            {/* Dynamic Initial Avatar */}
            <div style={{ 
              width: 28, 
              height: 28, 
              borderRadius: "50%", 
              background: "linear-gradient(to top right, #ec4899, #9333ea)", 
              border: "2px solid #d4d4d8", 
              overflow: "hidden", 
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontSize: "10px",
              fontWeight: "extrabold",
              letterSpacing: "0.05em"
            }}>
              {getInitials(nameToUse)}
            </div>
          </div>
        </div>
      </header>

      {/* ══════════ MOBILE DRAWER BACKDROP ══════════ */}
      {drawer && (
        <div
          onClick={() => setDrawer(false)}
          style={{ position: "fixed", inset: 0, zIndex: 48, background: "rgba(0,0,0,0.25)", backdropFilter: "blur(4px)" }}
        />
      )}

      {/* ══════════ MOBILE DRAWER SIDEBAR ══════════ */}
      <aside style={{
        position: "fixed",
        top: 0, bottom: 0, left: 0,
        width: `${SIDEBAR_W}px`,
        zIndex: 49,
        background: "#F9F9FB",
        borderRight: "1px solid #e4e4e7",
        display: "flex",
        flexDirection: "column",
        transform: drawer ? "translateX(0)" : `translateX(-${SIDEBAR_W}px)`,
        transition: "transform 0.3s ease",
      }}
        className="mobile-drawer"
      >
        {/* Drawer top bar */}
        <div style={{ height: HEADER_H, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", borderBottom: "1px solid #e4e4e7", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Image src="/logo-white.png" alt="PinkyPow" width={26} height={26} style={{ objectFit: "contain" }} />
            <span style={{ fontWeight: 700, fontSize: 14, color: "#09090b" }}>PinkyPow</span>
          </div>
          <button onClick={() => setDrawer(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#a1a1aa", padding: 6 }}>
            <X size={16} />
          </button>
        </div>
        <NavContent 
          items={items} 
          search={search} 
          setSearch={setSearch} 
          pathname={pathname} 
          onNav={() => setDrawer(false)} 
          score={scoreToUse} 
          name={nameToUse} 
          onLogout={handleLogout} 
        />
      </aside>

      {/* ══════════ DESKTOP SIDEBAR PANEL ══════════ */}
      <aside style={{
        position: "fixed",
        top: `${HEADER_H}px`, bottom: 0, left: 0,
        width: `${SIDEBAR_W}px`,
        zIndex: 40,
        background: "#F9F9FB",
        borderRight: "1px solid #e4e4e7",
        display: "flex",
        flexDirection: "column",
        transform: open ? "translateX(0)" : `translateX(-${SIDEBAR_W}px)`,
        transition: "transform 0.3s ease",
      }}
        className="desktop-sidebar"
      >
        <NavContent 
          items={items} 
          search={search} 
          setSearch={setSearch} 
          pathname={pathname} 
          onNav={() => {}} 
          score={scoreToUse} 
          name={nameToUse} 
          onLogout={handleLogout} 
        />
      </aside>

      {/* Responsive CSS */}
      <style>{`
        /* Desktop: show desktop sidebar brand cell + toggle; hide mobile hamburger brand */
        @media (min-width: 1024px) {
          .mobile-brand   { display: none !important; }
          .desktop-title  { display: flex !important; }
          .mobile-drawer  { display: none !important; }
          .layout-content-offset {
            padding-left: var(--sidebar-desktop-width, ${open ? "240px" : "0px"}) !important;
            transition: padding-left 0.3s ease !important;
          }
        }
        /* Mobile: hide desktop sidebar panel + brand cell; show hamburger brand */
        @media (max-width: 1023px) {
          .sidebar-brand-cell  { display: none !important; }
          .sidebar-toggle-btn  { display: none !important; }
          .desktop-sidebar     { display: none !important; }
          .mobile-brand        { display: flex !important; }
          .desktop-title       { display: none !important; }
          .mobile-drawer       { display: flex !important; }
          .layout-content-offset {
            padding-left: 0 !important;
            transition: padding-left 0.3s ease !important;
          }
        }
      `}</style>
    </>
  );
}

/* ── Shared nav body ──────────────────────────────── */
function NavContent({
  items, search, setSearch, pathname, onNav, score, name, onLogout
}: {
  items: typeof navItems;
  search: string;
  setSearch: (v: string) => void;
  pathname: string;
  onNav: () => void;
  score: number;
  name: string;
  onLogout: () => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden", padding: "16px 12px" }}>
      {/* Search */}
      <div style={{ position: "relative", marginBottom: 16 }}>
        <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#a1a1aa", pointerEvents: "none" }} />
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: "100%", paddingLeft: 30, paddingRight: 10, paddingTop: 6, paddingBottom: 6,
            background: "#f4f4f5", border: "1px solid transparent", borderRadius: 8,
            fontSize: 12, color: "#27272a", outline: "none", boxSizing: "border-box",
          }}
          onFocus={e => { (e.target as HTMLInputElement).style.background = "#fff"; (e.target as HTMLInputElement).style.borderColor = "#e4e4e7"; }}
          onBlur={e  => { (e.target as HTMLInputElement).style.background = "#f4f4f5"; (e.target as HTMLInputElement).style.borderColor = "transparent"; }}
        />
      </div>

      {/* Nav links */}
      <nav style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1, overflowY: "auto" }}>
        {items.map(({ name, href, Icon }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={name}
              href={href}
              onClick={onNav}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "8px 12px", borderRadius: 8,
                textDecoration: "none", fontSize: 13, fontWeight: active ? 600 : 400,
                color: active ? "#18181b" : "#71717a",
                background: active ? "rgba(161,161,170,0.18)" : "transparent",
                transition: "background 0.15s, color 0.15s",
              }}
              onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLAnchorElement).style.background = "#f4f4f5"; (e.currentTarget as HTMLAnchorElement).style.color = "#18181b"; } }}
              onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; (e.currentTarget as HTMLAnchorElement).style.color = "#71717a"; } }}
            >
              <Icon size={15} style={{ flexShrink: 0, color: active ? "#27272a" : "#a1a1aa" }} />
              <span>{name}</span>
            </Link>
          );
        })}
        {items.length === 0 && (
          <span style={{ fontSize: 11, color: "#a1a1aa", fontStyle: "italic", padding: "8px 12px" }}>No items found</span>
        )}

        {/* Logout Button */}
        <button 
          onClick={onLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 12px",
            borderRadius: 8,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: 13,
            color: "#ef4444",
            marginTop: "auto",
            width: "100%",
            textAlign: "left",
            transition: "background 0.15s"
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(239, 68, 68, 0.08)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
        >
          <LogOut size={15} style={{ flexShrink: 0, color: "#ef4444" }} />
          <span style={{ fontWeight: 500 }}>Sign Out</span>
        </button>
      </nav>

      {/* Score footer */}
      <div style={{ marginTop: "auto", paddingTop: 12, borderTop: "1px solid rgba(228,228,231,0.6)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 4px 0" }}>
        <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
          <span style={{ fontSize: 8, textTransform: "uppercase", letterSpacing: "0.14em", color: "#a1a1aa", fontWeight: 700 }}>Placement Score</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#27272a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</span>
        </div>
        <span style={{ background: "#fffbeb", color: "#b45309", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 8, border: "1px solid rgba(180,130,0,0.2)", flexShrink: 0 }}>
          {score}
        </span>
      </div>
    </div>
  );
}
