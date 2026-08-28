"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
} from "lucide-react";
import { MobileCatalogItem } from "@/types/mobile";
import { MobileCard } from "@/components/admin/mobiles/MobileCard";

const MOCK_DEVICES: MobileCatalogItem[] = [
  {
    id: "1",
    name: "Samsung Galaxy S24 Ultra",
    brand: "Samsung",
    price: "$1,299",
    image: "",
    status: "Published",
  },
  {
    id: "2",
    name: "iPhone 17 Pro",
    brand: "Apple",
    price: "$1,099",
    image: "",
    status: "Published",
  },
  {
    id: "3",
    name: "Nokia 6G Concept",
    brand: "Nokia",
    price: "$699",
    image: "",
    status: "Draft",
  },
  {
    id: "4",
    name: "OnePlus 13R",
    brand: "OnePlus",
    price: "$599",
    image: "",
    status: "Published",
  },
  {
    id: "5",
    name: "Vivo Z1 Pro",
    brand: "Vivo",
    price: "$349",
    image: "",
    status: "Published",
  },
  {
    id: "6",
    name: "Oppo Reno 12 Pro",
    brand: "Oppo",
    price: "$499",
    image: "",
    status: "Published",
  },
  {
    id: "7",
    name: "Motorola Edge 50",
    brand: "Motorola",
    price: "$549",
    image: "",
    status: "Published",
  },
];

const QUICK_BRANDS = [
  "All",
  "OnePlus",
  "Apple",
  "Samsung",
  "Vivo",
  "Oppo",
  "Nokia",
];

export default function MobileCatalogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Filter Logic
  const filteredDevices = MOCK_DEVICES.filter((device) => {
    const matchesSearch =
      device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBrand =
      selectedBrand === "All" ||
      device.brand.toLowerCase() === selectedBrand.toLowerCase();
    return matchesSearch && matchesBrand;
  });

  return (
    <div className="p-8 flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Mobiles Catalog
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage your mobile devices, specification sheets, and pricing
            variants.
          </p>
        </div>

        <Link
          href="/admin/mobiles/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Mobile
        </Link>
      </div>

      {/* Search Bar & Actions */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search here anything as samsung, asus..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            type="button"
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            Filter
          </button>

          {/* View Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === "grid"
                  ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
              }`}
              aria-label="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === "table"
                  ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
              }`}
              aria-label="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Brand Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {QUICK_BRANDS.map((brand) => (
          <button
            key={brand}
            onClick={() => setSelectedBrand(brand)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              selectedBrand.toLowerCase() === brand.toLowerCase()
                ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold"
                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            {brand}
          </button>
        ))}
      </div>

      {/* Grid View */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredDevices.map((device) => (
            <MobileCard key={device.id} device={device} />
          ))}
        </div>
      ) : (
        /* Table View Placeholder */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden p-8 text-center text-slate-500 text-sm">
          Compact Table View enabled for quick data scanning.
        </div>
      )}
    </div>
  );
}
