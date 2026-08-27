// "use client";

// import React, { useEffect, useState } from "react";
// import { useTheme } from "next-themes";
// import { Sun, Moon } from "lucide-react";

// export function ThemeToggle() {
//   const { theme, setTheme } = useTheme();
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   if (!mounted) {
//     return <div className="w-8 h-8" />;
//   }

//   const isDark = theme === "dark";

//   return (
//     <button
//       onClick={() => setTheme(isDark ? "light" : "dark")}
//       className="p-2 rounded-md bg-slate-800 hover:bg-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center justify-center cursor-pointer"
//       title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
//       aria-label="Toggle Theme"
//     >
//       {isDark ? (
//         <Sun className="w-4 h-4 text-amber-400" />
//       ) : (
//         <Moon className="w-4 h-4 text-slate-100" />
//       )}
//     </button>
//   );
// }

"use client";

import React, { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

// No-op subscribe function for static hydration check
const emptySubscribe = () => () => {};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  // Safely checks if component is mounted on the client without useEffect/setState
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true, // Client snapshot
    () => false, // Server snapshot
  );

  if (!mounted) {
    return <div className="w-8 h-8" />;
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="p-2 rounded-md bg-slate-800 hover:bg-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center justify-center cursor-pointer"
      title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
      aria-label="Toggle Theme"
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400" />
      ) : (
        <Moon className="w-4 h-4 text-slate-100" />
      )}
    </button>
  );
}
