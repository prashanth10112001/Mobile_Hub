import { AdminSidebar } from "@/components/admin/layout/AdminSidebar";
import { AdminNavbar } from "@/components/admin/layout/AdminNavbar";
import { AdminFooter } from "@/components/admin/layout/AdminFooter";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Navbar Header */}
        <AdminNavbar />

        {/* Main Body */}
        <main className="flex-1 p-8 overflow-y-auto">{children}</main>

        {/* Footer */}
        <AdminFooter />
      </div>
    </div>
  );
}
