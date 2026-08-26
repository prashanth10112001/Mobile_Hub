"use server";

import { apiFetch } from "@/lib/api/client";
import { mobileFormSchema, MobileFormValues } from "@/lib/schemas/mobileSchema";
import { revalidatePath } from "next/cache";

export type ActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function createMobile(
  data: MobileFormValues,
): Promise<ActionState> {
  // 1. Validate form values on the server side using Zod
  const validationResult = mobileFormSchema.safeParse(data);

  if (!validationResult.success) {
    return {
      success: false,
      message: "Validation failed. Please check the form errors.",
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  try {
    // 2. Dispatch payload directly to Spring Boot REST endpoint
    await apiFetch("/mobiles", {
      method: "POST",
      body: JSON.stringify(validationResult.data),
    });

    // 3. Purge cached mobile listings so new data reflects instantly
    revalidatePath("/admin/mobiles");
    revalidatePath("/phones");

    return {
      success: true,
      message: "Mobile device created successfully!",
    };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to create mobile record on Spring Boot server.";

    return {
      success: false,
      message: errorMessage,
    };
  }
}
