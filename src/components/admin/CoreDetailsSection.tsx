import React from "react";
import { UseFormReturn } from "react-hook-form";
import { MobileFormValues } from "@/lib/schemas/mobileSchema";
import { LookupBrand } from "@/types/mobile";

interface CoreDetailsProps {
  form: UseFormReturn<MobileFormValues>;
  brands: LookupBrand[];
}

export function CoreDetailsSection({ form, brands }: CoreDetailsProps) {
  const {
    register,
    setValue,
    formState: { errors },
  } = form;

  // Auto-generate URL slug as the user types the device name
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

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg flex flex-col gap-4">
      <h3 className="text-lg font-semibold text-slate-100 border-b border-slate-800 pb-2">
        Core Device Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Brand Dropdown */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Brand
          </label>
          <select
            {...register("brandId", { valueAsNumber: true })}
            className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option key="default" value={0}>
              Select Brand...
            </option>
            {brands.map((b) => (
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
    </div>
  );
}
