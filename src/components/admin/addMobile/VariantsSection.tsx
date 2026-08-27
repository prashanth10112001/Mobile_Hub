import React from "react";
import { UseFormReturn, useFieldArray, Control } from "react-hook-form";
import { Plus, Trash2, Store } from "lucide-react";
import { MobileFormValues } from "@/lib/schemas/mobileSchema";
import { LookupStore } from "@/types/mobile";

interface VariantsSectionProps {
  form: UseFormReturn<MobileFormValues>;
  stores: LookupStore[];
}

// Sub-component to manage nested store availability rows per variant
function StoreAvailabilityRows({
  variantIndex,
  control,
  register,
  errors,
  stores,
}: {
  variantIndex: number;
  control: Control<MobileFormValues>;
  register: UseFormReturn<MobileFormValues>["register"];
  errors: UseFormReturn<MobileFormValues>["formState"]["errors"];
  stores: LookupStore[];
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `variants.${variantIndex}.availability`,
  });

  const variantErrors = errors.variants?.[variantIndex]?.availability;

  return (
    <div className="mt-4 flex flex-col gap-3 pl-4 border-l-2 border-slate-700">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Store className="w-3.5 h-3.5 text-blue-400" /> Store Availability &
          Pricing
        </label>
        <button
          type="button"
          onClick={() =>
            append({
              storeId: 0,
              price: 0,
              stockStatus: "IN_STOCK",
              productUrl: "",
            })
          }
          className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded transition-colors"
        >
          + Add Store
        </button>
      </div>

      {variantErrors?.root && (
        <p className="text-red-400 text-xs">{variantErrors.root.message}</p>
      )}

      {fields.map((field, storeIndex) => (
        <div
          key={field.id}
          className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-start bg-slate-900 p-2.5 rounded border border-slate-800"
        >
          {/* Store Selector */}
          <div>
            <select
              {...register(
                `variants.${variantIndex}.availability.${storeIndex}.storeId`,
                {
                  valueAsNumber: true,
                },
              )}
              className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value={0}>Select Store...</option>
              {stores.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div>
            <input
              type="number"
              step="0.01"
              {...register(
                `variants.${variantIndex}.availability.${storeIndex}.price`,
                {
                  valueAsNumber: true,
                },
              )}
              placeholder="Price ($)"
              className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Stock Status */}
          <div>
            <select
              {...register(
                `variants.${variantIndex}.availability.${storeIndex}.stockStatus`,
              )}
              className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="IN_STOCK">In Stock</option>
              <option value="OUT_OF_STOCK">Out of Stock</option>
              <option value="PRE_ORDER">Pre-Order</option>
            </select>
          </div>

          {/* URL & Remove Button */}
          <div className="flex items-center gap-1">
            <input
              type="url"
              {...register(
                `variants.${variantIndex}.availability.${storeIndex}.productUrl`,
              )}
              placeholder="https://..."
              className="flex-1 bg-slate-950 border border-slate-700 rounded p-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            />
            <button
              type="button"
              onClick={() => remove(storeIndex)}
              className="p-1.5 text-slate-400 hover:text-red-400"
              title="Remove Store"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export function VariantsSection({ form, stores }: VariantsSectionProps) {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <h3 className="text-lg font-semibold text-slate-100">
          RAM & Storage Variants
        </h3>
        <button
          type="button"
          onClick={() =>
            append({
              ramGb: 8,
              storageGb: 128,
              availability: [],
            })
          }
          className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white text-sm px-3 py-1.5 rounded transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Variant
        </button>
      </div>

      {errors.variants?.root && (
        <p className="text-red-400 text-xs">{errors.variants.root.message}</p>
      )}

      {fields.length === 0 ? (
        <p className="text-slate-500 text-sm italic">
          No RAM/Storage variants added yet.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {fields.map((field, variantIndex) => (
            <div
              key={field.id}
              className="bg-slate-950 p-4 rounded border border-slate-800"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="grid grid-cols-2 gap-4 flex-1">
                  {/* RAM GB */}
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      RAM (GB)
                    </label>
                    <input
                      type="number"
                      {...register(`variants.${variantIndex}.ramGb`, {
                        valueAsNumber: true,
                      })}
                      placeholder="8"
                      className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                    />
                    {errors.variants?.[variantIndex]?.ramGb && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.variants[variantIndex]?.ramGb?.message}
                      </p>
                    )}
                  </div>

                  {/* Storage GB */}
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Storage (GB)
                    </label>
                    <input
                      type="number"
                      {...register(`variants.${variantIndex}.storageGb`, {
                        valueAsNumber: true,
                      })}
                      placeholder="256"
                      className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                    />
                    {errors.variants?.[variantIndex]?.storageGb && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.variants[variantIndex]?.storageGb?.message}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => remove(variantIndex)}
                  className="mt-5 p-2 text-slate-400 hover:text-red-400 transition-colors"
                  title="Remove Variant"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              {/* Nested Store Availability list */}
              <StoreAvailabilityRows
                variantIndex={variantIndex}
                control={control}
                register={register}
                errors={errors}
                stores={stores}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
