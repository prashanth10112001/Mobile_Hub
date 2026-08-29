// import React from "react";
// import { UseFormReturn } from "react-hook-form";
// import { MobileFormValues } from "@/lib/schemas/mobileSchema";
// import { LookupBrand } from "@/types/mobile";

// interface CoreDetailsProps {
//   form: UseFormReturn<MobileFormValues>;
//   brands: LookupBrand[];
// }

// export function CoreDetailsSection({ form, brands }: CoreDetailsProps) {
//   const {
//     register,
//     setValue,
//     formState: { errors },
//   } = form;

//   // Auto-generate URL slug as the user types the device name
//   const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const name = e.target.value;
//     const generatedSlug = name
//       .toLowerCase()
//       .trim()
//       .replace(/[^\w\s-]/g, "")
//       .replace(/[\s_-]+/g, "-")
//       .replace(/^-+|-+$/g, "");

//     setValue("slug", generatedSlug, { shouldValidate: true });
//   };

//   return (
//     <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg flex flex-col gap-4">
//       <h3 className="text-lg font-semibold text-slate-100 border-b border-slate-800 pb-2">
//         Core Device Information
//       </h3>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {/* Brand Dropdown */}
//         <div>
//           <label className="block text-sm font-medium text-slate-300 mb-1">
//             Brand
//           </label>
//           <select
//             {...register("brandId", { valueAsNumber: true })}
//             className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-200 focus:outline-none focus:border-blue-500"
//           >
//             <option key="default" value={0}>
//               Select Brand...
//             </option>
//             {brands.map((b) => (
//               <option key={b.id} value={b.id}>
//                 {b.name}
//               </option>
//             ))}
//           </select>
//           {errors.brandId && (
//             <p className="text-red-400 text-xs mt-1">
//               {errors.brandId.message}
//             </p>
//           )}
//         </div>

//         {/* Mobile Name */}
//         <div>
//           <label className="block text-sm font-medium text-slate-300 mb-1">
//             Mobile Name
//           </label>
//           <input
//             type="text"
//             {...register("mobileName", {
//               onChange: handleNameChange,
//             })}
//             placeholder="e.g. Galaxy S26 Ultra"
//             className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-200 focus:outline-none focus:border-blue-500"
//           />
//           {errors.mobileName && (
//             <p className="text-red-400 text-xs mt-1">
//               {errors.mobileName.message}
//             </p>
//           )}
//         </div>

//         {/* URL Slug */}
//         <div>
//           <label className="block text-sm font-medium text-slate-300 mb-1">
//             URL Slug
//           </label>
//           <input
//             type="text"
//             {...register("slug")}
//             placeholder="galaxy-s26-ultra"
//             className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-200 focus:outline-none focus:border-blue-500"
//           />
//           {errors.slug && (
//             <p className="text-red-400 text-xs mt-1">{errors.slug.message}</p>
//           )}
//         </div>

//         {/* Launch Date */}
//         <div>
//           <label className="block text-sm font-medium text-slate-300 mb-1">
//             Launch Date
//           </label>
//           <input
//             type="date"
//             {...register("launchDate")}
//             className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-200 focus:outline-none focus:border-blue-500"
//           />
//           {errors.launchDate && (
//             <p className="text-red-400 text-xs mt-1">
//               {errors.launchDate.message}
//             </p>
//           )}
//         </div>

//         {/* Status */}
//         <div>
//           <label className="block text-sm font-medium text-slate-300 mb-1">
//             Status
//           </label>
//           <select
//             {...register("status")}
//             className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-200 focus:outline-none focus:border-blue-500"
//           >
//             <option value="Available">Available</option>
//             <option value="Coming Soon">Coming Soon</option>
//             <option value="Rumored">Rumored</option>
//           </select>
//           {errors.status && (
//             <p className="text-red-400 text-xs mt-1">{errors.status.message}</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { MobileFormValues } from "@/lib/schemas/mobileSchema";
import { LookupBrand } from "@/types/mobile";
import { apiFetch } from "@/lib/api/client";
import { Plus, Loader2, X, CheckCircle2 } from "lucide-react";

interface CoreDetailsProps {
  form: UseFormReturn<MobileFormValues>;
  brands: LookupBrand[];
}

interface CreateBrandResponse {
  brandId?: number;
  id?: number;
  name: string;
  logoUrl?: string;
}

export function CoreDetailsSection({ form, brands }: CoreDetailsProps) {
  const {
    register,
    setValue,
    formState: { errors },
  } = form;

  // Store only dynamically created brands
  const [createdBrands, setCreatedBrands] = useState<LookupBrand[]>([]);

  // Derived state: merges props + newly created brands on render
  const brandList = [...brands, ...createdBrands];

  // Modal & Form state for creating a new brand
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBrandName, setNewBrandName] = useState("");
  const [newBrandLogo, setNewBrandLogo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Auto-generate URL slug as user types mobile name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const generatedSlug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    setValue("slug", generatedSlug, { shouldValidate: true });
  };

  // API Call to create brand using project's apiFetch helper
  const handleCreateBrand = async (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    if (!newBrandName.trim()) return;

    setIsSubmitting(true);
    setApiError(null);
    setSuccessMsg(null);

    try {
      const data = await apiFetch<CreateBrandResponse>("/api/brands", {
        method: "POST",
        body: JSON.stringify({
          name: newBrandName.trim(),
          logoUrl: newBrandLogo.trim(),
        }),
      });

      const createdBrand: LookupBrand = {
        id: data.brandId ?? data.id ?? 0,
        name: data.name,
      };

      setCreatedBrands((prev) => [...prev, createdBrand]);
      setValue("brandId", createdBrand.id, { shouldValidate: true });

      setNewBrandName("");
      setNewBrandLogo("");
      setIsModalOpen(false);
      setSuccessMsg(`Brand "${createdBrand.name}" created and selected!`);

      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Something went wrong while creating brand.";
      setApiError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDownSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCreateBrand();
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <h3 className="text-lg font-semibold text-slate-100">
          Core Device Information
        </h3>
        {successMsg && (
          <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2.5 py-1 rounded">
            <CheckCircle2 className="w-3.5 h-3.5" /> {successMsg}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Brand Selection + Add Brand Button */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-slate-300">
              Brand
            </label>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Brand
            </button>
          </div>

          <select
            {...register("brandId", { valueAsNumber: true })}
            className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option key="default" value={0}>
              Select Brand...
            </option>
            {brandList.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
          {errors.brandId && (
            <p className="text-red-400 text-xs mt-1">
              {errors.brandId.message}
            </p>
          )}
        </div>

        {/* Mobile Name */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Mobile Name
          </label>
          <input
            type="text"
            {...register("mobileName", {
              onChange: handleNameChange,
            })}
            placeholder="e.g. Galaxy S26 Ultra"
            className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-200 focus:outline-none focus:border-blue-500"
          />
          {errors.mobileName && (
            <p className="text-red-400 text-xs mt-1">
              {errors.mobileName.message}
            </p>
          )}
        </div>

        {/* URL Slug */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            URL Slug
          </label>
          <input
            type="text"
            {...register("slug")}
            placeholder="galaxy-s26-ultra"
            className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-200 focus:outline-none focus:border-blue-500"
          />
          {errors.slug && (
            <p className="text-red-400 text-xs mt-1">{errors.slug.message}</p>
          )}
        </div>

        {/* Launch Date */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Launch Date
          </label>
          <input
            type="date"
            {...register("launchDate")}
            className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-200 focus:outline-none focus:border-blue-500"
          />
          {errors.launchDate && (
            <p className="text-red-400 text-xs mt-1">
              {errors.launchDate.message}
            </p>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Status
          </label>
          <select
            {...register("status")}
            className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="Available">Available</option>
            <option value="Coming Soon">Coming Soon</option>
            <option value="Rumored">Rumored</option>
          </select>
          {errors.status && (
            <p className="text-red-400 text-xs mt-1">{errors.status.message}</p>
          )}
        </div>
      </div>

      {/* Add Brand Inline Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-md p-6 space-y-4 shadow-xl relative animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="font-semibold text-slate-100 text-sm">
                Add New Brand
              </h4>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {apiError && (
              <div className="p-3 bg-red-950/80 border border-red-800 rounded text-red-300 text-xs">
                {apiError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Brand Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newBrandName}
                  onChange={(e) => setNewBrandName(e.target.value)}
                  onKeyDown={handleKeyDownSubmit}
                  placeholder="e.g. Redmi"
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Logo URL
                </label>
                <input
                  type="url"
                  value={newBrandLogo}
                  onChange={(e) => setNewBrandLogo(e.target.value)}
                  onKeyDown={handleKeyDownSubmit}
                  placeholder="https://example.com/logo.png"
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 rounded border border-slate-800 hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateBrand}
                  disabled={isSubmitting || !newBrandName.trim()}
                  className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-medium text-xs px-4 py-1.5 rounded transition-colors cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
                    </>
                  ) : (
                    "Save Brand"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
