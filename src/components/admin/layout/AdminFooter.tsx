export function AdminFooter() {
  return (
    <footer className="border-t border-slate-800 px-8 py-4 bg-slate-950 text-slate-500 text-xs flex justify-between items-center">
      <p>&copy; {new Date().getFullYear()} mobileHub Catalog System.</p>
      <p className="text-slate-600">Next.js 14 App Router + Spring Boot</p>
    </footer>
  );
}
