// import React from "react";
// import { UseFormReturn, useFieldArray } from "react-hook-form";
// import { Plus, Trash2 } from "lucide-react";
// import { MobileFormValues } from "@/lib/schemas/mobileSchema";
// import { LookupSpecDefinition } from "@/types/mobile";

// interface SpecsSectionProps {
//   form: UseFormReturn<MobileFormValues>;
//   specDefinitions: LookupSpecDefinition[];
// }

// export function SpecsSection({ form, specDefinitions }: SpecsSectionProps) {
//   const {
//     register,
//     control,
//     formState: { errors },
//   } = form;

//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: "specifications",
//   });

//   // Group specification options by their category (e.g., Display, Camera, Battery)
//   const groupedSpecs = specDefinitions.reduce<
//     Record<string, LookupSpecDefinition[]>
//   >((acc, item) => {
//     const category = item.categoryName || "General";
//     if (!acc[category]) {
//       acc[category] = [];
//     }
//     acc[category].push(item);
//     return acc;
//   }, {});

//   return (
//     <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg flex flex-col gap-4">
//       <div className="flex items-center justify-between border-b border-slate-800 pb-2">
//         <h3 className="text-lg font-semibold text-slate-100">
//           Technical Specifications
//         </h3>
//         <button
//           type="button"
//           onClick={() => append({ specDefinitionId: 0, specValue: "" })}
//           className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white text-sm px-3 py-1.5 rounded transition-colors"
//         >
//           <Plus className="w-4 h-4" /> Add Specification
//         </button>
//       </div>

//       {errors.specifications?.root && (
//         <p className="text-red-400 text-xs">
//           {errors.specifications.root.message}
//         </p>
//       )}

//       {fields.length === 0 ? (
//         <p className="text-slate-500 text-sm italic">
//           No specifications added yet. Click above to add one.
//         </p>
//       ) : (
//         <div className="flex flex-col gap-3">
//           {fields.map((field, index) => (
//             <div
//               key={field.id}
//               className="flex items-start gap-3 bg-slate-950 p-3 rounded border border-slate-800"
//             >
//               {/* Spec Definition Dropdown */}
//               <div className="flex-1">
//                 <label className="block text-xs font-medium text-slate-400 mb-1">
//                   Spec Type
//                 </label>
//                 <select
//                   {...register(`specifications.${index}.specDefinitionId`, {
//                     valueAsNumber: true,
//                   })}
//                   className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
//                 >
//                   <option key="default" value={0}>
//                     Select Specification Key...
//                   </option>
//                   {Object.entries(groupedSpecs).map(([category, specs]) => (
//                     <optgroup key={category} label={category}>
//                       {specs.map((spec) => (
//                         <option key={spec.id} value={spec.id}>
//                           {spec.name}
//                         </option>
//                       ))}
//                     </optgroup>
//                   ))}
//                 </select>
//                 {errors.specifications?.[index]?.specDefinitionId && (
//                   <p className="text-red-400 text-xs mt-1">
//                     {errors.specifications[index]?.specDefinitionId?.message}
//                   </p>
//                 )}
//               </div>

//               {/* Spec Value Input */}
//               <div className="flex-1">
//                 <label className="block text-xs font-medium text-slate-400 mb-1">
//                   Value
//                 </label>
//                 <input
//                   type="text"
//                   {...register(`specifications.${index}.specValue`)}
//                   placeholder="e.g. 6.8 inches, 120Hz LTPO OLED"
//                   className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
//                 />
//                 {errors.specifications?.[index]?.specValue && (
//                   <p className="text-red-400 text-xs mt-1">
//                     {errors.specifications[index]?.specValue?.message}
//                   </p>
//                 )}
//               </div>

//               {/* Delete Spec Row */}
//               <button
//                 type="button"
//                 onClick={() => remove(index)}
//                 className="mt-6 p-2 text-slate-400 hover:text-red-400 rounded transition-colors"
//                 title="Remove Specification"
//               >
//                 <Trash2 className="w-4 h-4" />
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// "use client";

// import React, { useState, useMemo } from "react";
// import { UseFormReturn } from "react-hook-form";
// import {
//   Search,
//   ChevronDown,
//   ChevronUp,
//   CheckCircle2,
//   Plus,
//   FolderPlus,
//   X,
//   Loader2,
// } from "lucide-react";
// import { MobileFormValues } from "@/lib/schemas/mobileSchema";
// import { LookupSpecDefinition } from "@/types/mobile";
// import { apiFetch } from "@/lib/api/client";

// interface SpecsSectionProps {
//   form: UseFormReturn<MobileFormValues>;
//   specDefinitions: LookupSpecDefinition[];
// }

// interface SpecCategoryApiResponse {
//   categoryId: number;
//   categoryName: string;
//   displayOrder: number;
// }

// interface SpecDefinitionApiResponse {
//   specDefinitionId: number;
//   category: {
//     categoryId: number;
//     categoryName: string;
//     displayOrder: number;
//   };
//   specName: string;
//   displayOrder: number;
// }

// export function SpecsSection({ form, specDefinitions }: SpecsSectionProps) {
//   const {
//     register,
//     watch,
//     formState: { errors },
//   } = form;

//   // Track dynamically created categories and spec definitions locally
//   const [createdSpecDefs, setCreatedSpecDefs] = useState<
//     LookupSpecDefinition[]
//   >([]);
//   const [customCategories, setCustomCategories] = useState<
//     { id: number; name: string; displayOrder: number }[]
//   >([]);

//   // Search & Accordion State
//   const [searchQuery, setSearchQuery] = useState("");
//   const [collapsedCategories, setCollapsedCategories] = useState<
//     Record<string, boolean>
//   >({});
//   const [successMsg, setSuccessMsg] = useState<string | null>(null);

//   // Category Modal State
//   const [isCatModalOpen, setIsCatModalOpen] = useState(false);
//   const [catName, setCatName] = useState("");
//   const [catDisplayOrder, setCatDisplayOrder] = useState<number>(10);
//   const [catSubmitting, setCatSubmitting] = useState(false);
//   const [catError, setCatError] = useState<string | null>(null);

//   // Spec Definition Modal State
//   const [isSpecModalOpen, setIsSpecModalOpen] = useState(false);
//   const [selectedCatId, setSelectedCatId] = useState<number | null>(null);
//   const [specName, setSpecName] = useState("");
//   const [specDisplayOrder, setSpecDisplayOrder] = useState<number>(1);
//   const [specSubmitting, setSpecSubmitting] = useState(false);
//   const [specError, setSpecError] = useState<string | null>(null);

//   // Combined list of initial + created spec definitions
//   const allSpecDefinitions = useMemo(() => {
//     return [...specDefinitions, ...createdSpecDefs];
//   }, [specDefinitions, createdSpecDefs]);

//   // Index mapping for RHF field stability
//   const specIndexMap = useMemo(() => {
//     const map = new Map<number, number>();
//     allSpecDefinitions.forEach((spec, index) => {
//       map.set(spec.id, index);
//     });
//     return map;
//   }, [allSpecDefinitions]);

//   // Dynamic values watcher
//   const watchedSpecs = watch("specifications") || [];

//   // Group specs by Category
//   const groupedSpecs = useMemo(() => {
//     const acc: Record<string, LookupSpecDefinition[]> = {};

//     // Ensure all custom categories exist in group map even if empty
//     customCategories.forEach((cat) => {
//       if (!acc[cat.name]) acc[cat.name] = [];
//     });

//     allSpecDefinitions.forEach((item) => {
//       const category = item.categoryName || "General";
//       if (!acc[category]) {
//         acc[category] = [];
//       }
//       acc[category].push(item);
//     });

//     return acc;
//   }, [allSpecDefinitions, customCategories]);

//   // Filter grouped specs by search term
//   const filteredGroupedSpecs = useMemo(() => {
//     if (!searchQuery.trim()) return groupedSpecs;

//     const query = searchQuery.toLowerCase().trim();
//     const result: Record<string, LookupSpecDefinition[]> = {};

//     Object.entries(groupedSpecs).forEach(([category, specs]) => {
//       const matchingSpecs = specs.filter(
//         (spec) =>
//           spec.name.toLowerCase().includes(query) ||
//           category.toLowerCase().includes(query),
//       );

//       if (matchingSpecs.length > 0 || category.toLowerCase().includes(query)) {
//         result[category] = matchingSpecs;
//       }
//     });

//     return result;
//   }, [groupedSpecs, searchQuery]);

//   // List of unique categories with IDs for the Spec Definition modal
//   const categoryOptions = useMemo(() => {
//     const map = new Map<number, string>();
//     allSpecDefinitions.forEach((s) => {
//       if (s.categoryId && s.categoryName) {
//         map.set(s.categoryId, s.categoryName);
//       }
//     });
//     customCategories.forEach((c) => {
//       map.set(c.id, c.name);
//     });
//     return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
//   }, [allSpecDefinitions, customCategories]);

//   // Handlers for Category Creation
//   const handleCreateCategory = async (e?: React.FormEvent) => {
//     if (e) e.preventDefault();
//     if (!catName.trim()) return;

//     setCatSubmitting(true);
//     setCatError(null);

//     try {
//       const data = await apiFetch<SpecCategoryApiResponse>(
//         "/api/spec-categories",
//         {
//           method: "POST",
//           body: JSON.stringify({
//             categoryName: catName.trim(),
//             displayOrder: catDisplayOrder,
//           }),
//         },
//       );

//       setCustomCategories((prev) => [
//         ...prev,
//         {
//           id: data.categoryId,
//           name: data.categoryName,
//           displayOrder: data.displayOrder,
//         },
//       ]);

//       setCatName("");
//       setIsCatModalOpen(false);
//       setSuccessMsg(`Category "${data.categoryName}" created successfully!`);
//       setTimeout(() => setSuccessMsg(null), 4000);
//     } catch (err: unknown) {
//       setCatError(
//         err instanceof Error ? err.message : "Failed to create spec category.",
//       );
//     } finally {
//       setCatSubmitting(false);
//     }
//   };

//   // Handlers for Spec Definition Creation
//   const handleCreateSpecDefinition = async (e?: React.FormEvent) => {
//     if (e) e.preventDefault();
//     if (!selectedCatId || !specName.trim()) return;

//     setSpecSubmitting(true);
//     setSpecError(null);

//     try {
//       const data = await apiFetch<SpecDefinitionApiResponse>(
//         "/api/spec-definitions",
//         {
//           method: "POST",
//           body: JSON.stringify({
//             category: { categoryId: selectedCatId },
//             specName: specName.trim(),
//             displayOrder: specDisplayOrder,
//           }),
//         },
//       );

//       const newSpecDef: LookupSpecDefinition = {
//         id: data.specDefinitionId,
//         name: data.specName,
//         categoryName: data.category.categoryName,
//         categoryId: data.category.categoryId,
//       };

//       setCreatedSpecDefs((prev) => [...prev, newSpecDef]);
//       setSpecName("");
//       setIsSpecModalOpen(false);
//       setSuccessMsg(`Specification key "${data.specName}" created!`);
//       setTimeout(() => setSuccessMsg(null), 4000);
//     } catch (err: unknown) {
//       setSpecError(
//         err instanceof Error
//           ? err.message
//           : "Failed to create specification definition.",
//       );
//     } finally {
//       setSpecSubmitting(false);
//     }
//   };

//   const toggleCategory = (category: string) => {
//     setCollapsedCategories((prev) => ({
//       ...prev,
//       [category]: !prev[category],
//     }));
//   };

//   const toggleAllCategories = (collapse: boolean) => {
//     const newState: Record<string, boolean> = {};
//     Object.keys(groupedSpecs).forEach((cat) => {
//       newState[cat] = collapse;
//     });
//     setCollapsedCategories(newState);
//   };

//   return (
//     <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg flex flex-col gap-6">
//       {/* Header & Main Controls */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
//         <div>
//           <div className="flex items-center gap-3">
//             <h3 className="text-lg font-semibold text-slate-100">
//               Technical Specifications
//             </h3>
//             {successMsg && (
//               <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2.5 py-1 rounded">
//                 <CheckCircle2 className="w-3.5 h-3.5" /> {successMsg}
//               </span>
//             )}
//           </div>
//           <p className="text-xs text-slate-400 mt-0.5">
//             Enter spec values directly under each category. Empty fields are
//             ignored on submit.
//           </p>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex flex-wrap items-center gap-2">
//           <button
//             type="button"
//             onClick={() => setIsCatModalOpen(true)}
//             className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded transition-colors cursor-pointer font-medium"
//           >
//             <FolderPlus className="w-3.5 h-3.5 text-blue-400" /> New Category
//           </button>
//           <button
//             type="button"
//             onClick={() => {
//               setSelectedCatId(categoryOptions[0]?.id || null);
//               setIsSpecModalOpen(true);
//             }}
//             className="flex items-center gap-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded transition-colors cursor-pointer font-medium"
//           >
//             <Plus className="w-3.5 h-3.5" /> New Spec Key
//           </button>
//         </div>
//       </div>

//       {/* Global Collapse & Search Toolbar */}
//       <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
//         <div className="relative flex-1 w-full">
//           <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
//           <input
//             type="text"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             placeholder="Filter specs by name or category (e.g. 6G Bands, Display)..."
//             className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
//           />
//           {searchQuery && (
//             <button
//               type="button"
//               onClick={() => setSearchQuery("")}
//               className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200"
//             >
//               Clear
//             </button>
//           )}
//         </div>

//         <div className="flex items-center gap-2 self-end sm:self-auto">
//           <button
//             type="button"
//             onClick={() => toggleAllCategories(false)}
//             className="text-xs text-slate-400 hover:text-slate-200 bg-slate-800/80 px-2.5 py-2 rounded transition-colors cursor-pointer"
//           >
//             Expand All
//           </button>
//           <button
//             type="button"
//             onClick={() => toggleAllCategories(true)}
//             className="text-xs text-slate-400 hover:text-slate-200 bg-slate-800/80 px-2.5 py-2 rounded transition-colors cursor-pointer"
//           >
//             Collapse All
//           </button>
//         </div>
//       </div>

//       {errors.specifications?.root && (
//         <p className="text-red-400 text-xs bg-red-950/50 border border-red-900 p-2.5 rounded">
//           {errors.specifications.root.message}
//         </p>
//       )}

//       {/* Category Accordion Cards */}
//       {Object.keys(filteredGroupedSpecs).length === 0 ? (
//         <div className="text-center py-8 text-slate-500 text-sm">
//           No specs match your search {searchQuery}.
//         </div>
//       ) : (
//         <div className="flex flex-col gap-4">
//           {Object.entries(filteredGroupedSpecs).map(([category, specs]) => {
//             const isCollapsed = !!collapsedCategories[category];

//             const filledCount = specs.filter((s) => {
//               const idx = specIndexMap.get(s.id);
//               const val =
//                 idx !== undefined ? watchedSpecs[idx]?.specValue : undefined;
//               return val && val.trim().length > 0;
//             }).length;

//             const categoryId =
//               specs[0]?.categoryId ||
//               customCategories.find((c) => c.name === category)?.id;

//             return (
//               <div
//                 key={category}
//                 className="bg-slate-950 border border-slate-800 rounded-lg overflow-hidden transition-colors"
//               >
//                 {/* Category Card Header */}
//                 <div className="flex items-center justify-between p-4 bg-slate-900/60 hover:bg-slate-900 border-b border-slate-800/60 transition-colors">
//                   <div
//                     onClick={() => toggleCategory(category)}
//                     className="flex items-center gap-3 cursor-pointer select-none flex-1"
//                   >
//                     <span className="font-medium text-slate-200 text-sm">
//                       {category}
//                     </span>
//                     <span
//                       className={`text-xs px-2 py-0.5 rounded-full font-medium ${
//                         filledCount > 0
//                           ? "bg-blue-950 text-blue-400 border border-blue-800/60"
//                           : "bg-slate-800 text-slate-400"
//                       }`}
//                     >
//                       {filledCount} / {specs.length} Filled
//                     </span>
//                   </div>

//                   <div className="flex items-center gap-3">
//                     {categoryId && (
//                       <button
//                         type="button"
//                         onClick={() => {
//                           setSelectedCatId(categoryId);
//                           setIsSpecModalOpen(true);
//                         }}
//                         className="text-xs text-blue-400 hover:text-blue-300 font-medium cursor-pointer"
//                       >
//                         + Spec Key
//                       </button>
//                     )}
//                     <div
//                       onClick={() => toggleCategory(category)}
//                       className="cursor-pointer text-slate-400"
//                     >
//                       {filledCount === specs.length && specs.length > 0 && (
//                         <CheckCircle2 className="w-4 h-4 text-emerald-400 inline mr-2" />
//                       )}
//                       {isCollapsed ? (
//                         <ChevronDown className="w-4 h-4 inline" />
//                       ) : (
//                         <ChevronUp className="w-4 h-4 inline" />
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Category Specs Grid */}
//                 {!isCollapsed && (
//                   <div className="p-4">
//                     {specs.length === 0 ? (
//                       <p className="text-xs text-slate-500 italic">
//                         No spec keys added to this category yet. Click + Spec
//                         Key above to add one.
//                       </p>
//                     ) : (
//                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                         {specs.map((spec) => {
//                           const globalIndex = specIndexMap.get(spec.id) ?? 0;
//                           const fieldError =
//                             errors.specifications?.[globalIndex]?.specValue;

//                           return (
//                             <div
//                               key={spec.id}
//                               className="flex flex-col gap-1.5"
//                             >
//                               <label className="text-xs font-medium text-slate-400">
//                                 {spec.name}
//                               </label>

//                               <input
//                                 type="hidden"
//                                 value={spec.id}
//                                 {...register(
//                                   `specifications.${globalIndex}.specDefinitionId`,
//                                   { valueAsNumber: true },
//                                 )}
//                               />

//                               <input
//                                 type="text"
//                                 {...register(
//                                   `specifications.${globalIndex}.specValue`,
//                                 )}
//                                 placeholder={`Enter ${spec.name.toLowerCase()}...`}
//                                 className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
//                               />

//                               {fieldError && (
//                                 <p className="text-red-400 text-xs">
//                                   {fieldError.message}
//                                 </p>
//                               )}
//                             </div>
//                           );
//                         })}
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {/* Modal 1: Add Category */}
//       {isCatModalOpen && (
//         <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
//           <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-md p-6 space-y-4 shadow-xl">
//             <div className="flex items-center justify-between border-b border-slate-800 pb-3">
//               <h4 className="font-semibold text-slate-100 text-sm flex items-center gap-2">
//                 <FolderPlus className="w-4 h-4 text-blue-400" /> Create Spec
//                 Category
//               </h4>
//               <button
//                 type="button"
//                 onClick={() => setIsCatModalOpen(false)}
//                 className="text-slate-400 hover:text-slate-200 p-1 rounded"
//               >
//                 <X className="w-4 h-4" />
//               </button>
//             </div>

//             {catError && (
//               <div className="p-3 bg-red-950/80 border border-red-800 rounded text-red-300 text-xs">
//                 {catError}
//               </div>
//             )}

//             <div className="space-y-4">
//               <div>
//                 <label className="block text-xs font-medium text-slate-300 mb-1">
//                   Category Name <span className="text-red-400">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   value={catName}
//                   onChange={(e) => setCatName(e.target.value)}
//                   placeholder="e.g. Price, Network, General"
//                   className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-xs font-medium text-slate-300 mb-1">
//                   Display Order
//                 </label>
//                 <input
//                   type="number"
//                   value={catDisplayOrder}
//                   onChange={(e) => setCatDisplayOrder(Number(e.target.value))}
//                   placeholder="14"
//                   className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
//                 />
//               </div>

//               <div className="flex items-center justify-end gap-2 pt-2">
//                 <button
//                   type="button"
//                   onClick={() => setIsCatModalOpen(false)}
//                   className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 rounded border border-slate-800 hover:bg-slate-800 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="button"
//                   onClick={handleCreateCategory}
//                   disabled={catSubmitting || !catName.trim()}
//                   className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-medium text-xs px-4 py-1.5 rounded transition-colors"
//                 >
//                   {catSubmitting ? (
//                     <>
//                       <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
//                     </>
//                   ) : (
//                     "Save Category"
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Modal 2: Add Spec Definition */}
//       {isSpecModalOpen && (
//         <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
//           <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-md p-6 space-y-4 shadow-xl">
//             <div className="flex items-center justify-between border-b border-slate-800 pb-3">
//               <h4 className="font-semibold text-slate-100 text-sm flex items-center gap-2">
//                 <Plus className="w-4 h-4 text-blue-400" /> Create Specification
//                 Key
//               </h4>
//               <button
//                 type="button"
//                 onClick={() => setIsSpecModalOpen(false)}
//                 className="text-slate-400 hover:text-slate-200 p-1 rounded"
//               >
//                 <X className="w-4 h-4" />
//               </button>
//             </div>

//             {specError && (
//               <div className="p-3 bg-red-950/80 border border-red-800 rounded text-red-300 text-xs">
//                 {specError}
//               </div>
//             )}

//             <div className="space-y-4">
//               <div>
//                 <label className="block text-xs font-medium text-slate-300 mb-1">
//                   Target Category <span className="text-red-400">*</span>
//                 </label>
//                 <select
//                   value={selectedCatId ?? ""}
//                   onChange={(e) => setSelectedCatId(Number(e.target.value))}
//                   className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
//                 >
//                   <option value="" disabled>
//                     Select category...
//                   </option>
//                   {categoryOptions.map((cat) => (
//                     <option key={cat.id} value={cat.id}>
//                       {cat.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-xs font-medium text-slate-300 mb-1">
//                   Spec Name <span className="text-red-400">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   value={specName}
//                   onChange={(e) => setSpecName(e.target.value)}
//                   placeholder="e.g. 6G Bands, Peak Brightness"
//                   className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-xs font-medium text-slate-300 mb-1">
//                   Display Order
//                 </label>
//                 <input
//                   type="number"
//                   value={specDisplayOrder}
//                   onChange={(e) => setSpecDisplayOrder(Number(e.target.value))}
//                   placeholder="6"
//                   className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
//                 />
//               </div>

//               <div className="flex items-center justify-end gap-2 pt-2">
//                 <button
//                   type="button"
//                   onClick={() => setIsSpecModalOpen(false)}
//                   className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 rounded border border-slate-800 hover:bg-slate-800 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="button"
//                   onClick={handleCreateSpecDefinition}
//                   disabled={
//                     specSubmitting || !specName.trim() || !selectedCatId
//                   }
//                   className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-medium text-xs px-4 py-1.5 rounded transition-colors"
//                 >
//                   {specSubmitting ? (
//                     <>
//                       <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
//                     </>
//                   ) : (
//                     "Save Spec Key"
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import React, { useState, useMemo } from "react";
import { UseFormReturn } from "react-hook-form";
import {
  Search,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Plus,
  FolderPlus,
  X,
  Loader2,
} from "lucide-react";
import { MobileFormValues } from "@/lib/schemas/mobileSchema";
import { LookupSpecDefinition } from "@/types/mobile";
import { apiFetch } from "@/lib/api/client";

interface SpecsSectionProps {
  form: UseFormReturn<MobileFormValues>;
  specDefinitions: LookupSpecDefinition[];
}

interface SpecCategoryApiResponse {
  categoryId: number;
  categoryName: string;
  displayOrder?: number;
}

interface SpecDefinitionApiResponse {
  specDefinitionId: number;
  category: {
    categoryId: number;
    categoryName: string;
    displayOrder?: number;
  };
  specName: string;
  displayOrder?: number;
}

/**
 * Helper to filter out specification entries with empty or whitespace-only values
 * Call this before submitting your main form payload to the backend.
 */
export const filterFilledSpecifications = (
  specifications: { specDefinitionId: number; specValue?: string }[] = [],
) => {
  return specifications.filter(
    (spec) =>
      spec.specDefinitionId > 0 &&
      typeof spec.specValue === "string" &&
      spec.specValue.trim().length > 0,
  );
};

export function SpecsSection({ form, specDefinitions }: SpecsSectionProps) {
  const {
    register,
    watch,
    formState: { errors },
  } = form;

  // Track dynamically created categories and spec definitions locally
  const [createdSpecDefs, setCreatedSpecDefs] = useState<
    LookupSpecDefinition[]
  >([]);
  const [customCategories, setCustomCategories] = useState<
    { id: number; name: string; displayOrder?: number }[]
  >([]);

  // Search & Accordion State
  const [searchQuery, setSearchQuery] = useState("");
  const [collapsedCategories, setCollapsedCategories] = useState<
    Record<string, boolean>
  >({});
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Category Modal State
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [catName, setCatName] = useState("");
  const [catDisplayOrder, setCatDisplayOrder] = useState<string>("");
  const [catSubmitting, setCatSubmitting] = useState(false);
  const [catError, setCatError] = useState<string | null>(null);

  // Spec Definition Modal State
  const [isSpecModalOpen, setIsSpecModalOpen] = useState(false);
  const [selectedCatId, setSelectedCatId] = useState<number | null>(null);
  const [specName, setSpecName] = useState("");
  const [specDisplayOrder, setSpecDisplayOrder] = useState<string>("");
  const [specSubmitting, setSpecSubmitting] = useState(false);
  const [specError, setSpecError] = useState<string | null>(null);

  // Combined list of initial + created spec definitions
  const allSpecDefinitions = useMemo(() => {
    return [...specDefinitions, ...createdSpecDefs];
  }, [specDefinitions, createdSpecDefs]);

  // Index mapping for RHF field stability
  const specIndexMap = useMemo(() => {
    const map = new Map<number, number>();
    allSpecDefinitions.forEach((spec, index) => {
      map.set(spec.id, index);
    });
    return map;
  }, [allSpecDefinitions]);

  // Dynamic values watcher
  const watchedSpecs = watch("specifications") || [];

  // Group specs by Category
  const groupedSpecs = useMemo(() => {
    const acc: Record<string, LookupSpecDefinition[]> = {};

    customCategories.forEach((cat) => {
      if (!acc[cat.name]) acc[cat.name] = [];
    });

    allSpecDefinitions.forEach((item) => {
      const category = item.categoryName || "General";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
    });

    return acc;
  }, [allSpecDefinitions, customCategories]);

  // Filter grouped specs by search query
  const filteredGroupedSpecs = useMemo(() => {
    if (!searchQuery.trim()) return groupedSpecs;

    const query = searchQuery.toLowerCase().trim();
    const result: Record<string, LookupSpecDefinition[]> = {};

    Object.entries(groupedSpecs).forEach(([category, specs]) => {
      const matchingSpecs = specs.filter(
        (spec) =>
          spec.name.toLowerCase().includes(query) ||
          category.toLowerCase().includes(query),
      );

      if (matchingSpecs.length > 0 || category.toLowerCase().includes(query)) {
        result[category] = matchingSpecs;
      }
    });

    return result;
  }, [groupedSpecs, searchQuery]);

  // Options list for Spec Definition Modal target category selection
  const categoryOptions = useMemo(() => {
    const map = new Map<number, string>();
    allSpecDefinitions.forEach((s) => {
      if (s.categoryId && s.categoryName) {
        map.set(s.categoryId, s.categoryName);
      }
    });
    customCategories.forEach((c) => {
      map.set(c.id, c.name);
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [allSpecDefinitions, customCategories]);

  // Handlers for Category Creation - Only includes filled fields in API payload
  const handleCreateCategory = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!catName.trim()) return;

    setCatSubmitting(true);
    setCatError(null);

    // Build payload dynamically with filled attributes only
    const payload: Record<string, unknown> = {
      categoryName: catName.trim(),
    };
    if (catDisplayOrder.trim() !== "") {
      payload.displayOrder = Number(catDisplayOrder);
    }

    try {
      const data = await apiFetch<SpecCategoryApiResponse>(
        "/api/spec-categories",
        {
          method: "POST",
          body: JSON.stringify(payload),
        },
      );

      setCustomCategories((prev) => [
        ...prev,
        {
          id: data.categoryId,
          name: data.categoryName,
          displayOrder: data.displayOrder,
        },
      ]);

      setCatName("");
      setCatDisplayOrder("");
      setIsCatModalOpen(false);
      setSuccessMsg(`Category "${data.categoryName}" created successfully!`);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: unknown) {
      setCatError(
        err instanceof Error ? err.message : "Failed to create spec category.",
      );
    } finally {
      setCatSubmitting(false);
    }
  };

  // Handlers for Spec Definition Creation - Only includes filled fields in API payload
  const handleCreateSpecDefinition = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedCatId || !specName.trim()) return;

    setSpecSubmitting(true);
    setSpecError(null);

    // Build payload dynamically with filled attributes only
    const payload: Record<string, unknown> = {
      category: { categoryId: selectedCatId },
      specName: specName.trim(),
    };
    if (specDisplayOrder.trim() !== "") {
      payload.displayOrder = Number(specDisplayOrder);
    }

    try {
      const data = await apiFetch<SpecDefinitionApiResponse>(
        "/api/spec-definitions",
        {
          method: "POST",
          body: JSON.stringify(payload),
        },
      );

      const newSpecDef: LookupSpecDefinition = {
        id: data.specDefinitionId,
        name: data.specName,
        categoryName: data.category.categoryName,
        categoryId: data.category.categoryId,
      };

      setCreatedSpecDefs((prev) => [...prev, newSpecDef]);
      setSpecName("");
      setSpecDisplayOrder("");
      setIsSpecModalOpen(false);
      setSuccessMsg(`Specification key "${data.specName}" created!`);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: unknown) {
      setSpecError(
        err instanceof Error
          ? err.message
          : "Failed to create specification definition.",
      );
    } finally {
      setSpecSubmitting(false);
    }
  };

  const toggleCategory = (category: string) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const toggleAllCategories = (collapse: boolean) => {
    const newState: Record<string, boolean> = {};
    Object.keys(groupedSpecs).forEach((cat) => {
      newState[cat] = collapse;
    });
    setCollapsedCategories(newState);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg flex flex-col gap-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-slate-100">
              Technical Specifications
            </h3>
            {successMsg && (
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2.5 py-1 rounded">
                <CheckCircle2 className="w-3.5 h-3.5" /> {successMsg}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Enter spec values directly under each category. Only filled fields
            will be included on submit.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsCatModalOpen(true)}
            className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded transition-colors cursor-pointer font-medium"
          >
            <FolderPlus className="w-3.5 h-3.5 text-blue-400" /> New Category
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedCatId(categoryOptions[0]?.id || null);
              setIsSpecModalOpen(true);
            }}
            className="flex items-center gap-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded transition-colors cursor-pointer font-medium"
          >
            <Plus className="w-3.5 h-3.5" /> New Spec Key
          </button>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter specs by name or category (e.g. 6G Bands, Display)..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => toggleAllCategories(false)}
            className="text-xs text-slate-400 hover:text-slate-200 bg-slate-800/80 px-2.5 py-2 rounded transition-colors cursor-pointer"
          >
            Expand All
          </button>
          <button
            type="button"
            onClick={() => toggleAllCategories(true)}
            className="text-xs text-slate-400 hover:text-slate-200 bg-slate-800/80 px-2.5 py-2 rounded transition-colors cursor-pointer"
          >
            Collapse All
          </button>
        </div>
      </div>

      {errors.specifications?.root && (
        <p className="text-red-400 text-xs bg-red-950/50 border border-red-900 p-2.5 rounded">
          {errors.specifications.root.message}
        </p>
      )}

      {/* Categories Accordion */}
      {Object.keys(filteredGroupedSpecs).length === 0 ? (
        <div className="text-center py-8 text-slate-500 text-sm">
          No specs match your search {searchQuery}.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {Object.entries(filteredGroupedSpecs).map(([category, specs]) => {
            const isCollapsed = !!collapsedCategories[category];

            const filledCount = specs.filter((s) => {
              const idx = specIndexMap.get(s.id);
              const val =
                idx !== undefined ? watchedSpecs[idx]?.specValue : undefined;
              return val && val.trim().length > 0;
            }).length;

            const categoryId =
              specs[0]?.categoryId ||
              customCategories.find((c) => c.name === category)?.id;

            return (
              <div
                key={category}
                className="bg-slate-950 border border-slate-800 rounded-lg overflow-hidden transition-colors"
              >
                <div className="flex items-center justify-between p-4 bg-slate-900/60 hover:bg-slate-900 border-b border-slate-800/60 transition-colors">
                  <div
                    onClick={() => toggleCategory(category)}
                    className="flex items-center gap-3 cursor-pointer select-none flex-1"
                  >
                    <span className="font-medium text-slate-200 text-sm">
                      {category}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        filledCount > 0
                          ? "bg-blue-950 text-blue-400 border border-blue-800/60"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {filledCount} / {specs.length} Filled
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {categoryId && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCatId(categoryId);
                          setIsSpecModalOpen(true);
                        }}
                        className="text-xs text-blue-400 hover:text-blue-300 font-medium cursor-pointer"
                      >
                        + Spec Key
                      </button>
                    )}
                    <div
                      onClick={() => toggleCategory(category)}
                      className="cursor-pointer text-slate-400"
                    >
                      {filledCount === specs.length && specs.length > 0 && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 inline mr-2" />
                      )}
                      {isCollapsed ? (
                        <ChevronDown className="w-4 h-4 inline" />
                      ) : (
                        <ChevronUp className="w-4 h-4 inline" />
                      )}
                    </div>
                  </div>
                </div>

                {!isCollapsed && (
                  <div className="p-4">
                    {specs.length === 0 ? (
                      <p className="text-xs text-slate-500 italic">
                        No spec keys added to this category yet. Click + Spec
                        Key above to add one.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {specs.map((spec) => {
                          const globalIndex = specIndexMap.get(spec.id) ?? 0;
                          const fieldError =
                            errors.specifications?.[globalIndex]?.specValue;

                          return (
                            <div
                              key={spec.id}
                              className="flex flex-col gap-1.5"
                            >
                              <label className="text-xs font-medium text-slate-400">
                                {spec.name}
                              </label>

                              <input
                                type="hidden"
                                value={spec.id}
                                {...register(
                                  `specifications.${globalIndex}.specDefinitionId`,
                                  { valueAsNumber: true },
                                )}
                              />

                              <input
                                type="text"
                                {...register(
                                  `specifications.${globalIndex}.specValue`,
                                )}
                                placeholder={`Enter ${spec.name.toLowerCase()}...`}
                                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                              />

                              {fieldError && (
                                <p className="text-red-400 text-xs">
                                  {fieldError.message}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal 1: Add Category */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-md p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="font-semibold text-slate-100 text-sm flex items-center gap-2">
                <FolderPlus className="w-4 h-4 text-blue-400" /> Create Spec
                Category
              </h4>
              <button
                type="button"
                onClick={() => setIsCatModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {catError && (
              <div className="p-3 bg-red-950/80 border border-red-800 rounded text-red-300 text-xs">
                {catError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Category Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="e.g. Price, Network, General"
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Display Order{" "}
                  <span className="text-slate-500 font-normal">(Optional)</span>
                </label>
                <input
                  type="number"
                  value={catDisplayOrder}
                  onChange={(e) => setCatDisplayOrder(e.target.value)}
                  placeholder="e.g. 14"
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCatModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 rounded border border-slate-800 hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateCategory}
                  disabled={catSubmitting || !catName.trim()}
                  className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-medium text-xs px-4 py-1.5 rounded transition-colors"
                >
                  {catSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
                    </>
                  ) : (
                    "Save Category"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Add Spec Definition */}
      {isSpecModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-md p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="font-semibold text-slate-100 text-sm flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-400" /> Create Specification
                Key
              </h4>
              <button
                type="button"
                onClick={() => setIsSpecModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {specError && (
              <div className="p-3 bg-red-950/80 border border-red-800 rounded text-red-300 text-xs">
                {specError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Target Category <span className="text-red-400">*</span>
                </label>
                <select
                  value={selectedCatId ?? ""}
                  onChange={(e) => setSelectedCatId(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="" disabled>
                    Select category...
                  </option>
                  {categoryOptions.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Spec Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={specName}
                  onChange={(e) => setSpecName(e.target.value)}
                  placeholder="e.g. 6G Bands, Peak Brightness"
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Display Order{" "}
                  <span className="text-slate-500 font-normal">(Optional)</span>
                </label>
                <input
                  type="number"
                  value={specDisplayOrder}
                  onChange={(e) => setSpecDisplayOrder(e.target.value)}
                  placeholder="e.g. 6"
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSpecModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 rounded border border-slate-800 hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateSpecDefinition}
                  disabled={
                    specSubmitting || !specName.trim() || !selectedCatId
                  }
                  className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-medium text-xs px-4 py-1.5 rounded transition-colors"
                >
                  {specSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
                    </>
                  ) : (
                    "Save Spec Key"
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
