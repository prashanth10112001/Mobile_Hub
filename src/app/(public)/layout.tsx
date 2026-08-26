import "../globals.css";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900">
        <header className="bg-blue-600 text-white p-4 font-bold">
          mobileHub
        </header>
        <main>{children}</main>
        <footer className="p-4 bg-gray-100 text-center text-sm">
          © 2026 mobileHub
        </footer>
      </body>
    </html>
  );
}
