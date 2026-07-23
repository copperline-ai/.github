import { z } from "zod";

const zipCode = z
  .string()
  .trim()
  .regex(/^\d{5}(-\d{4})?$/, "zipCode must be a valid US zip code (e.g. 10001)");

export const createUserSchema = z.object({
  name: z.string().trim().min(1, "name is required"),
  zipCode,
});

export const updateUserSchema = z
  .object({
    name: z.string().trim().min(1, "name must not be empty").optional(),
    zipCode: zipCode.optional(),
  })
  .refine((body) => body.name !== undefined || body.zipCode !== undefined, {
    message: "At least one of name or zipCode must be provided",
  });

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
