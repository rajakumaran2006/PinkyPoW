import React from "react";
import Sidebar from "../../components/Sidebar";
import { HEADER_H } from "../../components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Fixed header + sidebar panel (both inside Sidebar) */}
      <Sidebar />

      {/*
        Content wrapper:
        - paddingTop  = HEADER_H   (clears the fixed top bar)
        - paddingLeft = 240px      (clears the fixed sidebar on desktop via .layout-content-offset class)
      */}
      <div
        className="warm-dashboard-bg"
        style={{ minHeight: "100vh", paddingTop: HEADER_H }}
      >
        {/* Inner wrapper — adds left-padding on desktop via CSS class */}
        <div className="layout-content-offset">
          <main>
            <div className="px-4 md:px-8 py-8 max-w-[1480px] mx-auto w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

