import React from "react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { Plus, Trash2, Image as ImageIcon, Star } from "lucide-react";
import { MobileFormValues } from "@/lib/schemas/mobileSchema";

interface ImagesSectionProps {
  form: UseFormReturn<MobileFormValues>;
}

export function ImagesSection({ form }: ImagesSectionProps) {
  const {
    register,
    control,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "images",
  });

  const images = watch("images");

  // Enforces that only one image is marked as primary thumbnail at a time
  const handleSetPrimary = (selectedIndex: number) => {
    images.forEach((_, index) => {
      setValue(`images.${index}.isPrimary`, index === selectedIndex, {
        shouldValidate: true,
      });
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-blue-400" /> Device Gallery Images
        </h3>
        <button
          type="button"
          onClick={() =>
            append({
              imageUrl: "",
              imageType: "FRONT",
              isPrimary: fields.length === 0, // Automatically primary if it's the first image
              displayOrder: fields.length,
            })
          }
          className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white text-sm px-3 py-1.5 rounded transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Image URL
        </button>
      </div>

      {errors.images?.root && (
        <p className="text-red-400 text-xs">{errors.images.root.message}</p>
      )}

      {fields.length === 0 ? (
        <p className="text-slate-500 text-sm italic">
          No images added yet. Click above to add photo URLs.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center bg-slate-950 p-3 rounded border border-slate-800"
            >
              {/* Image URL */}
              <div className="md:col-span-5">
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  {...register(`images.${index}.imageUrl`)}
                  placeholder="https://images.example.com/phone.jpg"
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                />
                {errors.images?.[index]?.imageUrl && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.images[index]?.imageUrl?.message}
                  </p>
                )}
              </div>

              {/* Image Type */}
              <div className="md:col-span-3">
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Angle / View
                </label>
                <select
                  {...register(`images.${index}.imageType`)}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="FRONT">Front View</option>
                  <option value="BACK">Back View</option>
                  <option value="SIDE">Side Profile</option>
                </select>
              </div>

              {/* Display Order */}
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Order
                </label>
                <input
                  type="number"
                  {...register(`images.${index}.displayOrder`, {
                    valueAsNumber: true,
                  })}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Primary Star Toggle & Remove Button */}
              <div className="md:col-span-2 flex items-center justify-end gap-2 mt-4 md:mt-0">
                <button
                  type="button"
                  onClick={() => handleSetPrimary(index)}
                  className={`flex items-center gap-1 text-xs px-2.5 py-2 rounded border transition-colors ${
                    images[index]?.isPrimary
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/50"
                      : "bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-200"
                  }`}
                  title="Set as Primary Thumbnail"
                >
                  <Star
                    className={`w-3.5 h-3.5 ${
                      images[index]?.isPrimary
                        ? "fill-amber-400 text-amber-400"
                        : ""
                    }`}
                  />
                  {images[index]?.isPrimary ? "Primary" : "Set Primary"}
                </button>

                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                  title="Remove Image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
