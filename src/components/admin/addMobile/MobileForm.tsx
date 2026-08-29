"use client";

import React, { useTransition, useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { mobileFormSchema, MobileFormValues } from "@/lib/schemas/mobileSchema";
import { createMobile } from "@/lib/actions/mobileActions";
import { LookupData } from "@/types/mobile";
import { CoreDetailsSection } from "./CoreDetailsSection";
import { SpecsSection } from "./SpecsSection";
import { VariantsSection } from "./VariantsSection";
import { ImagesSection } from "./ImagesSection";
import {
  Loader2,
  Send,
  ChevronLeft,
  ChevronRight,
  FileText,
  Cpu,
  Tags,
  ImageIcon,
  CheckCircle2,
  AlertCircle,
  Eye,
  X,
} from "lucide-react";

interface MobileFormProps {
  lookupData: LookupData;
}

type TabKey = "core" | "specs" | "variants" | "images" | "review";

interface TabItem {
  id: TabKey;
  label: string;
  number: number;
  icon: React.ElementType;
  fields: (keyof MobileFormValues)[];
}

const TABS: TabItem[] = [
  {
    id: "core",
    label: "Core Details",
    number: 1,
    icon: FileText,
    fields: ["brandId", "mobileName", "slug", "launchDate", "status"],
  },
  {
    id: "specs",
    label: "Specs",
    number: 2,
    icon: Cpu,
    fields: ["specifications"],
  },
  {
    id: "variants",
    label: "Variants",
    number: 3,
    icon: Tags,
    fields: ["variants"],
  },
  {
    id: "images",
    label: "Gallery",
    number: 4,
    icon: ImageIcon,
    fields: ["images"],
  },
  {
    id: "review",
    label: "Review & Save",
    number: 5,
    icon: Eye,
    fields: [],
  },
];

export function MobileForm({ lookupData }: MobileFormProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("core");
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const form = useForm<MobileFormValues>({
    resolver: zodResolver(mobileFormSchema),
    mode: "onChange",
    defaultValues: {
      brandId: 0,
      mobileName: "",
      slug: "",
      launchDate: new Date().toISOString().split("T")[0],
      status: "Available",
      specifications: [],
      variants: [],
      images: [],
    },
  });

  const { formState, control } = form;
  const values = useWatch({ control });

  const filledSpecsCount =
    values.specifications?.filter(
      (spec) =>
        typeof spec?.specValue === "string" && spec.specValue.trim().length > 0,
    ).length ?? 0;

  const activeIndex = TABS.findIndex((t) => t.id === activeTab);

  // Auto-dismiss feedback message after 5 seconds
  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => {
      setFeedback(null);
    }, 5000);
    return () => clearTimeout(timer);
  }, [feedback]);

  const changeTab = (tabId: TabKey) => {
    setFeedback(null);
    setActiveTab(tabId);
  };

  const handleNext = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    setFeedback(null);
    const currentTabObj = TABS[activeIndex];

    if (currentTabObj.fields.length > 0) {
      const isValid = await form.trigger(currentTabObj.fields);
      if (!isValid) return;
    }

    if (activeIndex < TABS.length - 1) {
      setActiveTab(TABS[activeIndex + 1].id);
    }
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.preventDefault();
    setFeedback(null);
    if (activeIndex > 0) {
      setActiveTab(TABS[activeIndex - 1].id);
    }
  };

  const getStepStatus = (tab: TabItem) => {
    if (tab.id === "review") return "idle";

    const hasErrors = tab.fields.some((field) => !!formState.errors[field]);
    if (hasErrors) return "error";

    if (tab.id === "core") {
      const isCoreComplete =
        (values.brandId ?? 0) > 0 &&
        (values.mobileName?.trim() ?? "") !== "" &&
        (values.slug?.trim() ?? "") !== "";
      return isCoreComplete ? "complete" : "idle";
    }

    // if (tab.id === "specs")
    //   return (values.specifications?.length ?? 0) > 0 ? "complete" : "idle";
    if (tab.id === "specs") return filledSpecsCount > 0 ? "complete" : "idle";
    if (tab.id === "variants")
      return (values.variants?.length ?? 0) > 0 ? "complete" : "idle";
    if (tab.id === "images")
      return (values.images?.length ?? 0) > 0 ? "complete" : "idle";

    return "idle";
  };

  const onSubmit = (data: MobileFormValues) => {
    setFeedback(null);
    startTransition(async () => {
      const result = await createMobile(data);
      if (result.success) {
        setFeedback({ type: "success", message: result.message });
        form.reset();
        setActiveTab("core");
      } else {
        setFeedback({ type: "error", message: result.message });
      }
    });
  };

  const selectedBrand =
    lookupData.brands.find((b) => b.id === Number(values.brandId))?.name ||
    "Not selected";

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6 max-w-5xl mx-auto"
    >
      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`p-4 rounded-lg text-sm border flex items-center justify-between gap-3 ${
            feedback.type === "success"
              ? "bg-emerald-950/80 border-emerald-800 text-emerald-300"
              : "bg-rose-950/80 border-rose-800 text-rose-300"
          }`}
        >
          <span>{feedback.message}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="p-1 rounded hover:bg-black/20 text-current transition-colors"
            aria-label="Dismiss feedback"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Connected Line Stepper Navigation */}
      {/* <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-6 shadow-xs overflow-x-auto scrollbar-none"> */}
      <div className=" p-4 sm:p-6 shadow-xs overflow-x-auto scrollbar-none">
        <nav aria-label="Progress" className="min-w-150 sm:min-w-full">
          <ol className="flex items-center w-full">
            {TABS.map((tab, idx) => {
              const isActive = activeTab === tab.id;
              const status = getStepStatus(tab);
              const isLast = idx === TABS.length - 1;

              // Line is highlighted if the current step index is past this connection
              const isLineCompleted = activeIndex > idx;

              return (
                <li
                  key={tab.id}
                  className={`flex items-center ${isLast ? "flex-none" : "flex-1"}`}
                >
                  <button
                    type="button"
                    onClick={() => changeTab(tab.id)}
                    className="group flex flex-col sm:flex-row items-center gap-2.5 cursor-pointer focus:outline-none"
                  >
                    {/* Circle Badge */}
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shrink-0 ${
                        isActive
                          ? "bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-950/80 shadow-sm"
                          : status === "complete"
                            ? "bg-emerald-500 text-white"
                            : status === "error"
                              ? "bg-rose-500 text-white"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700"
                      }`}
                    >
                      {status === "complete" && !isActive ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : status === "error" && !isActive ? (
                        <AlertCircle className="w-4 h-4" />
                      ) : (
                        tab.number
                      )}
                    </span>

                    {/* Step Label */}
                    <span
                      className={`text-xs font-medium whitespace-nowrap transition-colors ${
                        isActive
                          ? "text-blue-600 dark:text-blue-400 font-semibold"
                          : status === "complete"
                            ? "text-slate-900 dark:text-slate-100"
                            : "text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300"
                      }`}
                    >
                      {tab.label}
                    </span>
                  </button>

                  {/* Connecting Line */}
                  {!isLast && (
                    <div
                      className={`flex-1 h-0.5 mx-3 sm:mx-4 transition-colors ${
                        isLineCompleted
                          ? "bg-emerald-500"
                          : "bg-slate-200 dark:bg-slate-800"
                      }`}
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>

      {/* Form Content Sections */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
        <div className={activeTab === "core" ? "block" : "hidden"}>
          <CoreDetailsSection form={form} brands={lookupData.brands} />
        </div>

        <div className={activeTab === "specs" ? "block" : "hidden"}>
          <SpecsSection
            form={form}
            specDefinitions={lookupData.specDefinitions}
          />
        </div>

        <div className={activeTab === "variants" ? "block" : "hidden"}>
          <VariantsSection form={form} stores={lookupData.stores} />
        </div>

        <div className={activeTab === "images" ? "block" : "hidden"}>
          <ImagesSection form={form} />
        </div>

        {/* Tab 5: Review Step */}
        {activeTab === "review" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Review Device Summary
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Verify technical details, specifications, and prices before
                saving to the catalog.
              </p>
            </div>

            {Object.keys(formState.errors).length > 0 && (
              <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div className="text-xs text-rose-700 dark:text-rose-300">
                  <p className="font-semibold">
                    Form contains incomplete fields:
                  </p>
                  <ul className="list-disc list-inside mt-1 space-y-0.5">
                    {Object.keys(formState.errors).map((key) => (
                      <li key={key} className="capitalize">
                        {key} is invalid or required
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
                <h4 className="font-semibold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 pb-1.5">
                  Core Details
                </h4>
                <div className="grid grid-cols-2 gap-1 text-slate-600 dark:text-slate-400">
                  <span>Brand:</span>{" "}
                  <span className="font-medium text-slate-900 dark:text-slate-200">
                    {selectedBrand}
                  </span>
                  <span>Model Name:</span>{" "}
                  <span className="font-medium text-slate-900 dark:text-slate-200">
                    {values.mobileName || "—"}
                  </span>
                  <span>URL Slug:</span>{" "}
                  <span className="font-medium text-slate-900 dark:text-slate-200">
                    {values.slug || "—"}
                  </span>
                  <span>Launch Date:</span>{" "}
                  <span className="font-medium text-slate-900 dark:text-slate-200">
                    {values.launchDate}
                  </span>
                  <span>Status:</span>{" "}
                  <span className="font-medium text-slate-900 dark:text-slate-200">
                    {values.status}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
                <h4 className="font-semibold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 pb-1.5">
                  Catalog Totals
                </h4>
                <div className="grid grid-cols-2 gap-1 text-slate-600 dark:text-slate-400">
                  <span>Specifications Added:</span>{" "}
                  <span className="font-medium text-slate-900 dark:text-slate-200">
                    {/* {values.specifications?.length ?? 0} item(s) */}
                    {filledSpecsCount} item(s)
                  </span>
                  <span>Variants Configured:</span>{" "}
                  <span className="font-medium text-slate-900 dark:text-slate-200">
                    {values.variants?.length ?? 0} variant(s)
                  </span>
                  <span>Gallery Images:</span>{" "}
                  <span className="font-medium text-slate-900 dark:text-slate-200">
                    {values.images?.length ?? 0} image(s)
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Stepper Controls */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={handlePrev}
          disabled={activeIndex === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>

        <div className="flex items-center gap-3">
          {activeTab !== "review" ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
            >
              Next Step <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white font-semibold text-xs px-6 py-2.5 rounded-lg transition-colors shadow-sm cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving Device...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" /> Save Device Entry
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
