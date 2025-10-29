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
    .refine(
      (val) => ["Surgeon", "Biomedical Engineer", "Other"].includes(val),
      { message: "Please select your specialty" }
    ),
});
export type TSignupValues = z.infer<typeof signupSchema>;

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

export const otpSchema = z.object({
  otp: z
    .string()
    .min(6, "OTP must be 6 digits")
    .max(6, "OTP must be 6 digits")
    .regex(/^\d{6}$/, "OTP must contain only digits"),
});
export type TOtpValues = z.infer<typeof otpSchema>;
