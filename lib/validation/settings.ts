import * as z from "zod";

export const accountDisplayNameSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name cannot be empty.")
    .max(120, "Name is too long."),
});

export type AccountDisplayNameInput = z.infer<typeof accountDisplayNameSchema>;

export function changeEmailFormSchema(currentEmail: string) {
  const normalized = currentEmail.trim().toLowerCase();
  return z.object({
    newEmail: z
      .string()
      .trim()
      .min(1, "Enter a new email address.")
      .email("Enter a valid email address.")
      .refine((v) => v.toLowerCase() !== normalized, {
        message: "That is already your email.",
      }),
  });
}

export type ChangeEmailFormInput = z.infer<
  ReturnType<typeof changeEmailFormSchema>
>;
