"use client";

import React from "react";
import Link from "next/link";
import { Edit3, Trash2, Smartphone, ArrowRightLeft } from "lucide-react";
import { MobileCatalogItem } from "@/types/mobile";

interface MobileCardProps {
  device: MobileCatalogItem;
  onDelete?: (id: string) => void;
}

export function MobileCard({ device, onDelete }: MobileCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-sm flex flex-col justify-between group">
      {/* Top Media & Badge Container */}
      <div className="p-4 relative bg-slate-50 dark:bg-slate-950/40 flex flex-col items-center justify-center h-48 border-b border-slate-100 dark:border-slate-800/60">
        {/* Compare / Quick Status Indicator */}
        <button
          type="button"
          title="Compare Specs"
          className="absolute top-3 right-3 p-1.5 rounded-md bg-white dark:bg-slate-800 text-slate-400 hover:text-blue-500 border border-slate-200 dark:border-slate-700 text-xs flex items-center gap-1 shadow-xs cursor-pointer"
        >
          <ArrowRightLeft className="w-3.5 h-3.5" />
          <span className="text-[10px] font-medium hidden sm:inline">
            Compare
          </span>
        </button>

        {/* Brand Tag */}
        <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-semibold">
          {device.brand}
        </span>

        {/* Device Image Placeholder */}
        <div className="w-24 h-28 flex items-center justify-center text-slate-400 group-hover:scale-105 transition-transform duration-200">
          <Smartphone className="w-16 h-16 stroke-1 text-slate-400 dark:text-slate-500" />
        </div>
      </div>

      {/* Content & Metadata */}
      <div className="p-4 flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm truncate">
            {device.name}
          </h3>
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
            {device.price}
          </span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="grid grid-cols-2 border-t border-slate-200 dark:border-slate-800 divide-x divide-slate-200 dark:divide-slate-800">
        <Link
          href={`/admin/mobiles/edit/${device.id}`}
          className="py-2.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5 transition-colors"
        >
          <Edit3 className="w-3.5 h-3.5 text-slate-400" />
          Edit
        </Link>
        <button
          type="button"
          onClick={() => onDelete?.(device.id)}
          className="py-2.5 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete
        </button>
      </div>
    </div>
  );
}
