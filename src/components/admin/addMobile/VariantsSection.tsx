// import React from "react";
// import { UseFormReturn, useFieldArray, Control } from "react-hook-form";
// import { Plus, Trash2, Store } from "lucide-react";
// import { MobileFormValues } from "@/lib/schemas/mobileSchema";
// import { LookupStore } from "@/types/mobile";

// interface VariantsSectionProps {
//   form: UseFormReturn<MobileFormValues>;
//   stores: LookupStore[];
// }

// // Sub-component to manage nested store availability rows per variant
// function StoreAvailabilityRows({
//   variantIndex,
//   control,
//   register,
//   errors,
//   stores,
// }: {
//   variantIndex: number;
//   control: Control<MobileFormValues>;
//   register: UseFormReturn<MobileFormValues>["register"];
//   errors: UseFormReturn<MobileFormValues>["formState"]["errors"];
//   stores: LookupStore[];
// }) {
//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: `variants.${variantIndex}.availability`,
//   });

//   const variantErrors = errors.variants?.[variantIndex]?.availability;

//   return (
//     <div className="mt-4 flex flex-col gap-3 pl-4 border-l-2 border-slate-700">
//       <div className="flex items-center justify-between">
//         <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
//           <Store className="w-3.5 h-3.5 text-blue-400" /> Store Availability &
//           Pricing
//         </label>
//         <button
//           type="button"
//           onClick={() =>
//             append({
//               storeId: 0,
//               price: 0,
//               stockStatus: "IN_STOCK",
//               productUrl: "",
//             })
//           }
//           className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded transition-colors"
//         >
//           + Add Store
//         </button>
//       </div>

//       {variantErrors?.root && (
//         <p className="text-red-400 text-xs">{variantErrors.root.message}</p>
//       )}

//       {fields.map((field, storeIndex) => (
//         <div
//           key={field.id}
//           className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-start bg-slate-900 p-2.5 rounded border border-slate-800"
//         >
//           {/* Store Selector */}
//           <div>
//             <select
//               {...register(
//                 `variants.${variantIndex}.availability.${storeIndex}.storeId`,
//                 {
//                   valueAsNumber: true,
//                 },
//               )}
//               className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
//             >
//               <option value={0}>Select Store...</option>
//               {stores.map((s) => (
//                 <option key={s.id} value={s.id}>
//                   {s.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Price */}
//           <div>
//             <input
//               type="number"
//               step="0.01"
//               {...register(
//                 `variants.${variantIndex}.availability.${storeIndex}.price`,
//                 {
//                   valueAsNumber: true,
//                 },
//               )}
//               placeholder="Price ($)"
//               className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
//             />
//           </div>

//           {/* Stock Status */}
//           <div>
//             <select
//               {...register(
//                 `variants.${variantIndex}.availability.${storeIndex}.stockStatus`,
//               )}
//               className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
//             >
//               <option value="IN_STOCK">In Stock</option>
//               <option value="OUT_OF_STOCK">Out of Stock</option>
//               <option value="PRE_ORDER">Pre-Order</option>
//             </select>
//           </div>

//           {/* URL & Remove Button */}
//           <div className="flex items-center gap-1">
//             <input
//               type="url"
//               {...register(
//                 `variants.${variantIndex}.availability.${storeIndex}.productUrl`,
//               )}
//               placeholder="https://..."
//               className="flex-1 bg-slate-950 border border-slate-700 rounded p-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
//             />
//             <button
//               type="button"
//               onClick={() => remove(storeIndex)}
//               className="p-1.5 text-slate-400 hover:text-red-400"
//               title="Remove Store"
//             >
//               <Trash2 className="w-3.5 h-3.5" />
//             </button>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// export function VariantsSection({ form, stores }: VariantsSectionProps) {
//   const {
//     register,
//     control,
//     formState: { errors },
//   } = form;

//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: "variants",
//   });

//   return (
//     <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg flex flex-col gap-4">
//       <div className="flex items-center justify-between border-b border-slate-800 pb-2">
//         <h3 className="text-lg font-semibold text-slate-100">
//           RAM & Storage Variants
//         </h3>
//         <button
//           type="button"
//           onClick={() =>
//             append({
//               ramGb: 8,
//               storageGb: 128,
//               availability: [],
//             })
//           }
//           className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white text-sm px-3 py-1.5 rounded transition-colors"
//         >
//           <Plus className="w-4 h-4" /> Add Variant
//         </button>
//       </div>

//       {errors.variants?.root && (
//         <p className="text-red-400 text-xs">{errors.variants.root.message}</p>
//       )}

//       {fields.length === 0 ? (
//         <p className="text-slate-500 text-sm italic">
//           No RAM/Storage variants added yet.
//         </p>
//       ) : (
//         <div className="flex flex-col gap-4">
//           {fields.map((field, variantIndex) => (
//             <div
//               key={field.id}
//               className="bg-slate-950 p-4 rounded border border-slate-800"
//             >
//               <div className="flex items-center justify-between gap-4">
//                 <div className="grid grid-cols-2 gap-4 flex-1">
//                   {/* RAM GB */}
//                   <div>
//                     <label className="block text-xs font-medium text-slate-400 mb-1">
//                       RAM (GB)
//                     </label>
//                     <input
//                       type="number"
//                       {...register(`variants.${variantIndex}.ramGb`, {
//                         valueAsNumber: true,
//                       })}
//                       placeholder="8"
//                       className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
//                     />
//                     {errors.variants?.[variantIndex]?.ramGb && (
//                       <p className="text-red-400 text-xs mt-1">
//                         {errors.variants[variantIndex]?.ramGb?.message}
//                       </p>
//                     )}
//                   </div>

//                   {/* Storage GB */}
//                   <div>
//                     <label className="block text-xs font-medium text-slate-400 mb-1">
//                       Storage (GB)
//                     </label>
//                     <input
//                       type="number"
//                       {...register(`variants.${variantIndex}.storageGb`, {
//                         valueAsNumber: true,
//                       })}
//                       placeholder="256"
//                       className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
//                     />
//                     {errors.variants?.[variantIndex]?.storageGb && (
//                       <p className="text-red-400 text-xs mt-1">
//                         {errors.variants[variantIndex]?.storageGb?.message}
//                       </p>
//                     )}
//                   </div>
//                 </div>

//                 <button
//                   type="button"
//                   onClick={() => remove(variantIndex)}
//                   className="mt-5 p-2 text-slate-400 hover:text-red-400 transition-colors"
//                   title="Remove Variant"
//                 >
//                   <Trash2 className="w-5 h-5" />
//                 </button>
//               </div>

//               {/* Nested Store Availability list */}
//               <StoreAvailabilityRows
//                 variantIndex={variantIndex}
//                 control={control}
//                 register={register}
//                 errors={errors}
//                 stores={stores}
//               />
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import React, { useState } from "react";
import { UseFormReturn, useFieldArray, Control } from "react-hook-form";
import { Plus, Trash2, Store, Loader2, X, CheckCircle2 } from "lucide-react";
import { MobileFormValues } from "@/lib/schemas/mobileSchema";
import { LookupStore } from "@/types/mobile";
import { apiFetch } from "@/lib/api/client";

interface VariantsSectionProps {
  form: UseFormReturn<MobileFormValues>;
  stores: LookupStore[];
}

interface CreateStoreResponse {
  storeId?: number;
  id?: number;
  storeName?: string;
  name?: string;
  websiteUrl?: string;
  logoUrl?: string;
}

// Sub-component to manage nested store availability rows per variant
function StoreAvailabilityRows({
  variantIndex,
  control,
  register,
  errors,
  stores,
  onOpenStoreModal,
}: {
  variantIndex: number;
  control: Control<MobileFormValues>;
  register: UseFormReturn<MobileFormValues>["register"];
  errors: UseFormReturn<MobileFormValues>["formState"]["errors"];
  stores: LookupStore[];
  onOpenStoreModal: (variantIndex: number, storeIndex: number) => void;
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
          className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded transition-colors cursor-pointer"
        >
          + Add Store Row
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
          {/* Store Selector + Create Store Link */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] text-slate-400 uppercase font-medium">
                Store
              </label>
              <button
                type="button"
                onClick={() => onOpenStoreModal(variantIndex, storeIndex)}
                className="text-[10px] text-blue-400 hover:text-blue-300 transition-colors cursor-pointer font-medium"
              >
                + New Store
              </button>
            </div>
            <select
              {...register(
                `variants.${variantIndex}.availability.${storeIndex}.storeId`,
                { valueAsNumber: true },
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
            <label className="text-[10px] text-slate-400 uppercase font-medium block mb-1">
              Price ($)
            </label>
            <input
              type="number"
              step="0.01"
              {...register(
                `variants.${variantIndex}.availability.${storeIndex}.price`,
                { valueAsNumber: true },
              )}
              placeholder="0.00"
              className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Stock Status */}
          <div>
            <label className="text-[10px] text-slate-400 uppercase font-medium block mb-1">
              Stock Status
            </label>
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

          {/* Product URL & Remove Button */}
          <div>
            <label className="text-[10px] text-slate-400 uppercase font-medium block mb-1">
              Product Link
            </label>
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
                className="p-1.5 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                title="Remove Store Row"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
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
    setValue,
    formState: { errors },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  // Track dynamically created stores locally
  const [createdStores, setCreatedStores] = useState<LookupStore[]>([]);

  // Derived state: merges store props + newly created stores
  const storeList = [...stores, ...createdStores];

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetRow, setTargetRow] = useState<{
    variantIndex: number;
    storeIndex: number;
  } | null>(null);

  const [storeName, setStoreName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Open modal and record which row triggered it
  const handleOpenModal = (variantIndex?: number, storeIndex?: number) => {
    if (variantIndex !== undefined && storeIndex !== undefined) {
      setTargetRow({ variantIndex, storeIndex });
    } else {
      setTargetRow(null);
    }
    setApiError(null);
    setIsModalOpen(true);
  };

  // API Call to create store via apiFetch
  const handleCreateStore = async (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    if (!storeName.trim()) return;

    setIsSubmitting(true);
    setApiError(null);
    setSuccessMsg(null);

    try {
      const data = await apiFetch<CreateStoreResponse>("/api/stores", {
        method: "POST",
        body: JSON.stringify({
          storeName: storeName.trim(),
          websiteUrl: websiteUrl.trim(),
          logoUrl: logoUrl.trim(),
        }),
      });

      const newStore: LookupStore = {
        id: data.storeId ?? data.id ?? 0,
        name: data.storeName ?? data.name ?? storeName.trim(),
      };

      // Append new store to state
      setCreatedStores((prev) => [...prev, newStore]);

      // If triggered from a specific store dropdown, auto-select it
      if (targetRow) {
        setValue(
          `variants.${targetRow.variantIndex}.availability.${targetRow.storeIndex}.storeId`,
          newStore.id,
          { shouldValidate: true },
        );
      }

      // Reset Modal Form
      setStoreName("");
      setWebsiteUrl("");
      setLogoUrl("");
      setIsModalOpen(false);
      setSuccessMsg(`Store "${newStore.name}" created successfully!`);

      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Something went wrong while creating the store.";
      setApiError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDownSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCreateStore();
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-slate-100">
            RAM & Storage Variants
          </h3>
          {successMsg && (
            <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2.5 py-1 rounded">
              <CheckCircle2 className="w-3.5 h-3.5" /> {successMsg}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleOpenModal()}
            className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-medium px-2 py-1 rounded transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add New Store
          </button>
          <button
            type="button"
            onClick={() =>
              append({
                ramGb: 8,
                storageGb: 128,
                availability: [],
              })
            }
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white text-sm px-3 py-1.5 rounded transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Variant
          </button>
        </div>
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
                  className="mt-5 p-2 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
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
                stores={storeList}
                onOpenStoreModal={handleOpenModal}
              />
            </div>
          ))}
        </div>
      )}

      {/* Add Store Inline Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-md p-6 space-y-4 shadow-xl relative animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="font-semibold text-slate-100 text-sm">
                Add New Store
              </h4>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 p-1 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {apiError && (
              <div className="p-3 bg-red-950/80 border border-red-800 rounded text-red-300 text-xs">
                {apiError}
              </div>
            )}

            {/* Container <div> to prevent nested HTML forms */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Store Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  onKeyDown={handleKeyDownSubmit}
                  placeholder="e.g. Myntra"
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Website URL
                </label>
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  onKeyDown={handleKeyDownSubmit}
                  placeholder="https://www.myntra.in"
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Logo URL
                </label>
                <input
                  type="url"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
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
                  onClick={handleCreateStore}
                  disabled={isSubmitting || !storeName.trim()}
                  className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-medium text-xs px-4 py-1.5 rounded transition-colors cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
                    </>
                  ) : (
                    "Save Store"
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
