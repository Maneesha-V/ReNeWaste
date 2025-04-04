import { z } from "zod";

export const wastePlantFormType = z.object({
  plantName: z.string().min(3, "Plant Name must be at least 3 characters long"),
  ownerName: z.string().min(3, "Owner Name must be at least 3 characters long"),
  location: z.string().min(5, "Location must be at least 5 characters long"),
  city: z.string().min(2, "City must be at least 2 characters long"),
  state: z.string().min(2, "State must be at least 2 characters long"),
  contactInfo: z
    .string()
    .min(3, "Contact Person must be at least 3 characters long"),
  contactNo: z.string().regex(/^\d{10}$/, "Contact must be a 10-digit number"),
  email: z.string().email("Invalid email format"),
  licenseNumber: z
    .string()
    .min(5, "License Number must be at least 5 characters long"),
  capacity: z
    .number()
    .positive("Capacity must be a valid number greater than 0"),
  status: z.enum(["Pending", "Active", "Inactive"]),
  subscriptionPlan: z.string().min(3, "Subscription Plan is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  licenseDocument: z
    .instanceof(File)
    .optional()
    .refine((file) => !file || file.type === "application/pdf", {
      message: "Only PDF files are allowed",
    }),
});

// Type for Form Data
export type WastePlantFormData = z.infer<typeof wastePlantFormType>;
