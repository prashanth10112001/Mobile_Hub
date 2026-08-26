import React from "react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { MobileFormValues } from "@/lib/schemas/mobileSchema";
import { LookupSpecDefinition } from "@/types/mobile";

interface SpecsSectionProps {
  form: UseFormReturn<MobileFormValues>;
  specDefinitions: LookupSpecDefinition[];
}

export function SpecsSection({ form, specDefinitions }: SpecsSectionProps) {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "specifications",
  });

  // Group specification options by their category (e.g., Display, Camera, Battery)
  const groupedSpecs = specDefinitions.reduce<
    Record<string, LookupSpecDefinition[]>
  >((acc, item) => {
    const category = item.categoryName || "General";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <h3 className="text-lg font-semibold text-slate-100">
          Technical Specifications
        </h3>
        <button
          type="button"
          onClick={() => append({ specDefinitionId: 0, specValue: "" })}
          className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white text-sm px-3 py-1.5 rounded transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Specification
        </button>
      </div>

      {errors.specifications?.root && (
        <p className="text-red-400 text-xs">
          {errors.specifications.root.message}
        </p>
      )}

      {fields.length === 0 ? (
        <p className="text-slate-500 text-sm italic">
          No specifications added yet. Click above to add one.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex items-start gap-3 bg-slate-950 p-3 rounded border border-slate-800"
            >
              {/* Spec Definition Dropdown */}
              <div className="flex-1">
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Spec Type
                </label>
                <select
                  {...register(`specifications.${index}.specDefinitionId`, {
                    valueAsNumber: true,
                  })}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                >
                  <option key="default" value={0}>
                    Select Specification Key...
                  </option>
                  {Object.entries(groupedSpecs).map(([category, specs]) => (
                    <optgroup key={category} label={category}>
                      {specs.map((spec) => (
                        <option key={spec.id} value={spec.id}>
                          {spec.name}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                {errors.specifications?.[index]?.specDefinitionId && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.specifications[index]?.specDefinitionId?.message}
                  </p>
                )}
              </div>

              {/* Spec Value Input */}
              <div className="flex-1">
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Value
                </label>
                <input
                  type="text"
                  {...register(`specifications.${index}.specValue`)}
                  placeholder="e.g. 6.8 inches, 120Hz LTPO OLED"
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                />
                {errors.specifications?.[index]?.specValue && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.specifications[index]?.specValue?.message}
                  </p>
                )}
              </div>

              {/* Delete Spec Row */}
              <button
                type="button"
                onClick={() => remove(index)}
                className="mt-6 p-2 text-slate-400 hover:text-red-400 rounded transition-colors"
                title="Remove Specification"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
