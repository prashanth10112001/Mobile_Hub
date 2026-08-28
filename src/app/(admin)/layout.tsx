import { AdminSidebar } from "@/components/admin/layout/AdminSidebar";
import { AdminNavbar } from "@/components/admin/layout/AdminNavbar";
import { AdminFooter } from "@/components/admin/layout/AdminFooter";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Navbar Header */}
        <AdminNavbar />

        {/* Main Body */}
        <main className="flex-1 p-8 overflow-y-auto bg-slate-50 dark:bg-slate-950 transition-colors">
          {children}
        </main>

        {/* Footer */}
        <AdminFooter />
      </div>
    </div>
  );
}
