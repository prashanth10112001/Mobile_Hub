import Link from "next/link";
import { Smartphone, PlusCircle } from "lucide-react";

export function AdminSidebar() {
  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between h-screen sticky top-0">
      <div className="p-4 flex flex-col gap-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-2 px-2">
          <Smartphone className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-bold text-slate-100">mobileHub</h2>
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400">
            Admin
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1">
          <Link
            href="/admin/mobiles"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-sm font-medium"
          >
            <Smartphone className="w-4 h-4 text-slate-400" />
            All Mobiles
          </Link>

          <Link
            href="/admin/mobiles/new"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-sm font-medium"
          >
            <PlusCircle className="w-4 h-4 text-slate-400" />
            Add Mobile
          </Link>
        </nav>
      </div>

      <div className="p-4 border-t border-slate-800 text-xs text-slate-500">
        Control Center
      </div>
    </aside>
  );
}
