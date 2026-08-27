import React from "react";
import { ThemeToggle } from "./ThemeToggle";

export function AdminNavbar() {
  return (
    <header className="h-16 border-b border-slate-800 bg-white dark:bg-slate-900/50 backdrop-blur px-8 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400">API Gateway:</span>
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-0.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          Spring Boot REST Connected
        </span>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <div className="text-right">
          <p className="text-xs font-medium text-slate-200">System Admin</p>
          <p className="text-[10px] text-slate-400">Local Environment</p>
        </div>
      </div>
    </header>
  );
}
