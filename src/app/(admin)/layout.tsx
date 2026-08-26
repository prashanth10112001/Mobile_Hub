import "../globals.css";
import Link from "next/link";
import { Smartphone, PlusCircle } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-900 text-slate-100 min-h-screen flex">
        <aside className="w-64 bg-slate-800 border-r border-slate-700 p-4 flex flex-col gap-4">
          <h2 className="text-xl font-bold text-blue-400">mobileHub Admin</h2>
          <nav className="flex flex-col gap-2">
            <Link
              href="/admin/mobiles"
              className="flex items-center gap-2 p-2 rounded hover:bg-slate-700"
            >
              <Smartphone className="w-5 h-5" /> All Mobiles
            </Link>
            <Link
              href="/admin/mobiles/new"
              className="flex items-center gap-2 p-2 rounded hover:bg-slate-700"
            >
              <PlusCircle className="w-5 h-5" /> Add Mobile
            </Link>
          </nav>
        </aside>
        <main className="flex-1 p-8 bg-slate-950">{children}</main>
      </body>
    </html>
  );
}
