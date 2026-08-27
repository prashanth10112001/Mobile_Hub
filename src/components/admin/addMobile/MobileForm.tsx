"use client";

import React, { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { mobileFormSchema, MobileFormValues } from "@/lib/schemas/mobileSchema";
import { createMobile } from "@/lib/actions/mobileActions";
import { LookupData } from "@/types/mobile";
import { CoreDetailsSection } from "./CoreDetailsSection";
import { SpecsSection } from "./SpecsSection";
import { VariantsSection } from "./VariantsSection";
import { ImagesSection } from "./ImagesSection";
import { Loader2, Send } from "lucide-react";

interface MobileFormProps {
  lookupData: LookupData;
}

export function MobileForm({ lookupData }: MobileFormProps) {
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const form = useForm<MobileFormValues>({
    resolver: zodResolver(mobileFormSchema),
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

  const onSubmit = (data: MobileFormValues) => {
    setFeedback(null);
    startTransition(async () => {
      const result = await createMobile(data);
      if (result.success) {
        setFeedback({ type: "success", message: result.message });
        form.reset();
      } else {
        setFeedback({ type: "error", message: result.message });
      }
    });
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6 max-w-5xl"
    >
      {feedback && (
        <div
          className={`p-4 rounded text-sm ${
            feedback.type === "success"
              ? "bg-emerald-950 border border-emerald-800 text-emerald-300"
              : "bg-red-950 border border-red-800 text-red-300"
          }`}
        >
          {feedback.message}
        </div>
      )}

      <CoreDetailsSection form={form} brands={lookupData.brands} />
      <SpecsSection form={form} specDefinitions={lookupData.specDefinitions} />
      <VariantsSection form={form} stores={lookupData.stores} />
      <ImagesSection form={form} />

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-medium px-6 py-2.5 rounded transition-colors"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Saving Mobile...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" /> Save Device Entry
            </>
          )}
        </button>
      </div>
    </form>
  );
}
