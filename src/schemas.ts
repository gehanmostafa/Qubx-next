import { z } from "zod";

export const signupSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email("Please enter a valid email"),
  phoneCode: z
    .string()
    .min(2, "Country code is required")
    .regex(/^\+\d+$/, "Invalid country code"),
  country: z.string().min(1, "Country is required"),
  phoneNumber: z
    .string()
    .min(6, "Phone number is too short")
    .max(15, "Phone number is too long")
    .regex(/^\d+$/, "Only digits allowed"),
  specialty: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val || ["Surgeon", "Biomedical Engineer", "Other"].includes(val),
      { message: "Please select a valid specialty" }
    ),
});
export type TSignupValues = z.infer<typeof signupSchema>;

export const otpSchema = z.object({
  otp: z
    .string()
    .min(6, "OTP must be 6 digits")
    .max(6, "OTP must be 6 digits")
    .regex(/^\d{6}$/, "OTP must contain only digits"),
});
export type TOtpValues = z.infer<typeof otpSchema>;

export const setPasswordSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .refine(
      (val) => /[A-Z]/.test(val),
      "Password must contain at least one uppercase letter"
    )
    .refine(
      (val) => /[a-z]/.test(val),
      "Password must contain at least one lowercase letter"
    )
    .refine(
      (val) => /\d/.test(val),
      "Password must contain at least one number"
    )
    .refine(
      (val) => /[@$!%*?&._-]/.test(val),
      "Password must contain at least one special character"
    ),
});
export type TPasswordValues = z.infer<typeof setPasswordSchema>;

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email or phone number is required")
    .refine(
      (value) =>
        /^\d{6,15}$/.test(value) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      "Please enter a valid email or phone number"
    ),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
export type TLoginValues = z.infer<typeof loginSchema>;


export const newRequestSchema = z.object({
  serviceId: z.number({ message: "Service is required" }),
  anatomyId: z.number({ message: "Anatomy is required" }),
  // message: z.string().optional(),
  files: z.any().optional(),
  imagingUrl: z.any().optional(),
});

export type NewRequestValues = z.infer<typeof newRequestSchema>;