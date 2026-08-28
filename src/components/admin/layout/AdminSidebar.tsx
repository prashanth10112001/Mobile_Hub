"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Smartphone,
  HomeIcon,
  Users,
  Layers,
  ChevronDown,
  Laptop,
  Headphones,
  Watch,
  Tv,
  LogOut,
} from "lucide-react";

interface SubNavItem {
  label: string;
  href: string;
  icon?: React.ElementType;
}

interface NavItem {
  label: string;
  href?: string;
  icon: React.ElementType;
  subItems?: SubNavItem[];
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Home",
    href: "/admin",
    icon: HomeIcon,
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    label: "Categories",
    href: "/admin/categories",
    icon: Layers,
    subItems: [
      { label: "Mobiles", href: "/admin/mobiles", icon: Smartphone },
      { label: "Laptops", href: "/admin/laptops", icon: Laptop },
      { label: "Earphones", href: "/admin/earphones", icon: Headphones },
      { label: "Smartwatches", href: "/admin/smartwatches", icon: Watch },
      { label: "TVs & Home", href: "/admin/tvs", icon: Tv },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(true);

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between h-screen sticky top-0 transition-colors">
      <div className="p-4 flex flex-col gap-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-2 px-2">
          <Smartphone className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Tech Hub
          </h2>
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-500 dark:text-blue-400">
            Admin
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;

            if (item.subItems) {
              const isChildActive =
                pathname === item.href ||
                item.subItems.some((sub) => pathname === sub.href);

              return (
                <div key={item.label} className="flex flex-col">
                  {/* Parent navigation + dropdown control */}
                  <div
                    className={`flex items-center w-full rounded-md transition-colors ${
                      pathname === item.href
                        ? "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-semibold"
                        : isChildActive
                          ? "text-blue-600 dark:text-blue-400 font-semibold"
                          : "text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    <Link
                      href={item.href || "#"}
                      className="flex items-center gap-3 flex-1 px-3 py-2 rounded-l-md text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                    >
                      <Icon className="w-4 h-4 text-slate-400" />
                      <span>{item.label}</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                      className="px-3 py-2 rounded-r-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                      aria-label={
                        isCategoriesOpen
                          ? "Collapse categories"
                          : "Expand categories"
                      }
                    >
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                          isCategoriesOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {/* Sub-menu */}
                  {isCategoriesOpen && (
                    <div className="ml-4 pl-3 mt-1 border-l border-slate-200 dark:border-slate-800 flex flex-col gap-1">
                      {item.subItems.map((sub) => {
                        const SubIcon = sub.icon;
                        const isActive = pathname === sub.href;

                        return (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className={`flex items-center gap-2.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                              isActive
                                ? "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-semibold"
                                : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
                            }`}
                          >
                            {SubIcon && <SubIcon className="w-3.5 h-3.5" />}
                            {sub.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            const isActive = pathname === item.href;

            return (
              <Link
                key={item.label}
                href={item.href || "#"}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-semibold"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4 text-slate-400" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout Action at Sidebar Bottom */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={() => {
            /* TODO: Add auth logout handler later */
          }}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm font-medium text-rose-600 dark:text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-750/40 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
